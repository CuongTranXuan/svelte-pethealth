<script lang="ts">
  import { base } from '$app/paths';
  import { supabase } from '$lib/supabase';
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleRegister() {
    loading = true;
    error = '';

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    loading = false;

    if (signUpError) {
      error = signUpError.message;
    } else {
      goto(`${base}/`);
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Tạo tài khoản mới</h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        Hoặc
        <a href={base + '/login'} class="font-medium text-indigo-600 hover:text-indigo-500">
          đăng nhập vào tài khoản hiện có
        </a>
      </p>
    </div>
    <form class="mt-8 space-y-6" on:submit|preventDefault={handleRegister}>
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="email-address" class="sr-only">Địa chỉ Email</label>
          <input
            id="email-address"
            name="email"
            type="email"
            autocomplete="email"
            required
            bind:value={email}
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Địa chỉ Email"
          />
        </div>
        <div>
          <label for="password" class="sr-only">Mật khẩu</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="new-password"
            required
            bind:value={password}
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Mật khẩu"
          />
        </div>
      </div>

      {#if error}
        <div class="text-red-500 text-sm text-center">{error}</div>
      {/if}

      <div>
        <button
          type="submit"
          disabled={loading}
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {#if loading}
            Đang đăng ký...
          {:else}
            Đăng ký
          {/if}
        </button>
      </div>
    </form>
  </div>
</div>
