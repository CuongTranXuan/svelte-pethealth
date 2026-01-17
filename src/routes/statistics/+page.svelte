<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import Navbar from '$lib/components/Navbar.svelte';

  let years: number[] = [];
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let days: number[] = [];

  let selectedYear: number | null = new Date().getFullYear();
  let selectedMonth: number | null = new Date().getMonth() + 1;
  let selectedDay: number | null = new Date().getDate();

  let stats = {
    total_price: 0,
    total_paid: 0,
    total_debt: 0,
    bill_count: 0,
  };

  let bills: any[] = [];
  let loading = false;
  const billLimit = 50;

  function generateYears() {
    const currentYear = new Date().getFullYear();
    const tempYears = [];
    for (let i = 2018; i <= currentYear; i++) {
      tempYears.push(i);
    }
    // Sort descending
    years = tempYears.sort((a, b) => b - a);
  }

  function calculateDays() {
    days = [];
    if (!selectedYear || !selectedMonth) return;

    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const tempDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      tempDays.push(i);
    }
    days = tempDays;
  }

  function formatDateRange() {
    if (!selectedYear) return { start: null, end: null };

    let start = '';
    let end = '';

    if (selectedMonth === null) {
      // Full Year
      start = `${selectedYear}-01-01`;
      end = `${selectedYear}-12-31`;
    } else if (selectedDay === null) {
      // Full Month
      const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
      // Pad month
      const m = selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
      start = `${selectedYear}-${m}-01`;
      end = `${selectedYear}-${m}-${lastDay}`;
    } else {
      // Specific Day
      const m = selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
      const d = selectedDay < 10 ? `0${selectedDay}` : selectedDay;
      start = `${selectedYear}-${m}-${d}`;
      end = `${selectedYear}-${m}-${d}`;
    }
    return { start, end };
  }

  async function fetchStats() {
    loading = true;
    const { start, end } = formatDateRange();

    if (!start || !end) {
      loading = false;
      return;
    }

    // Call RPC for totals
    // Note: RPC logic in plan: get_bill_stats(start_date, end_date)
    const { data: statsData, error: statsError } = await supabase.rpc('get_bill_stats', {
      start_date: start,
      end_date: end,
    });

    if (statsError) {
      console.error('Error fetching stats:', statsError);
    } else if (statsData && statsData.length > 0) {
      // RPC returns an array of objects
      stats = statsData[0];
    } else {
      // Reset if no data
      stats = { total_price: 0, total_paid: 0, total_debt: 0, bill_count: 0 };
    }

    // Fetch Bills List (Limited to avoid overload, or pagination)
    // Legacy had full list, but suggested avoiding overload.
    // We will show top 100 most recent for the period.
    const { data: billsData, error: billsError } = await supabase
      .from('bills')
      .select(
        `
            *,
            pets (name),
            customers (name)
        `
      )
      .gte('selected_date', start)
      .lte('selected_date', end)
      .order('selected_date', { ascending: false })
      .limit(100);

    if (billsError) {
      console.error('Error fetching bills:', billsError);
      bills = [];
    } else {
      bills = billsData || [];
    }

    loading = false;
  }

  function formatCurrency(amount: number) {
    if (!amount) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  }

  function handleSearch() {
    fetchStats();
  }

  // Effect to recalculate days when month/year changes
  $: if (selectedYear || selectedMonth) {
    calculateDays();
  }

  onMount(() => {
    generateYears();
    calculateDays();
    fetchStats();
  });
</script>

<div class="min-h-screen bg-gray-50">
  <Navbar />

  <main class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Filters -->
      <div class="bg-white p-6 rounded-lg shadow mb-8">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Bộ Lọc Thời Gian</h2>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <!-- Year -->
          <div>
            <label for="year" class="block text-sm font-medium text-gray-700">Năm</label>
            <select
              id="year"
              bind:value={selectedYear}
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {#each years as y}
                <option value={y}>{y}</option>
              {/each}
            </select>
          </div>

          <!-- Month -->
          <div>
            <label for="month" class="block text-sm font-medium text-gray-700"
              >Tháng (Không bắt buộc)</label
            >
            <select
              id="month"
              bind:value={selectedMonth}
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value={null}>Cả năm</option>
              {#each months as m}
                <option value={m}>Tháng {m}</option>
              {/each}
            </select>
          </div>

          <!-- Day -->
          <div>
            <label for="day" class="block text-sm font-medium text-gray-700"
              >Ngày (Không bắt buộc)</label
            >
            <select
              id="day"
              bind:value={selectedDay}
              disabled={!selectedMonth}
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value={null}>Cả tháng</option>
              {#each days as d}
                <option value={d}>{d}</option>
              {/each}
            </select>
          </div>

          <!-- Search Button -->
          <div class="flex items-end">
            <button
              on:click={handleSearch}
              disabled={loading}
              class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {#if loading}
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang tải...
              {:else}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  />
                </svg>
                Tìm kiếm
              {/if}
            </button>
          </div>
          //
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Tổng Doanh Thu</dt>
            <dd class="mt-1 text-3xl font-semibold text-green-600">
              {formatCurrency(stats.total_price)}
            </dd>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Đã Thanh Toán</dt>
            <dd class="mt-1 text-3xl font-semibold text-blue-600">
              {formatCurrency(stats.total_paid)}
            </dd>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <dt class="text-sm font-medium text-gray-500 truncate">Còn Nợ</dt>
            <dd class="mt-1 text-3xl font-semibold text-red-600">
              {formatCurrency(stats.total_debt)}
            </dd>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >Ngày</th
                    >
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >Khách Hàng / Thú Cưng</th
                    >
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >Mô Tả</th
                    >
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >Tổng Tiền</th
                    >
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >Đã Trả</th
                    >
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  {#if bills.length === 0}
                    <tr>
                      <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                        Không có hóa đơn nào trong khoảng thời gian này.
                      </td>
                    </tr>
                  {/if}
                  {#each bills as bill}
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bill.selected_date}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div class="text-sm font-medium text-gray-900">
                          {bill.customers?.name || 'Unknown'}
                        </div>
                        <div class="text-sm text-gray-500">{bill.pets?.name || 'Unknown'}</div>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {bill.description}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(bill.price)}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(bill.paid)}
                        {#if bill.price > bill.paid}
                          <span
                            class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"
                          >
                            Nợ
                          </span>
                        {/if}
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </div>
            {#if bills.length >= 100}
              <div class="mt-4 text-center text-sm text-gray-500">
                Chỉ hiển thị 100 hóa đơn gần nhất. Thu hẹp khoảng thời gian để xem thêm.
              </div>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
