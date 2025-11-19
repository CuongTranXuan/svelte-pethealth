<script lang="ts">
  import { onMount } from 'svelte';
  import { user, loading } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { supabase } from '$lib/supabase';
  import Navbar from '$lib/components/Navbar.svelte';

  let appointments: any[] = [];
  let isLoadingData = true;

  onMount(() => {
    // Auth check
    const unsubscribe = user.subscribe(u => {
      if (!u && !$loading) {
        goto('/login');
      } else if (u) {
        fetchAppointments();
      }
    });

    return unsubscribe;
  });

  async function fetchAppointments() {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('bills')
      .select(
        `
        *,
        customers (name, phone),
        pets (name)
      `
      )
      .eq('appointed_date', today);

    if (error) {
      console.error('Error fetching appointments:', error);
    } else {
      appointments = data || [];
    }
    isLoadingData = false;
  }

  function formatPrice(value: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }
</script>

<div class="min-h-screen bg-gray-100">
  <Navbar />

  <main class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Lịch Hẹn Hôm Nay</h1>

      {#if isLoadingData}
        <div class="text-center py-12">
          <div class="spinner">Đang tải...</div>
        </div>
      {:else if appointments.length === 0}
        <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center text-gray-500">
          Không có lịch hẹn nào cho hôm nay.
        </div>
      {:else}
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Khách Hàng
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thú Cưng
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Dịch Vụ
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Trạng Thái
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thanh Toán
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#each appointments as appointment}
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {appointment.customers?.name}
                    </div>
                    <div class="text-sm text-gray-500">{appointment.customers?.phone}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{appointment.pets?.name}</div>
                    <div class="text-sm text-gray-500">{appointment.pets?.species}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{appointment.description}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      {appointment.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'}"
                    >
                      {appointment.status === 'completed' ? 'Hoàn thành' : 'Đang chờ'}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="text-sm text-gray-900">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(appointment.price)}
                    </div>
                    <div
                      class="text-xs {appointment.paid >= appointment.price
                        ? 'text-green-600'
                        : 'text-red-600'}"
                    >
                      {appointment.paid >= appointment.price ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
    </div>
  </main>
</div>
