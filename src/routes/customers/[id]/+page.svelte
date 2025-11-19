<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabase';
  import Navbar from '$lib/components/Navbar.svelte';

  let customer: any = null;
  let pets: any[] = [];
  let bills: any[] = [];
  let loading = true;

  onMount(async () => {
    const { id } = $page.params;

    // Fetch customer
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (customerData) {
      customer = customerData;

      // Fetch pets
      const { data: petsData } = await supabase.from('pets').select('*').eq('owner_id', id);
      pets = petsData || [];

      // Fetch bills
      const { data: billsData } = await supabase
        .from('bills')
        .select('*, pets(name)')
        .eq('customer_id', id)
        .order('created_at', { ascending: false });
      bills = billsData || [];
    }

    loading = false;
  });

  function formatPrice(value: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }
</script>

<div class="min-h-screen bg-gray-100">
  <Navbar />

  <main class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {#if loading}
        <div class="text-center py-12">
          <div class="spinner">Loading...</div>
        </div>
      {:else if !customer}
        <div class="text-center py-12 text-red-500">Customer not found.</div>
      {:else}
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Customer Profile</h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">Personal details and history.</p>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl class="sm:divide-y sm:divide-gray-200">
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Full name</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.name}</dd>
              </div>
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Phone number</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.phone}</dd>
              </div>
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Address</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{customer.address}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <!-- Pets Section -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Pets</h3>
              <a href="/pets/new" class="text-sm text-indigo-600 hover:text-indigo-900">Add Pet</a>
            </div>
            <ul role="list" class="divide-y divide-gray-200">
              {#each pets as pet}
                <li class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-indigo-600 truncate">{pet.name}</p>
                    <p
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                    >
                      {pet.species}
                    </p>
                  </div>
                  <div class="mt-2 text-sm text-gray-500">
                    {pet.gender}, {pet.age} old
                  </div>
                  <p class="mt-1 text-sm text-gray-500">{pet.description}</p>
                </li>
              {/each}
              {#if pets.length === 0}
                <li class="px-4 py-4 sm:px-6 text-sm text-gray-500 text-center">
                  No pets registered.
                </li>
              {/if}
            </ul>
          </div>

          <!-- Bills Section -->
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 class="text-lg leading-6 font-medium text-gray-900">Bills & History</h3>
              <!-- <a href="/bills/new" class="text-sm text-indigo-600 hover:text-indigo-900">Create Bill</a> -->
            </div>
            <ul role="list" class="divide-y divide-gray-200">
              {#each bills as bill}
                <li class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium text-gray-900">
                      {bill.pets?.name || 'Unknown Pet'}
                    </p>
                    <p class="text-sm text-gray-500">{bill.created_at.split('T')[0]}</p>
                  </div>
                  <p class="mt-1 text-sm text-gray-500">{bill.description}</p>
                  <div class="mt-2 flex justify-between text-sm">
                    <span class="text-gray-900 font-medium">Total: {formatPrice(bill.price)}</span>
                    <span class="text-green-600">Paid: {formatPrice(bill.paid)}</span>
                  </div>
                </li>
              {/each}
              {#if bills.length === 0}
                <li class="px-4 py-4 sm:px-6 text-sm text-gray-500 text-center">No bills found.</li>
              {/if}
            </ul>
          </div>
        </div>
      {/if}
    </div>
  </main>
</div>
