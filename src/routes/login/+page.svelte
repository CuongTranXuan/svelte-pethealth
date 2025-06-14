<script lang="ts">
  import { login } from '$lib/stores/auth';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let email = 'a@gmail.com';
  let password = '';
  let isLoading = false;
  let errorMessage = '';

  const handleLogin = async () => {
    if (!email || !password) {
      errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    isLoading = true;
    errorMessage = '';

    const result = await login(email, password);

    if (result.success) {
      goto('/home');
    } else {
      errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
    }

    isLoading = false;
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };
</script>

<svelte:head>
  <title>Đăng nhập - Pethealth Vĩnh Phúc</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-4xl w-full space-y-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <!-- Left side - Image -->
      <div class="hidden lg:block">
        <div class="card p-0 overflow-hidden">
                    <div class="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <div class="text-center">
              <svg class="w-24 h-24 mx-auto text-blue-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <p class="text-gray-600 font-medium">Pethealth Management</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right side - Login Form -->
      <div class="w-full max-w-md mx-auto">
        <div class="card p-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
            <p class="text-lg font-semibold text-primary-600">Pethealth Vĩnh Phúc</p>
          </div>

          <form on:submit|preventDefault={handleLogin} class="space-y-6">
            <!-- Email Field (hidden but kept for compatibility) -->
            <input type="hidden" bind:value={email} />

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  bind:value={password}
                  on:keypress={handleKeyPress}
                  class="input-field pl-10"
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>
            </div>

            <!-- Error Message -->
            {#if errorMessage}
              <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {errorMessage}
              </div>
            {/if}

            <!-- Login Button -->
            <button
              type="submit"
              disabled={isLoading}
              class="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {#if isLoading}
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang đăng nhập...
              {:else}
                Đăng nhập
              {/if}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  /* Custom styles for enhanced visual appeal */
  .card {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
</style>