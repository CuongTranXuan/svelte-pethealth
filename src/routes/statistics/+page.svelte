<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import { user, loading as authLoading } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import Navbar from '$lib/components/Navbar.svelte';

  type ViewMode = 'year' | 'month' | 'date';
  type Bill = {
    id: string;
    price: number;
    paid: number;
    appointed_date: string;
    created_at: string;
  };

  let bills: Bill[] = [];
  let loading = true;
  let viewMode: ViewMode = 'year';
  let selectedYear: number = new Date().getFullYear();
  let selectedMonth: number = new Date().getMonth() + 1;

  onMount(() => {
    const unsubscribe = user.subscribe(u => {
      if (!u && !$authLoading) {
        goto('/login');
      } else if (u) {
        fetchBills();
      }
    });
    return unsubscribe;
  });

  async function fetchBills() {
    loading = true;
    const { data, error } = await supabase
      .from('bills')
      .select('id, price, paid, appointed_date, created_at')
      .order('appointed_date', { ascending: false });

    if (error) {
      console.error('Error fetching bills:', error);
      bills = [];
    } else {
      bills = data || [];
    }
    loading = false;
  }

  function formatPrice(value: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }

  // Calculate revenue by year
  function getRevenueByYear() {
    const yearRevenue: Record<number, { total: number; paid: number; count: number }> = {};

    bills.forEach(bill => {
      const year = new Date(bill.appointed_date || bill.created_at).getFullYear();
      if (!yearRevenue[year]) {
        yearRevenue[year] = { total: 0, paid: 0, count: 0 };
      }
      yearRevenue[year].total += bill.price || 0;
      yearRevenue[year].paid += bill.paid || 0;
      yearRevenue[year].count++;
    });

    return Object.entries(yearRevenue)
      .map(([year, data]) => ({ year: parseInt(year), ...data }))
      .sort((a, b) => b.year - a.year);
  }

  // Calculate revenue by month for selected year
  function getRevenueByMonth(year: number) {
    const monthRevenue: Record<number, { total: number; paid: number; count: number }> = {};

    bills
      .filter(bill => new Date(bill.appointed_date || bill.created_at).getFullYear() === year)
      .forEach(bill => {
        const month = new Date(bill.appointed_date || bill.created_at).getMonth() + 1;
        if (!monthRevenue[month]) {
          monthRevenue[month] = { total: 0, paid: 0, count: 0 };
        }
        monthRevenue[month].total += bill.price || 0;
        monthRevenue[month].paid += bill.paid || 0;
        monthRevenue[month].count++;
      });

    return Object.entries(monthRevenue)
      .map(([month, data]) => ({ month: parseInt(month), ...data }))
      .sort((a, b) => b.month - a.month);
  }

  // Calculate revenue by date for selected month
  function getRevenueByDate(year: number, month: number) {
    const dateRevenue: Record<string, { total: number; paid: number; count: number }> = {};

    bills
      .filter(bill => {
        const date = new Date(bill.appointed_date || bill.created_at);
        return date.getFullYear() === year && date.getMonth() + 1 === month;
      })
      .forEach(bill => {
        const date = (bill.appointed_date || bill.created_at).split('T')[0];
        if (!dateRevenue[date]) {
          dateRevenue[date] = { total: 0, paid: 0, count: 0 };
        }
        dateRevenue[date].total += bill.price || 0;
        dateRevenue[date].paid += bill.paid || 0;
        dateRevenue[date].count++;
      });

    return Object.entries(dateRevenue)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  function getMonthName(month: number) {
    const monthNames = [
      'Tháng 1',
      'Tháng 2',
      'Tháng 3',
      'Tháng 4',
      'Tháng 5',
      'Tháng 6',
      'Tháng 7',
      'Tháng 8',
      'Tháng 9',
      'Tháng 10',
      'Tháng 11',
      'Tháng 12',
    ];
    return monthNames[month - 1];
  }

  $: yearData = getRevenueByYear();
  $: monthData = getRevenueByMonth(selectedYear);
  $: dateData = getRevenueByDate(selectedYear, selectedMonth);
</script>

<div class="min-h-screen bg-gray-100">
  <Navbar />

  <main class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Thống Kê Doanh Thu</h1>

      {#if loading}
        <div class="text-center py-12">
          <div class="spinner">Đang tải...</div>
        </div>
      {:else}
        <!-- View Mode Selector -->
        <div class="bg-white shadow sm:rounded-lg mb-6">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex gap-4 items-center">
              <label class="font-medium text-gray-700">Xem theo:</label>
              <div class="flex gap-2">
                <button
                  on:click={() => (viewMode = 'year')}
                  class="px-4 py-2 rounded-md {viewMode === 'year'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700'}"
                >
                  Năm
                </button>
                <button
                  on:click={() => (viewMode = 'month')}
                  class="px-4 py-2 rounded-md {viewMode === 'month'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700'}"
                >
                  Tháng
                </button>
                <button
                  on:click={() => (viewMode = 'date')}
                  class="px-4 py-2 rounded-md {viewMode === 'date'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700'}"
                >
                  Ngày
                </button>
              </div>

              {#if viewMode !== 'year'}
                <select
                  bind:value={selectedYear}
                  class="ml-4 px-3 py-2 border border-gray-300 rounded-md"
                >
                  {#each yearData as { year }}
                    <option value={year}>Năm {year}</option>
                  {/each}
                </select>
              {/if}

              {#if viewMode === 'date'}
                <select
                  bind:value={selectedMonth}
                  class="px-3 py-2 border border-gray-300 rounded-md"
                >
                  {#each Array(12) as _, i}
                    <option value={i + 1}>{getMonthName(i + 1)}</option>
                  {/each}
                </select>
              {/if}
            </div>
          </div>
        </div>

        <!-- Revenue Table -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {viewMode === 'year' ? 'Năm' : viewMode === 'month' ? 'Tháng' : 'Ngày'}
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Số Hóa Đơn
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tổng Doanh Thu
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Đã Thu
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Còn Lại
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {#if viewMode === 'year'}
                {#each yearData as row}
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <button
                        on:click={() => {
                          selectedYear = row.year;
                          viewMode = 'month';
                        }}
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        Năm {row.year}
                      </button>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.count}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(row.total)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {formatPrice(row.paid)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {formatPrice(row.total - row.paid)}
                    </td>
                  </tr>
                {/each}
              {:else if viewMode === 'month'}
                {#each monthData as row}
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <button
                        on:click={() => {
                          selectedMonth = row.month;
                          viewMode = 'date';
                        }}
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        {getMonthName(row.month)}
                      </button>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.count}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(row.total)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {formatPrice(row.paid)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {formatPrice(row.total - row.paid)}
                    </td>
                  </tr>
                {/each}
              {:else}
                {#each dateData as row}
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.date}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.count}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(row.total)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {formatPrice(row.paid)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {formatPrice(row.total - row.paid)}
                    </td>
                  </tr>
                {/each}
              {/if}
            </tbody>
          </table>

          {#if (viewMode === 'year' && yearData.length === 0) || (viewMode === 'month' && monthData.length === 0) || (viewMode === 'date' && dateData.length === 0)}
            <div class="p-6 text-center text-gray-500">Không có dữ liệu</div>
          {/if}
        </div>
      {/if}
    </div>
  </main>
</div>
