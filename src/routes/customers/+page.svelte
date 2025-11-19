<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { user, loading as authLoading } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import Navbar from '$lib/components/Navbar.svelte';

  let customers: any[] = [];
  let loading = true; // Local loading state for customer data

  // Function to fetch customers
  async function fetchCustomers() {
    loading = true;
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching customers:', error);
      // Optionally handle error display to user
    } else {
      customers = data || [];
    }
    loading = false;
  }

  onMount(() => {
    const unsubscribe = user.subscribe(u => {
      if (!u && !$authLoading) {
        goto('/login');
      } else if (u) {
        fetchCustomers();
      }
    });
    return unsubscribe;
  });
</script>

<div class="min-h-screen bg-gray-100">
  <Navbar />

  <main class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Khách Hàng</h1>
        <a
          href="/customers/new"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Thêm Khách Hàng Mới
        </a>
      </div>

      {#if loading}
        <div class="text-center py-12">
          <div class="spinner">Đang tải...</div>
        </div>
      {:else if customers.length === 0}
        <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center text-gray-500">
          Không tìm thấy khách hàng nào.
        </div>
      {:else}
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            {#each customers as customer}
              <li>
                <a href="/customers/{customer.id}" class="block hover:bg-gray-50">
                  <div class="px-4 py-4 sm:px-6">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-indigo-600 truncate">{customer.name}</p>
                      <div class="ml-2 flex-shrink-0 flex">
                        <p
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                        >
                          {customer.phone}
                        </p>
                      </div>
                    </div>
                    <div class="mt-2 sm:flex sm:justify-between">
                      <div class="sm:flex">
                        <p class="flex items-center text-sm text-gray-500">
                          {customer.address || 'Chưa có địa chỉ'}
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </main>
</div>
