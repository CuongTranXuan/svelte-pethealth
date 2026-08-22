<script lang="ts">
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { customers } from '$lib/data/pawline';
  import { formatCurrency, formatDate } from '$lib/utils/format';

  let search = $state('');
  const filteredCustomers = $derived(
    customers.filter(customer =>
      `${customer.name} ${customer.email} ${customer.phone}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    )
  );
</script>

<svelte:head><title>Customers & pets · Pawline</title></svelte:head>
<div class="page-header">
  <div>
    <p class="eyebrow">People behind the paws</p>
    <h1>Customers & pets</h1>
    <p class="page-subtitle">A quick view of the families who trust your team.</p>
  </div>
  <a class="btn-primary" href="/customers/new"
    ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Add customer</a
  >
</div>
<div class="metric-grid">
  <div class="card metric-card">
    <div class="metric-label">Total customers</div>
    <div class="metric-value">{customers.length}</div>
    <div class="metric-detail positive">↑ 2 this month</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Pets in care</div>
    <div class="metric-value">8</div>
    <div class="metric-detail positive">Across 5 species</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Follow-ups</div>
    <div class="metric-value">
      {customers.filter(customer => customer.status === 'Needs follow-up').length}
    </div>
    <div class="metric-detail attention">Worth a gentle nudge</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Average spend</div>
    <div class="metric-value">
      {formatCurrency(
        customers.reduce((sum, customer) => sum + customer.totalSpent, 0) / customers.length
      )}
    </div>
    <div class="metric-detail positive">Healthy repeat visits</div>
  </div>
</div>
<section class="card table-card" style="margin-top:0">
  <div class="card-header">
    <div>
      <h2>Customer directory</h2>
      <p class="page-subtitle">Open a profile to see their pet family and order history.</p>
    </div>
  </div>
  <div class="toolbar">
    <label class="search-field" aria-label="Search customers"
      ><svg viewBox="0 0 24 24" aria-hidden="true"
        ><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg
      ><input bind:value={search} placeholder="Search by name, email, or phone" /></label
    >
  </div>
  <div class="table-scroll">
    <table class="data-table">
      <thead
        ><tr
          ><th>Customer</th><th>Contact</th><th>Pets</th><th>Last visit</th><th>Total spent</th><th
            >Status</th
          ></tr
        ></thead
      ><tbody
        >{#each filteredCustomers as customer}<tr
            ><td
              ><a class="row-name" href="/customers/{customer.id}">{customer.name}</a><span
                class="row-subtext">{customer.city}</span
              ></td
            ><td>{customer.phone}<span class="row-subtext">{customer.email}</span></td><td
              class="row-name">{customer.pets}</td
            ><td>{formatDate(customer.lastVisit)}</td><td class="row-name"
              >{formatCurrency(customer.totalSpent)}</td
            ><td
              ><StatusBadge
                label={customer.status}
                tone={customer.status === 'Active' ? 'positive' : 'attention'}
              /></td
            ></tr
          >{:else}<tr
            ><td colspan="6"
              ><div class="empty-state">
                <strong>No customers found</strong>Try another search term.
              </div></td
            ></tr
          >{/each}</tbody
      >
    </table>
  </div>
</section>
