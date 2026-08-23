<script lang="ts">
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => goto(`${base}/dashboard`));
</script>

<svelte:head><title>Pawline</title></svelte:head>
<div class="empty-state"><strong>Opening Pawline</strong>Taking you to the workspace…</div>
