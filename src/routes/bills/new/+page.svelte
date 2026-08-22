<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  onMount(() => goto('/orders/new'));
</script>

<div class="empty-state">
  <strong>Đang mở đơn hàng mới</strong>Tạo hóa đơn giờ nằm trong một quy trình đơn giản…
</div>
