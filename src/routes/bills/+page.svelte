<script lang="ts">
  import OrderRow from '$lib/components/OrderRow.svelte';
  import { orders } from '$lib/data/pawline';
  import { formatCurrency } from '$lib/utils/format';

  const openBills = orders.filter(order => order.paymentStatus !== 'Paid');
  const outstanding = openBills.reduce((sum, order) => sum + order.total, 0);
</script>

<svelte:head><title>Bills · Pawline</title></svelte:head>
<div class="page-header">
  <div>
    <p class="eyebrow">A gentle follow-up</p>
    <h1>Bills</h1>
    <p class="page-subtitle">See what is settled and what deserves a quick, human reminder.</p>
  </div>
  <a class="btn-secondary" href="/orders">Back to orders</a>
</div>
<div class="metric-grid">
  <div class="card metric-card">
    <div class="metric-label">Outstanding</div>
    <div class="metric-value">{formatCurrency(outstanding)}</div>
    <div class="metric-detail attention">Across {openBills.length} open bills</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Paid bills</div>
    <div class="metric-value">{orders.filter(order => order.paymentStatus === 'Paid').length}</div>
    <div class="metric-detail positive">Keep the good rhythm</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Overdue</div>
    <div class="metric-value">
      {orders.filter(order => order.paymentStatus === 'Overdue').length}
    </div>
    <div class="metric-detail danger">Needs a follow-up</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Collection rate</div>
    <div class="metric-value">
      {Math.round(
        (orders.filter(order => order.paymentStatus === 'Paid').length / orders.length) * 100
      )}%
    </div>
    <div class="metric-detail positive">Of demo orders</div>
  </div>
</div>
<section class="card table-card" style="margin-top:0">
  <div class="card-header">
    <div>
      <h2>Bill history</h2>
      <p class="page-subtitle">Bills are linked to their source order for easy context.</p>
    </div>
  </div>
  <div class="table-scroll">
    <table class="data-table">
      <thead
        ><tr
          ><th>Order</th><th>Customer & pet</th><th>Amount</th><th>Payment</th><th>Fulfillment</th
          ></tr
        ></thead
      ><tbody
        >{#each orders as order}<OrderRow {order} />{/each}</tbody
      >
    </table>
  </div>
</section>
