<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => goto('/orders/new'));
</script>

<div class="empty-state">
  <strong>Opening a new order</strong>Bill creation now lives in one simple workflow…
</div>
