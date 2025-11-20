<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabase';
  import Navbar from '$lib/components/Navbar.svelte';

  let bill: any = null;
  let customer: any = null;
  let pet: any = null;
  let loading = true;

  onMount(async () => {
    const { id } = $page.params;

    // Fetch bill with related data
    const { data: billData, error: billError } = await supabase
      .from('bills')
      .select('*, customers(*), pets(*)')
      .eq('id', id)
      .single();

    if (billData) {
      bill = billData;
      customer = billData.customers;
      pet = billData.pets;
    }

    loading = false;
  });

  function formatPrice(value: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  }

  function formatDate(dateStr: string) {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  }
</script>

<div class="min-h-screen bg-gray-100">
  <Navbar />

  <main class="py-10">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {#if loading}
        <div class="text-center py-12">
          <div class="spinner">Đang tải...</div>
        </div>
      {:else if !bill}
        <div class="text-center py-12">
          <div class="text-red-500">Không tìm thấy hóa đơn.</div>
          <a href="/bills" class="mt-4 text-indigo-600 hover:text-indigo-900">Quay lại danh sách</a>
        </div>
      {:else}
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <!-- Header -->
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">Chi Tiết Hóa Đơn</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">ID: {bill.id}</p>
            </div>
            <div class="flex gap-2">
              <a href="/bills" class="text-sm text-indigo-600 hover:text-indigo-900">
                ← Quay lại
              </a>
              <button
                on:click={() => window.print()}
                class="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                In
              </button>
            </div>
          </div>

          <!-- Customer & Pet Info -->
          <div class="px-4 py-5 sm:p-6 border-b border-gray-200">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-2">Thông Tin Khách Hàng</h4>
                {#if customer}
                  <dl class="space-y-1">
                    <div>
                      <dt class="text-xs text-gray-500">Tên:</dt>
                      <dd class="text-sm text-gray-900">
                        <a
                          href="/customers/{customer.id}"
                          class="text-indigo-600 hover:text-indigo-900"
                        >
                          {customer.name}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt class="text-xs text-gray-500">Số điện thoại:</dt>
                      <dd class="text-sm text-gray-900">{customer.phone}</dd>
                    </div>
                    {#if customer.address}
                      <div>
                        <dt class="text-xs text-gray-500">Địa chỉ:</dt>
                        <dd class="text-sm text-gray-900">{customer.address}</dd>
                      </div>
                    {/if}
                  </dl>
                {:else}
                  <p class="text-sm text-gray-500">Không có thông tin</p>
                {/if}
              </div>

              <div>
                <h4 class="text-sm font-medium text-gray-500 mb-2">Thông Tin Thú Cưng</h4>
                {#if pet}
                  <dl class="space-y-1">
                    <div>
                      <dt class="text-xs text-gray-500">Tên:</dt>
                      <dd class="text-sm text-gray-900">
                        <a href="/pets/{pet.id}" class="text-indigo-600 hover:text-indigo-900">
                          {pet.name}
                        </a>
                      </dd>
                    </div>
                    {#if pet.species}
                      <div>
                        <dt class="text-xs text-gray-500">Loài:</dt>
                        <dd class="text-sm text-gray-900">{pet.species}</dd>
                      </div>
                    {/if}
                    {#if pet.age}
                      <div>
                        <dt class="text-xs text-gray-500">Tuổi:</dt>
                        <dd class="text-sm text-gray-900">{pet.age}</dd>
                      </div>
                    {/if}
                  </dl>
                {:else}
                  <p class="text-sm text-gray-500">Không có thông tin</p>
                {/if}
              </div>
            </div>
          </div>

          <!-- Bill Details -->
          <div class="px-4 py-5 sm:p-6">
            <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <dt class="text-sm font-medium text-gray-500">Dịch vụ / Mô tả</dt>
                <dd class="mt-1 text-sm text-gray-900">{bill.description || 'Không có mô tả'}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Ngày hẹn</dt>
                <dd class="mt-1 text-sm text-gray-900">{formatDate(bill.appointed_date)}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Ngày tạo</dt>
                <dd class="mt-1 text-sm text-gray-900">{formatDate(bill.created_at)}</dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Tổng tiền</dt>
                <dd class="mt-1 text-lg font-semibold text-gray-900">
                  {formatPrice(bill.price || 0)}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Đã thanh toán</dt>
                <dd class="mt-1 text-lg font-semibold text-green-600">
                  {formatPrice(bill.paid || 0)}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Còn lại</dt>
                <dd
                  class="mt-1 text-lg font-semibold {bill.price - bill.paid > 0
                    ? 'text-red-600'
                    : 'text-gray-900'}"
                >
                  {formatPrice((bill.price || 0) - (bill.paid || 0))}
                </dd>
              </div>

              <div>
                <dt class="text-sm font-medium text-gray-500">Trạng thái thanh toán</dt>
                <dd class="mt-1">
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full {bill.paid >=
                    bill.price
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'}"
                  >
                    {bill.paid >= bill.price ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      {/if}
    </div>
  </main>
</div>

<style>
  @media print {
    :global(nav) {
      display: none;
    }
    button {
      display: none;
    }
  }
</style>
