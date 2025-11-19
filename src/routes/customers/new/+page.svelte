<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import Navbar from '$lib/components/Navbar.svelte';

  let name = '';
  let phone = '';
  let address = '';
  let email = '';
  let gender = 'Male';
  let loading = false;
  let error = '';

  async function handleSubmit() {
    loading = true;
    error = '';

    const { error: insertError } = await supabase.from('customers').insert({
      name,
      phone,
      address,
      email,
      gender,
    });

    loading = false;

    if (insertError) {
      error = insertError.message;
    } else {
      goto('/customers');
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
            Thêm Khách Hàng Mới
          </h2>
        </div>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="name" class="block text-sm font-medium text-gray-700">
                  Họ và Tên
                </label>
                <div class="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    bind:value={name}
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="phone" class="block text-sm font-medium text-gray-700">
                  Số Điện Thoại
                </label>
                <div class="mt-1">
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    required
                    bind:value={phone}
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-4">
                <label for="email" class="block text-sm font-medium text-gray-700"> Email </label>
                <div class="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    bind:value={email}
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="gender" class="block text-sm font-medium text-gray-700">
                  Giới Tính
                </label>
                <div class="mt-1">
                  <select
                    id="gender"
                    name="gender"
                    bind:value={gender}
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Nam</option>
                    <option value="Female">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                </div>
              </div>

              <div class="sm:col-span-6">
                <label for="address" class="block text-sm font-medium text-gray-700">
                  Địa Chỉ
                </label>
                <div class="mt-1">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    bind:value={address}
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
                href="/customers"
                class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Hủy
              </a>
              <button
                type="submit"
                disabled={loading}
                class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {#if loading}
                  Đang lưu...
                {:else}
                  Lưu
                {/if}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</div>
