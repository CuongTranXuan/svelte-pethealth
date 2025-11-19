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

async function migrateCustomers() {
  console.log('Migrating Customers...');
  const snapshot = await db.collection('customer').get();
  let count = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const { error } = await supabase.from('customers').insert({
      // Map fields
      id: data['created-Date'] || data.id, // Use created-Date as ID if available, otherwise fallback to doc ID
      phone: data.phone,
      name: data.name,
      address: data.address,
      email: data.email,
      gender: data.gender,
      // created_at: new Date(data['created-Date']).toISOString() // Optional: if we want to preserve creation time too
    });

    if (error) {
      if (error.code === '23505') {
        // Unique violation
        console.warn(`Customer ${data.phone} already exists. Skipping.`);
      } else {
        console.error(`Error migrating customer ${data.phone}:`, error.message);
      }
    } else {
      count++;
    }
  }
  console.log(`Migrated ${count} customers.`);
}

async function migratePets() {
  console.log('Migrating Pets...');
  const snapshot = await db.collection('pet').get();
  let count = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();

    // Find owner by phone
    const { data: owner } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', data.owner_phone)
      .single();

    if (!owner) {
      console.warn(`Owner not found for pet ${data.name} (Phone: ${data.owner_phone}). Skipping.`);
      continue;
    }

    const { error } = await supabase.from('pets').insert({
      owner_id: owner.id,
      name: data.name,
      species: data.species,
      age: data.age,
      gender: data.gender,
      description: data.description,
    });

    if (error) console.error(`Error migrating pet ${data.name}:`, error.message);
    else count++;
  }
  console.log(`Migrated ${count} pets.`);
}

async function migrateBills() {
  console.log('Migrating Bills...');
  const snapshot = await db.collection('bill').get();
  let count = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();

    // Find customer
    const { data: customer } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', data.customerPhone)
      .single();

    if (!customer) {
      console.warn(`Customer not found for bill (Phone: ${data.customerPhone}). Skipping.`);
      continue;
    }

    // Find pet (optional, try to match by name and owner)
    let petId = null;
    if (data.pet && data.pet.name) {
      const { data: pet } = await supabase
        .from('pets')
        .select('id')
        .eq('owner_id', customer.id)
        .eq('name', data.pet.name)
        .single();

      if (pet) petId = pet.id;
    }

    const { error } = await supabase.from('bills').insert({
      customer_id: customer.id,
      pet_id: petId,
      description: data.description,
      price: data.price,
      paid: data.paid,
      // Ensure date is YYYY-MM-DD for DATE column
      appointed_date: (data.appointmentDate || data.appointedDate || '').split('T')[0],
      selected_date: data.selectedDate,
      created_at: data.createdDate
        ? new Date(data.createdDate).toISOString()
        : new Date().toISOString(),
    });

    if (error) console.error(`Error migrating bill:`, error.message);
    else count++;
  }
  console.log(`Migrated ${count} bills.`);
}

async function run() {
  try {
    await migrateCustomers();
    await migratePets();
    await migrateBills();
    console.log('Migration complete!');
  } catch (err) {
    console.error('Migration failed:', err);
  }
}

run();
