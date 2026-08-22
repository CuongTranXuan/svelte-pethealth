<script lang="ts">
  import OrderRow from '$lib/components/OrderRow.svelte';
  import { orders } from '$lib/data/pawline';
  import { formatCurrency } from '$lib/utils/format';

  const openBills = orders.filter(order => order.paymentStatus !== 'Paid');
  const outstanding = openBills.reduce((sum, order) => sum + order.total, 0);
</script>

<svelte:head><title>Hóa đơn · Pawline</title></svelte:head>
<div class="page-header">
  <div>
    <p class="eyebrow">Một lời nhắc nhẹ nhàng</p>
    <h1>Hóa đơn</h1>
    <p class="page-subtitle">Xem khoản nào đã hoàn tất và khoản nào cần một lời nhắc thân thiện.</p>
  </div>
  <a class="btn-secondary" href="/orders">Quay lại đơn hàng</a>
</div>
<div class="metric-grid">
  <div class="card metric-card">
    <div class="metric-label">Chưa thu</div>
    <div class="metric-value">{formatCurrency(outstanding)}</div>
    <div class="metric-detail attention">Across {openBills.length} hóa đơn đang mở</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Hóa đơn đã thu</div>
    <div class="metric-value">{orders.filter(order => order.paymentStatus === 'Paid').length}</div>
    <div class="metric-detail positive">Tiếp tục nhịp tốt này</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Overdue</div>
    <div class="metric-value">
      {orders.filter(order => order.paymentStatus === 'Overdue').length}
    </div>
    <div class="metric-detail danger">Cần theo dõi</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Tỷ lệ thu tiền</div>
    <div class="metric-value">
      {Math.round(
        (orders.filter(order => order.paymentStatus === 'Paid').length / orders.length) * 100
      )}%
    </div>
    <div class="metric-detail positive">Trên tổng đơn mẫu</div>
  </div>
</div>
<section class="card table-card" style="margin-top:0">
  <div class="card-header">
    <div>
      <h2>Lịch sử hóa đơn</h2>
      <p class="page-subtitle">Hóa đơn được liên kết với đơn gốc để dễ theo dõi.</p>
    </div>
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
      <tbody
        >{#each orders as order}<OrderRow {order} />{/each}</tbody
      >
    </table>
  </div>
</section>
