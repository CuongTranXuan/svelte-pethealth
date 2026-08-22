<script lang="ts">
  import { page } from '$app/state';
  import OrderRow from '$lib/components/OrderRow.svelte';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { customers, orders, pets } from '$lib/data/pawline';
  import { formatCurrency, formatDate } from '$lib/utils/format';

  const customer = $derived(customers.find(item => item.id === page.params.id));
  const customerPets = $derived(customer ? pets.filter(pet => pet.customerId === customer.id) : []);
  const customerOrders = $derived(
    customer ? orders.filter(order => order.customerId === customer.id) : []
  );
</script>

<svelte:head
  ><title>{customer ? `${customer.name} · Pawline` : 'Customer not found · Pawline'}</title
  ></svelte:head
>
{#if customer}
  <div class="page-header">
    <div>
      <a class="muted-link" href="/customers">← Back to customers</a>
      <p class="eyebrow" style="margin-top:18px">Customer profile</p>
      <h1>{customer.name}</h1>
      <p class="page-subtitle">A little context helps every interaction feel personal.</p>
    </div>
    <a class="btn-secondary" href="/orders/new">Create order</a>
  </div>
  <div class="detail-grid">
    <section class="card detail-card">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:22px">
        <div class="avatar" style="width:44px;height:44px;font-size:13px">{customer.initials}</div>
        <div>
          <h2>{customer.name}</h2>
          <p class="page-subtitle" style="margin:4px 0 0">{customer.status} customer</p>
        </div>
      </div>
      <dl class="detail-list">
        <div>
          <dt>Phone</dt>
          <dd>{customer.phone}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{customer.email}</dd>
        </div>
        <div>
          <dt>Location</dt>
          <dd>{customer.city}</dd>
        </div>
        <div>
          <dt>Last visit</dt>
          <dd>{formatDate(customer.lastVisit)}</dd>
        </div>
        <div>
          <dt>Total spent</dt>
          <dd>{formatCurrency(customer.totalSpent)}</dd>
        </div>
      </dl>
    </section>
    <section class="card detail-card">
      <h2>
        Pet family <span
          style="color:#96a49d;font-size:12px;font-family:'DM Sans',sans-serif;letter-spacing:0"
          >{customerPets.length} profiles</span
        >
      </h2>
      <div class="alert-list" style="padding:0">
        {#each customerPets as pet}<a
            href="/pets/{pet.id}"
            class="alert-row"
            style="text-decoration:none"
            ><div class="product-avatar" style="background:{pet.color}33">
              {pet.species === 'Dog' ? '●' : pet.species === 'Cat' ? '◐' : '◌'}
            </div>
            <div class="alert-name">
              <strong>{pet.name}</strong><span>{pet.breed} · {pet.age}</span>
            </div>
            <span class="muted-link">View →</span></a
          >{/each}
      </div>
    </section>
  </div>
  <section class="card table-card">
    <div class="card-header">
      <div>
        <h2>Recent order history</h2>
        <p class="page-subtitle">A simple record of how this family shops and cares.</p>
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
          >{#each customerOrders as order}<OrderRow {order} />{:else}<tr
              ><td colspan="5"
                ><div class="empty-state">
                  <strong>No orders yet</strong>This profile is ready for its first order.
                </div></td
              ></tr
            >{/each}</tbody
        >
      </table>
    </div>
  </section>
{:else}<div class="empty-state">
    <strong>That customer has wandered off.</strong><a class="muted-link" href="/customers"
      >Return to customers →</a
    >
  </div>{/if}
