<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import Navbar from '$lib/components/Navbar.svelte';

  let customers: any[] = [];
  let pets: any[] = [];
  let selectedCustomerId = '';
  let selectedPetId = '';
  let description = '';
  let price = 0;
  let paid = 0;
  let appointedDate = new Date().toISOString().split('T')[0];
  let selectedDate = new Date().toISOString().split('T')[0];
  let loading = false;
  let error = '';

  onMount(async () => {
    const { data } = await supabase.from('customers').select('id, name, phone');
    customers = data || [];
  });

  async function handleCustomerChange() {
    if (selectedCustomerId) {
      const { data } = await supabase
        .from('pets')
        .select('id, name')
        .eq('owner_id', selectedCustomerId);
      pets = data || [];
      selectedPetId = '';
    } else {
      pets = [];
    }
  }

  async function handleSubmit() {
    loading = true;
    error = '';

    if (!selectedCustomerId || !selectedPetId) {
      error = 'Please select a customer and a pet';
      loading = false;
      return;
    }

    const { error: insertError } = await supabase.from('bills').insert({
      customer_id: selectedCustomerId,
      pet_id: selectedPetId,
      description,
      price,
      paid,
      appointed_date: appointedDate,
      selected_date: selectedDate,
    });

    loading = false;

    if (insertError) {
      error = insertError.message;
    } else {
      goto('/bills');
    }
  }
</script>

<div class="min-h-screen bg-gray-100">
  <Navbar />

  <main class="py-10">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between mb-8">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Create New Bill
          </h2>
        </div>
      </div>

      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="customer" class="block text-sm font-medium text-gray-700"
                  >Customer</label
                >
                <div class="mt-1">
                  <select
                    id="customer"
                    bind:value={selectedCustomerId}
                    on:change={handleCustomerChange}
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Select Customer</option>
                    {#each customers as customer}
                      <option value={customer.id}>{customer.name} ({customer.phone})</option>
                    {/each}
                  </select>
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="pet" class="block text-sm font-medium text-gray-700">Pet</label>
                <div class="mt-1">
                  <select
                    id="pet"
                    bind:value={selectedPetId}
                    disabled={!selectedCustomerId}
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Select Pet</option>
                    {#each pets as pet}
                      <option value={pet.id}>{pet.name}</option>
                    {/each}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700"
                >Description / Services</label
              >
              <div class="mt-1">
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  bind:value={description}
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                ></textarea>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="price" class="block text-sm font-medium text-gray-700"
                  >Total Price (VND)</label
                >
                <div class="mt-1">
                  <input
                    type="number"
                    name="price"
                    id="price"
                    bind:value={price}
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="paid" class="block text-sm font-medium text-gray-700"
                  >Paid Amount (VND)</label
                >
                <div class="mt-1">
                  <input
                    type="number"
                    name="paid"
                    id="paid"
                    bind:value={paid}
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="appointedDate" class="block text-sm font-medium text-gray-700"
                  >Appointment Date</label
                >
                <div class="mt-1">
                  <input
                    type="date"
                    name="appointedDate"
                    id="appointedDate"
                    bind:value={appointedDate}
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="selectedDate" class="block text-sm font-medium text-gray-700"
                  >Invoice Date</label
                >
                <div class="mt-1">
                  <input
                    type="date"
                    name="selectedDate"
                    id="selectedDate"
                    bind:value={selectedDate}
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>

            {#if error}
              <div class="text-red-500 text-sm">{error}</div>
            {/if}

            <div class="flex justify-end">
              <a
                href="/bills"
                class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </a>
              <button
                type="submit"
                disabled={loading}
                class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {#if loading}
                  Saving...
                {:else}
                  Save
                {/if}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</div>
