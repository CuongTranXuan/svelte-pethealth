<script lang="ts">
  import MetricCard from '$lib/components/MetricCard.svelte';
  import OrderRow from '$lib/components/OrderRow.svelte';
  import RevenueChart from '$lib/components/RevenueChart.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { customers, orders, products, revenueByPeriod } from '$lib/data/pawline';
  import { formatCurrency } from '$lib/utils/format';

  const lowStock = products.filter(product => product.status !== 'In stock');
  const paidRevenue = orders
    .filter(order => order.paymentStatus === 'Paid')
    .reduce((sum, order) => sum + order.total, 0);
  const outstanding = orders
    .filter(order => order.paymentStatus !== 'Paid')
    .reduce((sum, order) => sum + order.total, 0);
</script>

<svelte:head><title>Overview · Pawline</title></svelte:head>

<div class="page-header">
  <div>
    <p class="eyebrow">Friday, 22 August 2026</p>
    <h1>Good morning, Cuong.</h1>
    <p class="page-subtitle">Here’s the small picture of a busy, healthy day at Pawline.</p>
  </div>
  <a class="btn-primary" href="/orders/new"
    ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>New order</a
  >
</div>

<div class="metric-grid">
  <MetricCard
    label="Revenue this month"
    value={formatCurrency(96870000)}
    detail="↑ 12.8% from last month"
    tone="coral"
    icon="trend"
  />
  <MetricCard
    label="Orders this month"
    value="311"
    detail="↑ 18.4% from last month"
    tone="green"
    icon="receipt"
  />
  <MetricCard
    label="Outstanding bills"
    value={formatCurrency(outstanding)}
    detail="3 customers need attention"
    tone="amber"
    icon="alert"
  />
  <MetricCard
    label="Active customers"
    value={String(customers.length)}
    detail="2 new this month"
    tone="blue"
    icon="users"
  />
</div>

<div class="overview-grid">
  <section class="card chart-card">
    <div class="card-header">
      <div>
        <h2>Revenue overview</h2>
        <p class="page-subtitle">A gentle upward trend over the last seven days.</p>
      </div>
      <a class="muted-link" href="/statistics">View analytics →</a>
    </div>
    <div class="chart-wrap"><RevenueChart points={revenueByPeriod['7d']} /></div>
  </section>

  <section class="card">
    <div class="card-header">
      <div>
        <h2>Stock to watch</h2>
        <p class="page-subtitle">A quick nudge before shelves get quiet.</p>
      </div>
      <a class="muted-link" href="/products">See all →</a>
    </div>
    <div class="alert-list">
      {#each lowStock.slice(0, 4) as product}
        <div class="alert-row">
          <div class="product-avatar">
            {product.category === 'Food' ? '◒' : product.category === 'Wellness' ? '✦' : '◇'}
          </div>
          <div class="alert-name">
            <strong>{product.name}</strong><span>{product.category} · {product.sku}</span>
          </div>
          <span class="stock-count">{product.stock === 0 ? 'Out' : `${product.stock} left`}</span>
        </div>
      {/each}
    </div>
  </section>
</div>

<section class="card table-card">
  <div class="card-header">
    <div>
      <h2>Recent orders</h2>
      <p class="page-subtitle">The latest activity across store and clinic.</p>
    </div>
    <a class="muted-link" href="/orders">View all orders →</a>
  </div>
  <div class="table-scroll">
    <table class="data-table">
      <thead
        ><tr
          ><th>Order</th><th>Customer & pet</th><th>Amount</th><th>Payment</th><th>Fulfillment</th
          ></tr
        ></thead
      >
      <tbody
        >{#each orders.slice(0, 5) as order}<OrderRow {order} />{/each}</tbody
      >
    </table>
  </div>
</section>

<div class="stat-strip" style="margin-top:18px">
  <div class="card">
    <p>Collected this week</p>
    <strong>{formatCurrency(paidRevenue)}</strong>
  </div>
  <div class="card">
    <p>Open orders</p>
    <strong>{orders.filter(order => order.fulfillmentStatus !== 'Completed').length}</strong>
  </div>
  <div class="card">
    <p>Pet families served</p>
    <strong>{customers.length}</strong>
  </div>
</div>
