<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/auth';
  import { db } from '$lib/firebase';
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { goto } from '$app/navigation';

  interface Bill {
    customerName: string;
    customerPhone: string;
    pet: {
      name: string;
    };
    description: string;
    price: number;
    paid: number;
    appointedDate: string;
  }

  let bills: Bill[] = [];
  let loading = true;
  let todayDate = '';

  // Check authentication
  user.subscribe(currentUser => {
    if (!currentUser && !loading) {
      goto('/login');
    }
  });

  const formatPrice = (value: number): string => {
    return (value).toLocaleString('vi-VN', { minimumFractionDigits: 0 });
  };

  const getTodayAppointments = async () => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const date = String(today.getDate()).padStart(2, '0');
      todayDate = `${year}-${month}-${date}`;

      const billsRef = collection(db, 'bill');
      const q = query(billsRef, where('appointedDate', '==', todayDate));
      const querySnapshot = await getDocs(q);

      bills = [];
      querySnapshot.forEach((doc) => {
        bills.push(doc.data() as Bill);
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      loading = false;
    }
  };

  onMount(() => {
    getTodayAppointments();
  });
</script>

<svelte:head>
  <title>Trang chủ - Pethealth Vĩnh Phúc</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
  <!-- Header -->
  <header class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Pethealth Vĩnh Phúc</h1>
          <p class="text-sm text-gray-600">Hệ thống quản lý thú cưng</p>
        </div>
        <nav class="flex space-x-4">
          <a href="/home" class="text-primary-600 hover:text-primary-700 font-medium">Trang chủ</a>
          <a href="/customers" class="text-gray-600 hover:text-gray-700">Khách hàng</a>
          <a href="/bills" class="text-gray-600 hover:text-gray-700">Hóa đơn</a>
          <a href="/statistics" class="text-gray-600 hover:text-gray-700">Thống kê</a>
        </nav>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-white mb-2">
        Những khách hẹn gặp hôm nay
      </h2>
      <p class="text-blue-100">
        Ngày {new Date().toLocaleDateString('vi-VN')} - {bills.length} lịch hẹn
      </p>
    </div>

    {#if loading}
      <div class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    {:else if bills.length === 0}
      <div class="text-center py-12">
        <svg class="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
        </svg>
        <h3 class="text-xl font-medium text-gray-900 mb-2">Không có lịch hẹn hôm nay</h3>
        <p class="text-gray-600">Hôm nay không có khách hàng nào đặt lịch hẹn.</p>
      </div>
    {:else}
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each bills as bill}
          <div class="card p-6 hover:shadow-lg transition-shadow duration-200">
            <div class="border-b border-gray-200 pb-4 mb-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">
                {bill.customerName}
              </h3>
              <p class="text-sm text-gray-600">
                SĐT: {bill.customerPhone}
              </p>
            </div>

            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-700">Tên thú cưng:</span>
                <span class="text-sm text-gray-900">{bill.pet.name}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-700">Thông tin:</span>
                <span class="text-sm text-gray-900 text-right max-w-xs truncate" title={bill.description}>
                  {bill.description}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-700">Tổng tiền:</span>
                <span class="text-sm font-semibold text-gray-900">
                  {formatPrice(bill.price * 1000)}đ
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-sm font-medium text-gray-700">Đã thanh toán:</span>
                <span class="text-sm text-green-600 font-medium">
                  {formatPrice(bill.paid * 1000)}đ
                </span>
              </div>

              <div class="flex justify-between pt-2 border-t border-gray-100">
                <span class="text-sm font-medium text-gray-700">Cần thanh toán:</span>
                <span class="text-sm font-bold {bill.price * 1000 - bill.paid * 1000 > 0 ? 'text-red-600' : 'text-green-600'}">
                  {formatPrice(bill.price * 1000 - bill.paid * 1000)}đ
                </span>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex space-x-2">
                <button class="flex-1 bg-primary-50 text-primary-700 hover:bg-primary-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Xem chi tiết
                </button>
                <button class="flex-1 bg-green-50 text-green-700 hover:bg-green-100 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </main>
</div>

<style>
  /* Custom gradient background */
  main {
    background-image: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%);
  }
</style>