<script lang="ts">
  import { page } from '$app/state';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { customers, orders, pets } from '$lib/data/pawline';
  import { formatCurrency, formatDate } from '$lib/utils/format';

  const order = $derived(orders.find(item => item.id === page.params.id));
  const customer = $derived(
    order ? customers.find(item => item.id === order.customerId) : undefined
  );
  const pet = $derived(
    order
      ? pets.find(item => item.customerId === order.customerId && item.name === order.petName)
      : undefined
  );

  function paymentTone(status: 'Paid' | 'Pending' | 'Overdue') {
    return status === 'Paid' ? 'positive' : status === 'Overdue' ? 'danger' : 'attention';
  }
</script>

<svelte:head
  ><title>{order ? `${order.id} · Pawline` : 'Order not found · Pawline'}</title></svelte:head
>

{#if order}
  <div class="page-header">
    <div>
      <a class="muted-link" href="/orders">← Back to orders</a>
      <p class="eyebrow" style="margin-top:18px">Order detail</p>
      <h1>{order.id}</h1>
      <p class="page-subtitle">
        Placed {formatDate(order.date)} · A clear record for {order.customerName} and {order.petName}.
      </p>
    </div>
    <div style="display:flex;gap:9px;flex-wrap:wrap">
      <a class="btn-secondary" href="/orders">Close</a><button
        class="btn-primary"
        type="button"
        onclick={() => window.print()}>Print bill</button
      >
    </div>
  </div>
  <div class="detail-grid">
    <section class="card detail-card">
      <h2>Order summary</h2>
      <div class="table-scroll">
        <table class="data-table" style="min-width:0">
          <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead><tbody
            >{#each order.items as item}<tr
                ><td class="row-name">{item.name}</td><td>{item.quantity}</td><td
                  >{formatCurrency(item.price)}</td
                ><td class="row-name">{formatCurrency(item.price * item.quantity)}</td></tr
              >{/each}</tbody
          >
        </table>
      </div>
      <div
        style="display:flex;justify-content:flex-end;border-top:1px solid #eef2ef;margin-top:14px;padding-top:16px"
      >
        <div class="detail-list" style="min-width:210px">
          <div>
            <dt>Subtotal</dt>
            <dd>{formatCurrency(order.total)}</dd>
          </div>
          <div>
            <dt>Service fee</dt>
            <dd>{formatCurrency(0)}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd style="font-size:16px">{formatCurrency(order.total)}</dd>
          </div>
        </div>
      </div>
    </section>
    <aside class="card detail-card">
      <h2>At a glance</h2>
      <dl class="detail-list">
        <div>
          <dt>Payment</dt>
          <dd>
            <StatusBadge label={order.paymentStatus} tone={paymentTone(order.paymentStatus)} />
          </dd>
        </div>
        <div>
          <dt>Fulfillment</dt>
          <dd>{order.fulfillmentStatus}</dd>
        </div>
        <div>
          <dt>Customer</dt>
          <dd>{order.customerName}</dd>
        </div>
        <div>
          <dt>Pet</dt>
          <dd>{order.petName}</dd>
        </div>
      </dl>
      <div style="height:1px;background:#eef2ef;margin:21px 0"></div>
      <h3>Customer context</h3>
      <dl class="detail-list" style="margin-top:14px">
        <div>
          <dt>Phone</dt>
          <dd>{customer?.phone}</dd>
        </div>
        <div>
          <dt>Pet profile</dt>
          <dd>{pet?.breed || 'Care profile'}</dd>
        </div>
        <div>
          <dt>Last visit</dt>
          <dd>{pet ? formatDate(pet.lastVisit) : '—'}</dd>
        </div>
      </dl>
    </aside>
  </div>
{:else}
  <div class="empty-state">
    <strong>That order has wandered off.</strong><a class="muted-link" href="/orders"
      >Return to all orders →</a
    >
  </div>
{/if}
