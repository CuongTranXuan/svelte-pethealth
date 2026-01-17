<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabase';
  import Navbar from '$lib/components/Navbar.svelte';
  import { user, loading as authLoading } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let pets: any[] = [];
  let loading = true; // This 'loading' is for pets data

  async function fetchPets() {
    loading = true; // Set loading to true when fetching starts
    const { data, error } = await supabase
      .from('pets')
      .select(
        `
        *,
        customers (name, phone)
      `
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching pets:', error);
    } else {
      pets = data || [];
    }
    loading = false;
  }

  onMount(() => {
    const unsubscribe = user.subscribe(u => {
      if (!u && !$authLoading) {
        goto('/login');
      } else if (u) {
        fetchPets();
      }
    });
    return unsubscribe;
  });
</script>

```svelte
<div class="min-h-screen bg-gray-100">
  <Navbar />

  <main class="py-10">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Thú Cưng</h1>
        <a
          href="/pets/new"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Thêm Thú Cưng Mới
        </a>
      </div>

      {#if loading}
        <div class="text-center py-12">
          <div class="spinner">Đang tải...</div>
        </div>
      {:else if pets.length === 0}
        <div class="bg-white shadow overflow-hidden sm:rounded-lg p-6 text-center text-gray-500">
          Không tìm thấy thú cưng nào.
        </div>
      {:else}
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            {#each pets as pet}
              <li>
                <a href="/pets/{pet.id}" class="block hover:bg-gray-50">
                  <div class="px-4 py-4 sm:px-6">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-indigo-600 truncate">{pet.name}</p>
                      <div class="ml-2 flex-shrink-0 flex">
                        <p
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                        >
                          {pet.species}
                        </p>
                      </div>
                    </div>
                    <div class="mt-2 sm:flex sm:justify-between">
                      <div class="sm:flex">
                        <p class="flex items-center text-sm text-gray-500">
                          Chủ: {pet.customers?.name} ({pet.customers?.phone})
                        </p>
                      </div>
                      <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          {pet.gender} • {pet.age} tuổi
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            {/each}
          </ul>
        </div>
      {/if}
    </div>
  </main>
</div>
