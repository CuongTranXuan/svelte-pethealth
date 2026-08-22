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

<svelte:head><title>Analytics · Pawline</title></svelte:head>
<div class="page-header">
  <div>
    <p class="eyebrow">A little clarity goes a long way</p>
    <h1>Analytics</h1>
    <p class="page-subtitle">Simple signals to help you decide what deserves attention next.</p>
  </div>
  <select class="select-field" bind:value={period} aria-label="Analytics period"
    ><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option><option
      value="quarter">This quarter</option
    ></select
  >
</div>
<div class="metric-grid">
  <div class="card metric-card">
    <div class="metric-label">Revenue</div>
    <div class="metric-value">{formatCurrency(revenue)}</div>
    <div class="metric-detail positive">↑ 12.8% vs previous period</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Orders</div>
    <div class="metric-value">{orderCount}</div>
    <div class="metric-detail positive">↑ 8.4% vs previous period</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Average order</div>
    <div class="metric-value">{formatCurrency(averageOrder)}</div>
    <div class="metric-detail">Across store and care</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Repeat customer signal</div>
    <div class="metric-value">68%</div>
    <div class="metric-detail positive">Healthy returning families</div>
  </div>
</div>
<div class="overview-grid">
  <section class="card chart-card">
    <div class="card-header">
      <div>
        <h2>Revenue trend</h2>
        <p class="page-subtitle">Your selected window, without the noise.</p>
      </div>
    </div>
    <div class="chart-wrap"><RevenueChart {points} showSummary={false} /></div>
  </section>
  <section class="card detail-card">
    <h2>What changed</h2>
    <p class="page-subtitle" style="margin:12px 0 18px">
      The team is seeing a steady lift in orders, with wellness products and repeat families doing
      most of the work.
    </p>
    <div class="detail-list">
      <div>
        <dt>Top product</dt>
        <dd>Monthly flea care</dd>
      </div>
      <div>
        <dt>Best day</dt>
        <dd>Saturday</dd>
      </div>
      <div>
        <dt>Orders paid</dt>
        <dd>{orders.filter(order => order.paymentStatus === 'Paid').length} of {orders.length}</dd>
      </div>
      <div>
        <dt>Low-stock products</dt>
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
      <h2>Read this as a next step</h2>
      <p class="page-subtitle">Keep the momentum, then close the small gaps.</p>
    </div>
  </div>
  <div
    style="padding:0 20px 20px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px"
  >
    <div style="background:#edf7f1;border-radius:10px;padding:14px">
      <div class="eyebrow" style="color:#3b9476">Keep</div>
      <div style="font-size:12px;line-height:1.5;color:#486358">
        Repeat families are carrying the month. Make their next visit easy.
      </div>
    </div>
    <div style="background:#fff8ed;border-radius:10px;padding:14px">
      <div class="eyebrow" style="color:#b7782e">Watch</div>
      <div style="font-size:12px;line-height:1.5;color:#80613e">
        Four products are at or below their reorder threshold.
      </div>
    </div>
    <div style="background:#fbecea;border-radius:10px;padding:14px">
      <div class="eyebrow" style="color:#cf604d">Close</div>
      <div style="font-size:12px;line-height:1.5;color:#86554a">
        A few pending bills are the easiest revenue to recover.
      </div>
    </div>
  </div>
</section>
