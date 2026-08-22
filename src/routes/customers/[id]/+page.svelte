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
      <a class="muted-link" href="/customers">← Quay lại khách hàng</a>
      <p class="eyebrow" style="margin-top:18px">Hồ sơ khách hàng</p>
      <h1>{customer.name}</h1>
      <p class="page-subtitle">Một chút thông tin giúp mỗi lần tương tác trở nên gần gũi hơn.</p>
    </div>
    <a class="btn-secondary" href="/orders/new">Tạo đơn hàng</a>
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
          <dt>Điện thoại</dt>
          <dd>{customer.phone}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{customer.email}</dd>
        </div>
        <div>
          <dt>Khu vực</dt>
          <dd>{customer.city}</dd>
        </div>
        <div>
          <dt>Lần ghé gần nhất</dt>
          <dd>{formatDate(customer.lastVisit)}</dd>
        </div>
        <div>
          <dt>Tổng chi tiêu</dt>
          <dd>{formatCurrency(customer.totalSpent)}</dd>
        </div>
      </dl>
    </section>
    <section class="card detail-card">
      <h2>
        Gia đình thú cưng <span
          style="color:#96a49d;font-size:12px;font-family:'DM Sans',sans-serif;letter-spacing:0"
          >{customerPets.length} hồ sơ</span
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
            <span class="muted-link">Xem →</span></a
          >{/each}
      </div>
    </section>
  </div>
  <section class="card table-card">
    <div class="card-header">
      <div>
        <h2>Lịch sử đơn hàng gần đây</h2>
        <p class="page-subtitle">Ghi lại cách gia đình này mua sắm và chăm sóc thú cưng.</p>
      </div>
    </div>
    <div class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th>Đơn hàng</th>
            <th>Khách hàng & thú cưng</th>
            <th>Số tiền</th>
            <th>Thanh toán</th>
            <th>Trạng thái nhận hàng</th>
          </tr>
        </thead>
        <tbody
          >{#each customerOrders as order}<OrderRow {order} />{:else}<tr
              ><td colspan="5"
                ><div class="empty-state">
                  <strong>Chưa có đơn hàng</strong>Hồ sơ này đã sẵn sàng cho đơn hàng đầu tiên.
                </div></td
              ></tr
            >{/each}</tbody
        >
      </table>
    </div>
  </section>
{:else}<div class="empty-state">
    <strong>Khách hàng này không còn tồn tại.</strong><a class="muted-link" href="/customers"
      >Quay lại khách hàng →</a
    >
  </div>{/if}
