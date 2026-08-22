<script lang="ts">
  const {
    label,
    value,
    detail,
    tone = 'green',
    icon = 'trend',
  }: {
    label: string;
    value: string;
    detail: string;
    tone?: 'coral' | 'green' | 'amber' | 'blue';
    icon?: 'trend' | 'receipt' | 'alert' | 'users';
  } = $props();
</script>

<div class="card metric-card">
  <div class="metric-icon {tone}">
    {#if icon === 'trend'}
      <svg viewBox="0 0 24 24" aria-hidden="true"
        ><path d="M4 16 9 11l4 3 7-7" /><path d="M15 7h5v5" /></svg
      >
    {:else if icon === 'receipt'}
      <svg viewBox="0 0 24 24" aria-hidden="true"
        ><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" /><path d="M9 8h6M9 12h6" /></svg
      >
    {:else if icon === 'alert'}
      <svg viewBox="0 0 24 24" aria-hidden="true"
        ><path d="m12 4 8 15H4L12 4Z" /><path d="M12 9v4M12 16h.01" /></svg
      >
    {:else}
      <svg viewBox="0 0 24 24" aria-hidden="true"
        ><circle cx="9" cy="8" r="3" /><path
          d="M3.5 19c.5-3 2.4-5 5.5-5s5 2 5.5 5M16 11a3 3 0 1 0-1.5-5.6M16 14c2.5 0 4 1.7 4.5 4"
        /></svg
      >
    {/if}
  </div>
  <div class="metric-label">{label}</div>
  <div class="metric-value">{value}</div>
  <div
    class="metric-detail {tone === 'coral'
      ? 'danger'
      : tone === 'amber'
        ? 'attention'
        : tone === 'green'
          ? 'positive'
          : ''}"
  >
    {detail}
  </div>
</div>
