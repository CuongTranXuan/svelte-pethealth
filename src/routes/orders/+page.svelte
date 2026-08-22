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

<svelte:head><title>Orders & bills · Pawline</title></svelte:head>

<div class="page-header">
  <div>
    <p class="eyebrow">Money, without the mess</p>
    <h1>Orders & bills</h1>
    <p class="page-subtitle">Keep every purchase clear from first click to paid and picked up.</p>
  </div>
  <a class="btn-primary" href="/orders/new"
    ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>New order</a
  >
</div>

<div class="stat-strip">
  <div class="card">
    <p>Total orders</p>
    <strong>{orders.length}</strong>
  </div>
  <div class="card">
    <p>Paid in full</p>
    <strong>{orders.filter(order => order.paymentStatus === 'Paid').length}</strong>
  </div>
  <div class="card">
    <p>Needs attention</p>
    <strong style="color:#cf604d"
      >{orders.filter(order => order.paymentStatus === 'Overdue').length +
        orders.filter(order => order.paymentStatus === 'Pending').length}</strong
    >
  </div>
</div>

<section class="card table-card" style="margin-top:0">
  <div class="card-header">
    <div>
      <h2>All orders</h2>
      <p class="page-subtitle">Search by order, customer, or pet.</p>
    </div>
    <a class="muted-link" href="/bills">Open bills view →</a>
  </div>
  <div class="toolbar">
    <label class="search-field" aria-label="Search orders"
      ><svg viewBox="0 0 24 24" aria-hidden="true"
        ><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg
      ><input bind:value={search} placeholder="Search orders, customers, pets" /></label
    >
    <select class="select-field" bind:value={paymentFilter} aria-label="Filter by payment status"
      ><option>All</option><option>Paid</option><option>Pending</option><option>Overdue</option
      ></select
    >
  </div>
  <div class="table-scroll">
    <table class="data-table">
      <thead
        ><tr
          ><th>Order</th><th>Customer & pet</th><th>Amount</th><th>Payment</th><th>Fulfillment</th
          ></tr
        ></thead
      ><tbody>
        {#each filteredOrders as order}<OrderRow {order} />{:else}<tr
            ><td colspan="5"
              ><div class="empty-state">
                <strong>No orders found</strong>Try a different search or payment filter.
              </div></td
            ></tr
          >{/each}
      </tbody>
    </table>
  </div>
</section>
