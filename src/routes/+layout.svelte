<script lang="ts">
  import type { Snippet } from 'svelte';
  import '../app.css';
  import AppShell from '$lib/components/AppShell.svelte';

  const { children }: { children: Snippet } = $props();
</script>

<AppShell {children} />
