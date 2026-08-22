<script lang="ts">
  import RevenueChart from '$lib/components/RevenueChart.svelte';
  import { orders, products, revenueByPeriod } from '$lib/data/pawline';
  import { formatCurrency } from '$lib/utils/format';

  let period = $state('30d');
  const points = $derived(revenueByPeriod[period]);
  const revenue = $derived(points.reduce((sum, point) => sum + point.revenue, 0));
  const orderCount = $derived(points.reduce((sum, point) => sum + point.orders, 0));
  const averageOrder = $derived(revenue / orderCount);
</script>

<svelte:head><title>Phân tích · Pawline</title></svelte:head>
<div class="page-header">
  <div>
    <p class="eyebrow">Một chút rõ ràng tạo nên khác biệt</p>
    <h1>Phân tích</h1>
    <p class="page-subtitle">
      Những tín hiệu đơn giản giúp bạn biết điều gì cần được ưu tiên tiếp theo.
    </p>
  </div>
  <select class="select-field" bind:value={period} aria-label="Analytics period"
    ><option value="7d">7 ngày qua</option><option value="30d">30 ngày qua</option><option
      value="quarter">Quý này</option
    ></select
  >
</div>
<div class="metric-grid">
  <div class="card metric-card">
    <div class="metric-label">Doanh thu</div>
    <div class="metric-value">{formatCurrency(revenue)}</div>
    <div class="metric-detail positive">↑ 12,8% so với kỳ trước</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Đơn hàng</div>
    <div class="metric-value">{orderCount}</div>
    <div class="metric-detail positive">↑ 8,4% so với kỳ trước</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Giá trị đơn trung bình</div>
    <div class="metric-value">{formatCurrency(averageOrder)}</div>
    <div class="metric-detail">Từ cửa hàng và dịch vụ chăm sóc</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Tín hiệu khách quay lại</div>
    <div class="metric-value">68%</div>
    <div class="metric-detail positive">Gia đình quay lại ổn định</div>
  </div>
</div>
<div class="overview-grid">
  <section class="card chart-card">
    <div class="card-header">
      <div>
        <h2>Xu hướng doanh thu</h2>
        <p class="page-subtitle">Khoảng thời gian bạn chọn, không có dữ liệu thừa.</p>
      </div>
    </div>
    <div class="chart-wrap"><RevenueChart {points} showSummary={false} /></div>
  </section>
  <section class="card detail-card">
    <h2>Điều gì đã thay đổi</h2>
    <p class="page-subtitle" style="margin:12px 0 18px">
      The team is seeing a steady lift in orders, with wellness products and repeat families doing
      most of the work.
    </p>
    <div class="detail-list">
      <div>
        <dt>Sản phẩm bán chạy</dt>
        <dd>Gói chăm sóc ve rận tháng</dd>
      </div>
      <div>
        <dt>Ngày tốt nhất</dt>
        <dd>Thứ Bảy</dd>
      </div>
      <div>
        <dt>Đơn đã thanh toán</dt>
        <dd>{orders.filter(order => order.paymentStatus === 'Paid').length} of {orders.length}</dd>
      </div>
      <div>
        <dt>Sản phẩm sắp hết</dt>
        <dd style="color:#c8863d">
          {products.filter(product => product.status !== 'In stock').length}
        </dd>
      </div>
    </div>
  </section>
</div>
<section class="card table-card">
  <div class="card-header">
    <div>
      <h2>Gợi ý bước tiếp theo</h2>
      <p class="page-subtitle">Giữ đà tăng trưởng và xử lý những khoảng trống nhỏ.</p>
    </div>
  </div>
  <div
    style="padding:0 20px 20px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px"
  >
    <div style="background:#edf7f1;border-radius:10px;padding:14px">
      <div class="eyebrow" style="color:#3b9476">Duy trì</div>
      <div style="font-size:12px;line-height:1.5;color:#486358">
        Các gia đình quay lại đang tạo đà cho tháng này. Hãy giúp lần ghé tiếp theo thật thuận tiện.
      </div>
    </div>
    <div style="background:#fff8ed;border-radius:10px;padding:14px">
      <div class="eyebrow" style="color:#b7782e">Theo dõi</div>
      <div style="font-size:12px;line-height:1.5;color:#80613e">
        Bốn sản phẩm đang ở hoặc dưới ngưỡng nhập thêm.
      </div>
    </div>
    <div style="background:#fbecea;border-radius:10px;padding:14px">
      <div class="eyebrow" style="color:#cf604d">Hoàn tất</div>
      <div style="font-size:12px;line-height:1.5;color:#86554a">
        Một vài hóa đơn chờ thanh toán là khoản doanh thu dễ thu hồi nhất.
      </div>
    </div>
  </div>
</section>
