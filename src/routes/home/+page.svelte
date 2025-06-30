<script lang="ts">
  import { onMount } from 'svelte';
  import { user } from '$lib/stores/auth';
  import { db } from '$lib/firebase';
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { goto } from '$app/navigation';

  // Types
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

  // Reactive variables
  let bills: Bill[] = [];
  let loading = true;
  let todayDate = '';

  // Check if user is authenticated
  user.subscribe(currentUser => {
    if (!currentUser && !loading) {
      goto('/login');
    }
  });

  // Format price to Vietnamese currency
  function formatPrice(value: number): string {
    return value.toLocaleString('vi-VN', { minimumFractionDigits: 0 });
  }

  // Get today's appointments from database
  async function getTodayAppointments() {
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const date = String(today.getDate()).padStart(2, '0');
      todayDate = `${year}-${month}-${date}`;

      // Query database for today's appointments
      const billsRef = collection(db, 'bill');
      const q = query(billsRef, where('appointedDate', '==', todayDate));
      const querySnapshot = await getDocs(q);

      // Process results
      bills = [];
      querySnapshot.forEach(doc => {
        bills.push(doc.data() as Bill);
      });
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      loading = false;
    }
  }

  // Load data when component mounts
  onMount(() => {
    getTodayAppointments();
  });
</script>

<svelte:head>
  <title>Trang chủ - Pethealth Vĩnh Phúc</title>
</svelte:head>

<main class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-6xl mx-auto px-4 py-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Pethealth Vĩnh Phúc</h1>
          <p class="text-gray-600">Hệ thống quản lý thú cưng</p>
        </div>

        <nav class="flex space-x-6">
          <a href="/home" class="text-blue-600 font-medium">Trang chủ</a>
          <a href="/customers" class="text-gray-600 hover:text-gray-900">Khách hàng</a>
          <a href="/bills" class="text-gray-600 hover:text-gray-900">Hóa đơn</a>
          <a href="/statistics" class="text-gray-600 hover:text-gray-900">Thống kê</a>
        </nav>
      </div>
    </div>
  </header>

  <!-- Main Content -->
  <div class="max-w-6xl mx-auto px-4 py-8">
    <!-- Page Title -->
    <div class="mb-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Lịch hẹn hôm nay</h2>
      <p class="text-gray-600">
        {new Date().toLocaleDateString('vi-VN')} - {bills.length} lịch hẹn
      </p>
    </div>

    <!-- Loading State -->
    {#if loading}
      <div class="flex justify-center py-12">
        <div
          class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>

      <!-- Empty State -->
    {:else if bills.length === 0}
      <div class="text-center py-12">
        <div class="text-6xl mb-4">📅</div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">Không có lịch hẹn hôm nay</h3>
        <p class="text-gray-600">Hôm nay không có khách hàng nào đặt lịch hẹn.</p>
      </div>

      <!-- Bills List -->
    {:else}
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each bills as bill}
          <div
            class="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <!-- Customer Info -->
            <div class="border-b border-gray-100 pb-4 mb-4">
              <h3 class="text-lg font-semibold text-gray-900">{bill.customerName}</h3>
              <p class="text-gray-600">SĐT: {bill.customerPhone}</p>
            </div>

            <!-- Bill Details -->
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-700">Tên thú cưng:</span>
                <span class="font-medium">{bill.pet.name}</span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-700">Dịch vụ:</span>
                <span class="font-medium text-right max-w-32 truncate" title={bill.description}>
                  {bill.description}
                </span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-700">Tổng tiền:</span>
                <span class="font-semibold">{formatPrice(bill.price * 1000)}đ</span>
              </div>

              <div class="flex justify-between">
                <span class="text-gray-700">Đã thanh toán:</span>
                <span class="text-green-600 font-medium">{formatPrice(bill.paid * 1000)}đ</span>
              </div>

              <div class="flex justify-between pt-2 border-t border-gray-100">
                <span class="text-gray-700">Còn lại:</span>
                <span
                  class="font-bold {bill.price * 1000 - bill.paid * 1000 > 0
                    ? 'text-red-600'
                    : 'text-green-600'}"
                >
                  {formatPrice(bill.price * 1000 - bill.paid * 1000)}đ
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-6 flex space-x-3">
              <button
                class="flex-1 bg-blue-50 text-blue-700 hover:bg-blue-100 py-2 px-3 rounded-md text-sm font-medium transition-colors"
              >
                Chi tiết
              </button>
              <button
                class="flex-1 bg-green-50 text-green-700 hover:bg-green-100 py-2 px-3 rounded-md text-sm font-medium transition-colors"
              >
                Thanh toán
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</main>
