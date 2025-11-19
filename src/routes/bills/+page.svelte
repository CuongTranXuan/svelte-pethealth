<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import Navbar from '$lib/components/Navbar.svelte';
  import { user, loading as authLoading } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let bills: any[] = [];
  let loading = true;

  async function fetchBills() {
    loading = true; // Set loading to true before fetching
    const { data, error } = await supabase
      .from('bills')
      .select(
        `
        *,
        customers (name, phone),
        pets (name)
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bills:', error);
      bills = []; // Clear bills on error
    } else {
      bills = data || [];
    }
    loading = false;
  }

  onMount(() => {
    // Subscribe to the user store to check authentication status
    const unsubscribe = user.subscribe(u => {
      // If user is not authenticated and the authentication state has finished loading
      if (!u && !$authLoading) {
        goto('/login'); // Redirect to login page
      } else if (u) {
        // If user is authenticated, fetch the bills
        fetchBills();
      }
    });

    // Return the unsubscribe function to clean up the subscription when the component is unmounted
    return unsubscribe;
  });

  function formatPrice(value: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }
</script>

<div class="min-h-screen bg-gray-100">
  <Navbar />

  <main class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Hóa Đơn & Lịch Hẹn</h1>
        <a
          href="/bills/new"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Tạo Hóa Đơn Mới
        </a>
      </div>

      {#if loading}
        <div class="text-center py-12">
          <div class="spinner">Đang tải...</div>
        </div>
      {:else if bills.length === 0}
        <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center text-gray-500">
          Không tìm thấy hóa đơn nào.
        </div>
      {:else}
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            {#each bills as bill}
              <li>
                <div class="block hover:bg-gray-50">
                  <div class="px-4 py-4 sm:px-6">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-indigo-600 truncate">
                        {bill.customers?.name} - {bill.pets?.name}
                      </p>
                      <div class="ml-2 flex-shrink-0 flex">
                        <p
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          {bill.paid >= bill.price
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'}"
                        >
                          {bill.paid >= bill.price ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </p>
                      </div>
                    </div>
                    <div class="mt-2 sm:flex sm:justify-between">
                      <div class="sm:flex">
                        <p class="flex items-center text-sm text-gray-500">
                          {bill.description}
                        </p>
                      </div>
                      <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Tổng: {formatPrice(bill.price)} • Đã trả: {formatPrice(bill.paid)}
                        </p>
                      </div>
                    </div>
                    <div class="mt-2 text-xs text-gray-400">
                      Ngày hẹn: {bill.appointed_date}
                    </div>
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </main>
</div>
