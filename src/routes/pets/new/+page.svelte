<script lang="ts">
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';
  import Navbar from '$lib/components/Navbar.svelte';

  const pet = {
    name: '',
    species: '',
    age: '',
    gender: '',
    description: '',
  };
  let ownerPhone = '';
  let ownerName = '';
  let loading = false;
  let message: { type: 'success' | 'error'; text: string } | null = null;

  async function checkOwner() {
    if (!ownerPhone) {
      message = { type: 'error', text: 'Vui lòng nhập số điện thoại chủ sở hữu' };
      return;
    }

    const { data, error } = await supabase
      .from('customers')
      .select('name')
      .eq('phone', ownerPhone)
      .single();

    if (error || !data) {
      ownerName = '';
      message = { type: 'error', text: 'Không tìm thấy khách hàng với số điện thoại này' };
    } else {
      ownerName = data.name;
      message = { type: 'success', text: 'Đã tìm thấy khách hàng' };
    }
  }

  async function handleSubmit() {
    loading = true;
    message = null;

    // First find the owner by phone
    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select('id')
      .eq('phone', ownerPhone)
      .single();

    if (customerError || !customers) {
      message = { type: 'error', text: 'Không tìm thấy khách hàng với số điện thoại này' };
      loading = false;
      return;
    }

    const { error: insertError } = await supabase.from('pets').insert({
      name: pet.name,
      species: pet.species,
      age: pet.age,
      gender: pet.gender,
      description: pet.description,
      owner_id: customers.id,
    });

    loading = false;

    if (insertError) {
      message = { type: 'error', text: insertError.message };
    } else {
      goto('/pets');
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
            Thêm Thú Cưng Mới
          </h2>
        </div>
      </div>

      <div class="bg-white shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <form class="space-y-6" on:submit|preventDefault={handleSubmit}>
            <div>
              <label for="owner" class="block text-sm font-medium text-gray-700">
                Số Điện Thoại Chủ Sở Hữu
              </label>
              <div class="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="owner"
                  id="owner"
                  required
                  bind:value={ownerPhone}
                  class="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                  placeholder="Nhập số điện thoại"
                />
                <button
                  type="button"
                  on:click={checkOwner}
                  class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm"
                >
                  Kiểm tra
                </button>
              </div>
              {#if ownerName}
                <p class="mt-2 text-sm text-green-600">Chủ sở hữu: {ownerName}</p>
              {/if}
            </div>

            <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div class="sm:col-span-3">
                <label for="name" class="block text-sm font-medium text-gray-700">
                  Tên Thú Cưng
                </label>
                <div class="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    bind:value={pet.name}
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="species" class="block text-sm font-medium text-gray-700"> Loài </label>
                <div class="mt-1">
                  <input
                    type="text"
                    name="species"
                    id="species"
                    bind:value={pet.species}
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Ví dụ: Chó, Mèo"
                  />
                </div>
              </div>

              <div class="sm:col-span-3">
                <label for="age" class="block text-sm font-medium text-gray-700"> Tuổi </label>
                <div class="mt-1">
                  <input
                    type="text"
                    name="age"
                    id="age"
                    bind:value={pet.age}
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
                    bind:value={pet.gender}
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Male">Đực</option>
                    <option value="Female">Cái</option>
                  </select>
                </div>
              </div>

              <div class="sm:col-span-6">
                <label for="description" class="block text-sm font-medium text-gray-700">
                  Mô Tả
                </label>
                <div class="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    bind:value={pet.description}
                    class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  ></textarea>
                </div>
              </div>
            </div>

            {#if message}
              <div
                class={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}
              >
                <div class="flex">
                  <div class="ml-3">
                    <p
                      class={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'}`}
                    >
                      {message.text}
                    </p>
                  </div>
                </div>
              </div>
            {/if}

            <div class="flex justify-end">
              <a
                href="/pets"
                class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Hủy
              </a>
              <button
                type="submit"
                disabled={loading}
                class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</div>
