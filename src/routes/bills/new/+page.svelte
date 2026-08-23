<script lang="ts">
  import { base } from '$app/paths';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => goto(`${base}/orders/new`));
</script>

<div class="empty-state">
  <strong>Đang mở đơn hàng mới</strong>Tạo hóa đơn giờ nằm trong một quy trình đơn giản…
</div>
