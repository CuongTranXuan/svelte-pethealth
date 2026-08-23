<script lang="ts">
  import { base } from '$app/paths';
  import MetricCard from '$lib/components/MetricCard.svelte';
  import OrderRow from '$lib/components/OrderRow.svelte';
  import RevenueChart from '$lib/components/RevenueChart.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { customers, orders, products, revenueByPeriod } from '$lib/data/pawline';
  import { formatCurrency, translateCategory } from '$lib/utils/format';

  const lowStock = products.filter(product => product.status !== 'In stock');
  const paidRevenue = orders
    .filter(order => order.paymentStatus === 'Paid')
    .reduce((sum, order) => sum + order.total, 0);
  const outstanding = orders
    .filter(order => order.paymentStatus !== 'Paid')
    .reduce((sum, order) => sum + order.total, 0);
</script>

<svelte:head><title>Tổng quan · Pawline</title></svelte:head>

<div class="page-header">
  <div>
    <p class="eyebrow">Thứ Sáu, 22 tháng 8, 2026</p>
    <h1>Chào buổi sáng, Cuong.</h1>
    <p class="page-subtitle">Đây là bức tranh nhỏ về một ngày bận rộn và khỏe mạnh tại Pawline.</p>
  </div>
  <a class="btn-primary" href={base + '/orders/new'}
    ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Tạo đơn hàng
  </a>
</div>

<div class="metric-grid">
  <MetricCard
    label="Doanh thu tháng này"
    value={formatCurrency(96870000)}
    detail="↑ 12,8% so với tháng trước"
    tone="coral"
    icon="trend"
  />
  <MetricCard
    label="Đơn hàng tháng này"
    value="311"
    detail="↑ 18,4% so với tháng trước"
    tone="green"
    icon="receipt"
  />
  <MetricCard
    label="Hóa đơn chưa thu"
    value={formatCurrency(outstanding)}
    detail="3 khách hàng cần chăm sóc"
    tone="amber"
    icon="alert"
  />
  <MetricCard
    label="Khách hàng đang hoạt động"
    value={String(customers.length)}
    detail="2 khách mới trong tháng"
    tone="blue"
    icon="users"
  />
</div>

<div class="overview-grid">
  <section class="card chart-card">
    <div class="card-header">
      <div>
        <h2>Tổng quan doanh thu</h2>
        <p class="page-subtitle">Xu hướng tăng nhẹ trong bảy ngày qua.</p>
      </div>
      <a class="muted-link" href={base + '/statistics'}>Xem phân tích →</a>
    </div>
    <div class="chart-wrap"><RevenueChart points={revenueByPeriod['7d']} /></div>
  </section>

  <section class="card">
    <div class="card-header">
      <div>
        <h2>Tồn kho cần chú ý</h2>
        <p class="page-subtitle">Một lời nhắc nhỏ trước khi kệ hàng trống.</p>
      </div>
      <a class="muted-link" href={base + '/products'}>Xem tất cả →</a>
    </div>
    <div class="alert-list">
      {#each lowStock.slice(0, 4) as product}
        <div class="alert-row">
          <div class="product-avatar">
            {product.category === 'Food' ? '◒' : product.category === 'Wellness' ? '✦' : '◇'}
          </div>
          <div class="alert-name">
            <strong>{product.name}</strong><span
              >{translateCategory(product.category)} · {product.sku}</span
            >
          </div>
          <span class="stock-count"
            >{product.stock === 0 ? 'Hết hàng' : `Còn ${product.stock}`}</span
          >
        </div>
      {/each}
    </div>
  </section>
</div>

<section class="card table-card">
  <div class="card-header">
    <div>
      <h2>Đơn hàng gần đây</h2>
      <p class="page-subtitle">Hoạt động mới nhất từ cửa hàng và phòng khám.</p>
    </div>
    <a class="muted-link" href={base + '/orders'}>Xem tất cả đơn hàng →</a>
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
        >{#each orders.slice(0, 5) as order}<OrderRow {order} />{/each}</tbody
      >
    </table>
  </div>
</section>

<div class="stat-strip" style="margin-top:18px">
  <div class="card">
    <p>Đã thu trong tuần</p>
    <strong>{formatCurrency(paidRevenue)}</strong>
  </div>
  <div class="card">
    <p>Đơn đang mở</p>
    <strong>{orders.filter(order => order.fulfillmentStatus !== 'Completed').length}</strong>
  </div>
  <div class="card">
    <p>Gia đình thú cưng đã phục vụ</p>
    <strong>{customers.length}</strong>
  </div>
</div>
