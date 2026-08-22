<script lang="ts">
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { products } from '$lib/data/pawline';
  import { formatCurrency, translateCategory, translateProductStatus } from '$lib/utils/format';

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

<svelte:head><title>Sản phẩm · Pawline</title></svelte:head>
<div class="page-header">
  <div>
    <p class="eyebrow">Kệ hàng khỏe, kinh doanh khỏe</p>
    <h1>Sản phẩm & tồn kho</h1>
    <p class="page-subtitle">Biết sản phẩm nào đang bán chạy, sắp hết và cần được chú ý.</p>
  </div>
  <button
    class="btn-primary"
    type="button"
    onclick={() => (restockMessage = 'Product creation is ready for the catalog backend pass.')}
    >+ Thêm sản phẩm</button
  >
</div>
{#if restockMessage}<div class="success-banner" style="margin-top:-10px">
    <span>{restockMessage}</span>
  </div>{/if}
<div class="metric-grid">
  <div class="card metric-card">
    <div class="metric-label">Tổng sản phẩm</div>
    <div class="metric-value">{products.length}</div>
    <div class="metric-detail positive">Thuộc 4 nhóm</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Còn hàng</div>
    <div class="metric-value">
      {products.filter(product => product.status === 'In stock').length}
    </div>
    <div class="metric-detail positive">Sẵn sàng bán</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Sắp hết</div>
    <div class="metric-value">
      {products.filter(product => product.status === 'Low stock').length}
    </div>
    <div class="metric-detail attention">Sắp cần nhập thêm</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Hết hàng</div>
    <div class="metric-value">
      {products.filter(product => product.status === 'Out of stock').length}
    </div>
    <div class="metric-detail danger">Cần xử lý</div>
  </div>
</div>
<section class="card table-card" style="margin-top:0">
  <div class="card-header">
    <div>
      <h2>Danh mục sản phẩm</h2>
      <p class="page-subtitle">Trạng thái tồn kho dựa trên ngưỡng nhập thêm của từng sản phẩm.</p>
    </div>
  </div>
  <div class="toolbar">
    <label class="search-field" aria-label="Search products"
      ><svg viewBox="0 0 24 24" aria-hidden="true"
        ><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg
      ><input bind:value={search} placeholder="Tìm sản phẩm hoặc SKU" /></label
    ><select class="select-field" bind:value={category} aria-label="Filter by category"
      ><option value="All">Tất cả</option><option value="Food">Thức ăn</option><option value="Care"
        >Chăm sóc</option
      ><option value="Wellness">Sức khỏe</option><option value="Accessories">Phụ kiện</option
      ></select
    >
  </div>
  <div class="table-scroll">
    <table class="data-table">
      <thead
        ><tr
          ><th>Sản phẩm</th><th>Nhóm</th><th>Giá</th><th>Tồn kho</th><th>Nhập thêm khi còn</th><th
            >Status</th
          ></tr
        ></thead
      ><tbody
        >{#each filteredProducts as product}<tr
            ><td
              ><span class="row-name">{product.name}</span><span class="row-subtext"
                >{product.sku}</span
              ></td
            ><td>{translateCategory(product.category)}</td><td class="row-name"
              >{formatCurrency(product.price)}</td
            ><td class="row-name">{product.stock}</td><td>{product.reorderLevel}</td><td
              ><StatusBadge
                label={translateProductStatus(product.status)}
                tone={tone(product.status)}
              /></td
            ></tr
          >{:else}<tr
            ><td colspan="6"
              ><div class="empty-state">
                <strong>Không tìm thấy sản phẩm</strong>Hãy thử từ khóa hoặc nhóm khác.
              </div></td
            ></tr
          >{/each}</tbody
      >
    </table>
  </div>
</section>
