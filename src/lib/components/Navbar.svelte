<script lang="ts">
  import { user, logout } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  async function handleLogout() {
    await logout();
    goto('/login');
  }
</script>

<nav class="bg-white shadow">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">
          <a href={$user ? '/dashboard' : '/'} class="text-xl font-bold text-indigo-600"
            >PetHealth</a
          >
        </div>
        {#if $user}
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a
              href="/dashboard"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              class:border-indigo-500={$page.url.pathname === '/dashboard'}
              class:text-gray-900={$page.url.pathname === '/dashboard'}
            >
              Bảng Điều Khiển
            </a>
            <a
              href="/pets"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              class:border-indigo-500={$page.url.pathname.startsWith('/pets')}
              class:text-gray-900={$page.url.pathname.startsWith('/pets')}
            >
              Thú Cưng
            </a>
            <a
              href="/customers"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              class:border-indigo-500={$page.url.pathname.startsWith('/customers')}
              class:text-gray-900={$page.url.pathname.startsWith('/customers')}
            >
              Khách Hàng
            </a>
            <a
              href="/bills"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              class:border-indigo-500={$page.url.pathname.startsWith('/bills')}
              class:text-gray-900={$page.url.pathname.startsWith('/bills')}
            >
              Hóa Đơn
            </a>
            <a
              href="/statistics"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              class:border-indigo-500={$page.url.pathname.startsWith('/statistics')}
              class:text-gray-900={$page.url.pathname.startsWith('/statistics')}
            >
              Thống Kê
            </a>
          </div>
        {/if}
      </div>
      <div class="hidden sm:ml-6 sm:flex sm:items-center">
        {#if $user}
          <div class="ml-3 relative">
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-500">{$user.email}</span>
              <button
                on:click={handleLogout}
                class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span class="sr-only">Đăng xuất</span>
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        {:else}
          <div class="flex items-center gap-4">
            <a
              href="/login"
              class="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >Đăng Nhập</a
            >
            <a
              href="/register"
              class="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
              >Đăng Ký</a
            >
          </div>
        {/if}
      </div>
    </div>
  </div>
</nav>
