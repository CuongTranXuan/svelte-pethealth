import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

dotenv.config();

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate Config
if (!fs.existsSync(serviceAccountPath)) {
  console.error('Error: serviceAccountKey.json not found in scripts/ directory.');
  console.error(
    'Please download your Firebase Service Account key and place it at scripts/serviceAccountKey.json'
  );
  process.exit(1);
}

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Missing Supabase credentials in .env file.');
  console.error('Ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});
const db = admin.firestore();

// Initialize Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getAllCustomers() {
  const { data, error } = await supabase.from('customers').select('id, phone');
  if (error) throw error;
  return new Map(data.map(c => [c.id, c]));
}

async function getAllPets() {
  const { data, error } = await supabase.from('pets').select('owner_id, name');
  if (error) throw error;
  // Key: owner_id + name
  return new Set(data.map(p => `${p.owner_id}:${p.name}`));
}

async function getAllBills() {
  // Select fields needed for fuzzy matching
  const { data, error } = await supabase.from('bills').select('customer_id, appointed_date, price');
  if (error) throw error;
  // Key: customer_id + appointed_date + price
  return new Set(data.map(b => `${b.customer_id}:${b.appointed_date}:${b.price}`));
}

async function migrateCustomers() {
  console.log('Syncing Customers...');
  const snapshot = await db.collection('customer').get();
  let count = 0;
  const skipped = 0;

  // We use upsert for customers because we rely on the ID being the key.
  const customers = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    customers.push({
      id: data['created-Date'] || data.id,
      phone: data.phone,
      name: data.name,
      address: data.address,
      email: data.email,
      gender: data.gender,
    });
  }

  // Batch insert/upsert in chunks of 100
  for (let i = 0; i < customers.length; i += 100) {
    const chunk = customers.slice(i, i + 100);
    const { error } = await supabase.from('customers').upsert(chunk);

    if (error) {
      console.error('Error syncing customers batch:', error.message);
    } else {
      count += chunk.length;
    }
  }

  console.log(`Synced ${count} customers.`);
}

async function migratePets() {
  console.log('Syncing Pets...');
  const snapshot = await db.collection('pet').get();
  const existingPets = await getAllPets();
  const customerMap = await getAllCustomers(); // Need this to lookup owner_id by phone if needed?
  // Wait, local customer map is by ID.
  // In the loop we look up owner by phone.
  // Let's re-fetch map by Phone for faster lookup.
  const { data: customersByPhoneData } = await supabase.from('customers').select('id, phone');
  const customerIdByPhone = new Map(customersByPhoneData.map(c => [c.phone, c.id]));

  let count = 0;
  let skipped = 0;
  const petsToInsert = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const ownerId = customerIdByPhone.get(data.owner_phone);

    if (!ownerId) {
      // console.warn(`Owner not found for pet ${data.name} (Phone: ${data.owner_phone}). Skipping.`);
      continue;
    }

    const key = `${ownerId}:${data.name}`;
    if (existingPets.has(key)) {
      skipped++;
      continue;
    }

    petsToInsert.push({
      owner_id: ownerId,
      name: data.name,
      species: data.species,
      age: data.age,
      gender: data.gender,
      description: data.description,
    });
  }

  // Batch insert
  for (let i = 0; i < petsToInsert.length; i += 100) {
    const chunk = petsToInsert.slice(i, i + 100);
    const { error } = await supabase.from('pets').insert(chunk);
    if (error) console.error('Error inserting pets batch:', error.message);
    else count += chunk.length;
  }

  console.log(`Synced ${count} new pets (Skipped ${skipped} existing).`);
}

async function migrateBills() {
  console.log('Syncing Bills...');
  const snapshot = await db.collection('bill').get();
  const existingBills = await getAllBills();
  const { data: customersByPhoneData } = await supabase.from('customers').select('id, phone');
  const customerIdByPhone = new Map(customersByPhoneData.map(c => [c.phone, c.id]));

  // Also need pet map to find pet_id?
  const { data: petsData } = await supabase.from('pets').select('id, owner_id, name');
  // Map: owner_id:pet_name -> pet_id
  const petIdMap = new Map(petsData.map(p => [`${p.owner_id}:${p.name}`, p.id]));

  let count = 0;
  let skipped = 0;
  const billsToInsert = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const customerId = customerIdByPhone.get(data.customerPhone);

    if (!customerId) {
      // console.warn(`Customer not found for bill (Phone: ${data.customerPhone}). Skipping.`);
      continue;
    }

    const appointedDate = (data.appointmentDate || data.appointedDate || '').split('T')[0];
    const key = `${customerId}:${appointedDate}:${data.price}`;

    if (existingBills.has(key)) {
      skipped++;
      continue;
    }

    let petId = null;
    if (data.pet && data.pet.name) {
      petId = petIdMap.get(`${customerId}:${data.pet.name}`) || null;
    }

    billsToInsert.push({
      customer_id: customerId,
      pet_id: petId,
      description: data.description,
      price: data.price,
      paid: data.paid,
      appointed_date: appointedDate,
      selected_date: data.selectedDate,
      created_at: data.createdDate
        ? new Date(data.createdDate).toISOString()
        : new Date().toISOString(),
    });
  }

  // Batch insert
  for (let i = 0; i < billsToInsert.length; i += 100) {
    const chunk = billsToInsert.slice(i, i + 100);
    const { error } = await supabase.from('bills').insert(chunk);
    if (error) console.error('Error inserting bills batch:', error.message);
    else count += chunk.length;
  }

  console.log(`Synced ${count} new bills (Skipped ${skipped} existing).`);
}

async function run() {
  try {
    const start = Date.now();
    await migrateCustomers();
    await migratePets();
    await migrateBills();
    const duration = (Date.now() - start) / 1000;
    console.log(`Syncing complete in ${duration}s!`);
  } catch (err) {
    console.error('Syncing failed:', err);
  }
}

run();
