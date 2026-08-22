<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => goto(`/orders/${page.params.id}`));
</script>

<div class="empty-state">
  <strong>Đang mở hồ sơ đơn hàng</strong>Đang chuyển đến hóa đơn liên kết…
</div>
