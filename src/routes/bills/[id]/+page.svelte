<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => goto(`/orders/${page.params.id}`));
</script>

<div class="empty-state">
  <strong>Opening the order record</strong>Taking you to the linked bill…
</div>
