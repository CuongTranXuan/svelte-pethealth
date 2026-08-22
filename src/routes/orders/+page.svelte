<script lang="ts">
  import OrderRow from '$lib/components/OrderRow.svelte';
  import { orders } from '$lib/data/pawline';

  let search = $state('');
  let paymentFilter = $state('All');

  const filteredOrders = $derived(
    orders.filter(order => {
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        `${order.id} ${order.customerName} ${order.petName}`.toLowerCase().includes(query);
      const matchesPayment = paymentFilter === 'All' || order.paymentStatus === paymentFilter;
      return matchesSearch && matchesPayment;
    })
  );
</script>

<svelte:head><title>Đơn hàng & hóa đơn · Pawline</title></svelte:head>

<div class="page-header">
  <div>
    <p class="eyebrow">Đơn hàng, thật gọn gàng</p>
    <h1>Đơn hàng & hóa đơn</h1>
    <p class="page-subtitle">
      Theo dõi rõ ràng mọi giao dịch từ lúc tạo đến khi thanh toán và nhận hàng.
    </p>
  </div>
  <a class="btn-primary" href="/orders/new"
    ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Tạo đơn hàng
  </a>
</div>

<div class="stat-strip">
  <div class="card">
    <p>Tổng đơn hàng</p>
    <strong>{orders.length}</strong>
  </div>
  <div class="card">
    <p>Đã thanh toán đủ</p>
    <strong>{orders.filter(order => order.paymentStatus === 'Paid').length}</strong>
  </div>
  <div class="card">
    <p>Cần chú ý</p>
    <strong style="color:#cf604d"
      >{orders.filter(order => order.paymentStatus === 'Overdue').length +
        orders.filter(order => order.paymentStatus === 'Pending').length}</strong
    >
  </div>
</div>

<section class="card table-card" style="margin-top:0">
  <div class="card-header">
    <div>
      <h2>Tất cả đơn hàng</h2>
      <p class="page-subtitle">Tìm theo đơn hàng, khách hàng hoặc thú cưng.</p>
    </div>
    <a class="muted-link" href="/bills">Mở danh sách hóa đơn →</a>
  </div>
  <div class="toolbar">
    <label class="search-field" aria-label="Search orders"
      ><svg viewBox="0 0 24 24" aria-hidden="true"
        ><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg
      ><input bind:value={search} placeholder="Tìm đơn hàng, khách hàng, thú cưng" /></label
    >
    <select class="select-field" bind:value={paymentFilter} aria-label="Filter by payment status"
      ><option value="All">Tất cả</option><option value="Paid">Đã thanh toán</option><option
        value="Pending">Chờ thanh toán</option
      ><option value="Overdue">Quá hạn</option></select
    >
  </div>
  <div class="table-scroll">
    <table class="data-table">
      <thead>
        <tr>
          <th>Đơn hàng</th>
          <th>Khách hàng & thú cưng</th>
          <th>Số tiền</th>
          <th>Thanh toán</th>
          <th>Trạng thái nhận hàng</th>
        </tr>
      </thead>
      <tbody>
        {#each filteredOrders as order}<OrderRow {order} />{:else}<tr
            ><td colspan="5"
              ><div class="empty-state">
                <strong>Không tìm thấy đơn hàng</strong>Hãy thử từ khóa hoặc bộ lọc thanh toán khác.
              </div></td
            ></tr
          >{/each}
      </tbody>
    </table>
  </div>
</section>
