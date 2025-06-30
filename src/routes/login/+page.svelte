<script lang="ts">
  import { login } from '$lib/stores/auth';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let isLoading = false;
  let errorMessage = '';

  async function handleLogin() {
    // Clear any previous errors
    errorMessage = '';

    // Basic validation
    if (!email || !password) {
      errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    // Start loading
    isLoading = true;

    try {
      const result = await login(email, password);

      if (result.success) {
        goto('/home');
      } else {
        errorMessage = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      }
    } catch (error) {
      errorMessage = 'Có lỗi xảy ra. Vui lòng thử lại.';
    } finally {
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Đăng nhập - Pethealth Vĩnh Phúc</title>
</svelte:head>

<main class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <!-- Header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Đăng nhập</h1>
      <p class="text-gray-600 mt-2">Pethealth Vĩnh Phúc</p>
    </div>

    <!-- Login Form -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <form on:submit|preventDefault={handleLogin} class="space-y-4">

        <!-- Email Input -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            bind:value={email}
            placeholder="Nhập địa chỉ email"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Password Input -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Mật khẩu
          </label>
          <input
            id="password"
            type="password"
            bind:value={password}
            placeholder="Nhập mật khẩu"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <!-- Error Message -->
        {#if errorMessage}
          <div class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
            {errorMessage}
          </div>
        {/if}

        <!-- Login Button -->
        <button
          type="submit"
          disabled={isLoading}
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {#if isLoading}
            Đang đăng nhập...
          {:else}
            Đăng nhập
          {/if}
        </button>

      </form>
    </div>
  </div>
</main>