<script lang="ts">
  import { base } from '$app/paths';
  import { page } from '$app/state';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import { customers, orders, pets } from '$lib/data/pawline';
  import {
    formatCurrency,
    formatDate,
    translateFulfillmentStatus,
    translatePaymentStatus,
  } from '$lib/utils/format';

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
  ><title>{order ? `${order.id} · Pawline` : 'Không tìm thấy đơn hàng · Pawline'}</title
  ></svelte:head
>

{#if order}
  <div class="page-header">
    <div>
      <a class="muted-link" href={base + '/orders'}>← Quay lại đơn hàng</a>
      <p class="eyebrow" style="margin-top:18px">Chi tiết đơn hàng</p>
      <h1>{order.id}</h1>
      <p class="page-subtitle">
        Tạo ngày {formatDate(order.date)} · Thông tin rõ ràng cho {order.customerName} và {order.petName}.
      </p>
    </div>
    <div style="display:flex;gap:9px;flex-wrap:wrap">
      <a class="btn-secondary" href={base + '/orders'}>Đóng</a>
      <button class="btn-primary" type="button" onclick={() => window.print()}>In hóa đơn</button>
    </div>
  </div>
  <div class="detail-grid">
    <section class="card detail-card">
      <h2>Tóm tắt đơn hàng</h2>
      <div class="table-scroll">
        <table class="data-table" style="min-width:0">
          <thead><tr><th>Sản phẩm</th><th>SL</th><th>Đơn giá</th><th>Thành tiền</th></tr></thead>
          <tbody
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
            <dt>Tạm tính</dt>
            <dd>{formatCurrency(order.total)}</dd>
          </div>
          <div>
            <dt>Phí dịch vụ</dt>
            <dd>{formatCurrency(0)}</dd>
          </div>
          <div>
            <dt>Thành tiền</dt>
            <dd style="font-size:16px">{formatCurrency(order.total)}</dd>
          </div>
        </div>
      </div>
    </section>
    <aside class="card detail-card">
      <h2>Thông tin nhanh</h2>
      <dl class="detail-list">
        <div>
          <dt>Thanh toán</dt>
          <dd>
            <StatusBadge
              label={translatePaymentStatus(order.paymentStatus)}
              tone={paymentTone(order.paymentStatus)}
            />
          </dd>
        </div>
        <div>
          <dt>Nhận hàng</dt>
          <dd>{translateFulfillmentStatus(order.fulfillmentStatus)}</dd>
        </div>
        <div>
          <dt>Khách hàng</dt>
          <dd>{order.customerName}</dd>
        </div>
        <div>
          <dt>Thú cưng</dt>
          <dd>{order.petName}</dd>
        </div>
      </dl>
      <div style="height:1px;background:#eef2ef;margin:21px 0"></div>
      <h3>Thông tin khách hàng</h3>
      <dl class="detail-list" style="margin-top:14px">
        <div>
          <dt>Điện thoại</dt>
          <dd>{customer?.phone}</dd>
        </div>
        <div>
          <dt>Hồ sơ thú cưng</dt>
          <dd>{pet?.breed || 'Hồ sơ chăm sóc'}</dd>
        </div>
        <div>
          <dt>Lần ghé gần nhất</dt>
          <dd>{pet ? formatDate(pet.lastVisit) : '—'}</dd>
        </div>
      </dl>
    </aside>
  </div>
{:else}
  <div class="empty-state">
    <strong>Đơn hàng này không còn tồn tại.</strong><a class="muted-link" href={base + '/orders'}
      >Quay lại tất cả đơn hàng →</a
    >
  </div>
{/if}
