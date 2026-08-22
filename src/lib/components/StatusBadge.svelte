<script lang="ts">
  type Tone = 'positive' | 'attention' | 'danger' | 'neutral';

  const { label, tone = 'neutral' }: { label: string; tone?: Tone } = $props();
</script>

<span class="status-badge {tone}">{label}</span>
