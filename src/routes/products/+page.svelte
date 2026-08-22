<script lang="ts">
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { products } from '$lib/data/pawline';
  import { formatCurrency } from '$lib/utils/format';

  let search = $state('');
  let category = $state('All');
  let restockMessage = $state('');
  const filteredProducts = $derived(
    products.filter(product => {
      const matchesSearch = `${product.name} ${product.sku}`
        .toLowerCase()
        .includes(search.trim().toLowerCase());
      return matchesSearch && (category === 'All' || product.category === category);
    })
  );

  function tone(status: string) {
    return status === 'In stock' ? 'positive' : status === 'Low stock' ? 'attention' : 'danger';
  }
</script>

<svelte:head><title>Products · Pawline</title></svelte:head>
<div class="page-header">
  <div>
    <p class="eyebrow">Healthy shelves, healthy business</p>
    <h1>Products & inventory</h1>
    <p class="page-subtitle">See what is moving, what is low, and what needs a closer look.</p>
  </div>
  <button
    class="btn-primary"
    type="button"
    onclick={() => (restockMessage = 'Product creation is ready for the catalog backend pass.')}
    >+ Add product</button
  >
</div>
{#if restockMessage}<div class="success-banner" style="margin-top:-10px">
    <span>{restockMessage}</span>
  </div>{/if}
<div class="metric-grid">
  <div class="card metric-card">
    <div class="metric-label">Total products</div>
    <div class="metric-value">{products.length}</div>
    <div class="metric-detail positive">Across 4 categories</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">In stock</div>
    <div class="metric-value">
      {products.filter(product => product.status === 'In stock').length}
    </div>
    <div class="metric-detail positive">Ready to sell</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Low stock</div>
    <div class="metric-value">
      {products.filter(product => product.status === 'Low stock').length}
    </div>
    <div class="metric-detail attention">Reorder soon</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Out of stock</div>
    <div class="metric-value">
      {products.filter(product => product.status === 'Out of stock').length}
    </div>
    <div class="metric-detail danger">Needs action</div>
  </div>
</div>
<section class="card table-card" style="margin-top:0">
  <div class="card-header">
    <div>
      <h2>Product catalog</h2>
      <p class="page-subtitle">Stock status is based on each product’s reorder level.</p>
    </div>
  </div>
  <div class="toolbar">
    <label class="search-field" aria-label="Search products"
      ><svg viewBox="0 0 24 24" aria-hidden="true"
        ><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg
      ><input bind:value={search} placeholder="Search products or SKU" /></label
    ><select class="select-field" bind:value={category} aria-label="Filter by category"
      ><option>All</option><option>Food</option><option>Care</option><option>Wellness</option
      ><option>Accessories</option></select
    >
  </div>
  <div class="table-scroll">
    <table class="data-table">
      <thead
        ><tr
          ><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Reorder at</th><th
            >Status</th
          ></tr
        ></thead
      ><tbody
        >{#each filteredProducts as product}<tr
            ><td
              ><span class="row-name">{product.name}</span><span class="row-subtext"
                >{product.sku}</span
              ></td
            ><td>{product.category}</td><td class="row-name">{formatCurrency(product.price)}</td><td
              class="row-name">{product.stock}</td
            ><td>{product.reorderLevel}</td><td
              ><StatusBadge label={product.status} tone={tone(product.status)} /></td
            ></tr
          >{:else}<tr
            ><td colspan="6"
              ><div class="empty-state">
                <strong>No products found</strong>Try another search or category.
              </div></td
            ></tr
          >{/each}</tbody
      >
    </table>
  </div>
</section>
