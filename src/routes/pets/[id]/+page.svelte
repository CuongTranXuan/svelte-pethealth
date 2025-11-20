<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabase';
  import Navbar from '$lib/components/Navbar.svelte';
  import { goto } from '$app/navigation';

  let pet: any = null;
  let owner: any = null;
  let bills: any[] = [];
  let loading = true;

  onMount(async () => {
    const { id } = $page.params;

    // Fetch pet
    const { data: petData, error: petError } = await supabase
      .from('pets')
      .select('*')
      .eq('id', id)
      .single();

    if (petData) {
      pet = petData;

      // Fetch owner
      const { data: ownerData } = await supabase
        .from('customers')
        .select('*')
        .eq('id', pet.owner_id)
        .single();
      owner = ownerData;

      // Fetch bills
      const { data: billsData } = await supabase
        .from('bills')
        .select('*')
        .eq('pet_id', id)
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
          <div class="spinner">Đang tải...</div>
        </div>
      {:else if !pet}
        <div class="text-center py-12">
          <div class="text-red-500">Không tìm thấy thú cưng.</div>
          <a href="/pets" class="mt-4 text-indigo-600 hover:text-indigo-900">Quay lại danh sách</a>
        </div>
      {:else}
        <div class="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">Hồ Sơ Thú Cưng</h3>
              <p class="mt-1 max-w-2xl text-sm text-gray-500">
                Thông tin chi tiết và lịch sử khám.
              </p>
            </div>
            <a href="/pets" class="text-sm text-indigo-600 hover:text-indigo-900"> ← Quay lại </a>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl class="sm:divide-y sm:divide-gray-200">
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Tên</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{pet.name}</dd>
              </div>
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Loài</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {pet.species || 'N/A'}
                </dd>
              </div>
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Tuổi</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{pet.age || 'N/A'}</dd>
              </div>
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Giới tính</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {pet.gender === 'Male' ? 'Đực' : pet.gender === 'Female' ? 'Cái' : 'N/A'}
                </dd>
              </div>
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Mô tả</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {pet.description || 'Không có mô tả'}
                </dd>
              </div>
              {#if owner}
                <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt class="text-sm font-medium text-gray-500">Chủ sở hữu</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <a href="/customers/{owner.id}" class="text-indigo-600 hover:text-indigo-900">
                      {owner.name} ({owner.phone})
                    </a>
                  </dd>
                </div>
              {/if}
            </dl>
          </div>
        </div>

        <!-- Medical History -->
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Lịch Sử Khám & Hóa Đơn</h3>
          </div>
          {#if bills.length === 0}
            <div class="p-6 text-center text-gray-500">Chưa có lịch sử khám nào.</div>
          {:else}
            <ul role="list" class="divide-y divide-gray-200">
              {#each bills as bill}
                <li class="px-4 py-4 sm:px-6">
                  <a href="/bills/{bill.id}" class="block hover:bg-gray-50">
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">{bill.description}</p>
                        <p class="text-sm text-gray-500">
                          Ngày hẹn: {bill.appointed_date || 'N/A'}
                        </p>
                      </div>
                      <div class="ml-4 flex flex-col items-end">
                        <p class="text-sm font-medium text-gray-900">
                          {formatPrice(bill.price)}
                        </p>
                        <p
                          class="text-xs {bill.paid >= bill.price
                            ? 'text-green-600'
                            : 'text-red-600'}"
                        >
                          {bill.paid >= bill.price ? 'Đã thanh toán' : 'Chưa thanh toán'}
                        </p>
                      </div>
                    </div>
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        </div>
      {/if}
    </div>
  </main>
</div>
