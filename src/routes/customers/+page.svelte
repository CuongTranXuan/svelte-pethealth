<script lang="ts">
  import { base } from '$app/paths';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { customers } from '$lib/data/pawline';
  import { formatCurrency, formatDate, translateCustomerStatus } from '$lib/utils/format';

  let search = $state('');
  const filteredCustomers = $derived(
    customers.filter(customer =>
      `${customer.name} ${customer.email} ${customer.phone}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    )
  );
</script>

<svelte:head><title>Khách hàng & thú cưng · Pawline</title></svelte:head>
<div class="page-header">
  <div>
    <p class="eyebrow">Những người yêu thú cưng</p>
    <h1>Khách hàng & thú cưng</h1>
    <p class="page-subtitle">Xem nhanh những gia đình tin tưởng đội ngũ của bạn.</p>
  </div>
  <a class="btn-primary" href={base + '/customers/new'}
    ><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Thêm khách hàng</a
  >
</div>
<div class="metric-grid">
  <div class="card metric-card">
    <div class="metric-label">Tổng khách hàng</div>
    <div class="metric-value">{customers.length}</div>
    <div class="metric-detail positive">↑ 2 khách mới trong tháng</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Thú cưng đang chăm sóc</div>
    <div class="metric-value">8</div>
    <div class="metric-detail positive">Thuộc 5 loài</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Cần theo dõi</div>
    <div class="metric-value">
      {customers.filter(customer => customer.status === 'Needs follow-up').length}
    </div>
    <div class="metric-detail attention">Nên nhắc nhẹ nhàng</div>
  </div>
  <div class="card metric-card">
    <div class="metric-label">Chi tiêu trung bình</div>
    <div class="metric-value">
      {formatCurrency(
        customers.reduce((sum, customer) => sum + customer.totalSpent, 0) / customers.length
      )}
    </div>
    <div class="metric-detail positive">Lượt quay lại ổn định</div>
  </div>
</div>
<section class="card table-card" style="margin-top:0">
  <div class="card-header">
    <div>
      <h2>Danh bạ khách hàng</h2>
      <p class="page-subtitle">Mở hồ sơ để xem gia đình thú cưng và lịch sử đơn hàng.</p>
    </div>
  </div>
  <div class="toolbar">
    <label class="search-field" aria-label="Search customers"
      ><svg viewBox="0 0 24 24" aria-hidden="true"
        ><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg
      ><input bind:value={search} placeholder="Tìm theo tên, email hoặc số điện thoại" /></label
    >
  </div>
  <div class="table-scroll">
    <table class="data-table">
      <thead
        ><tr
          ><th>Khách hàng</th><th>Liên hệ</th><th>Thú cưng</th><th>Lần ghé gần nhất</th><th
            >Tổng chi tiêu</th
          ><th>Trạng thái</th></tr
        ></thead
      ><tbody
        >{#each filteredCustomers as customer}<tr
            ><td
              ><a class="row-name" href={`${base}/customers/${customer.id}`}>{customer.name}</a
              ><span class="row-subtext">{customer.city}</span></td
            ><td>{customer.phone}<span class="row-subtext">{customer.email}</span></td><td
              class="row-name">{customer.pets}</td
            ><td>{formatDate(customer.lastVisit)}</td><td class="row-name"
              >{formatCurrency(customer.totalSpent)}</td
            ><td
              ><StatusBadge
                label={translateCustomerStatus(customer.status)}
                tone={customer.status === 'Active' ? 'positive' : 'attention'}
              /></td
            ></tr
          >{:else}<tr
            ><td colspan="6"
              ><div class="empty-state">
                <strong>Không tìm thấy khách hàng</strong>Hãy thử từ khóa khác.
              </div></td
            ></tr
          >{/each}</tbody
      >
    </table>
  </div>
</section>
