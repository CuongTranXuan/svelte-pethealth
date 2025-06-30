<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  // Redirect to login when page loads
  onMount(() => {
    goto('/login');
  });
</script>

<svelte:head>
  <title>Pethealth Vĩnh Phúc</title>
</svelte:head>

<main class="min-h-screen bg-gray-50 flex items-center justify-center">
  <div class="text-center">
    <div
      class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"
    ></div>
    <p class="text-gray-600">Đang chuyển hướng...</p>
  </div>
</main>
