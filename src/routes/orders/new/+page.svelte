<script lang="ts">
  import { customers, orders, products, pets } from '$lib/data/pawline';
  import { formatCurrency } from '$lib/utils/format';

  let customerId = $state(customers[0].id);
  let petId = $state(pets[0].id);
  let productId = $state(products[0].id);
  let quantity = $state(1);
  let paymentStatus = $state('Pending');
  let submitted = $state(false);

  const selectedProduct = $derived(products.find(product => product.id === productId));
  const customerPets = $derived(pets.filter(pet => pet.customerId === customerId));
  const total = $derived((selectedProduct?.price || 0) * Number(quantity || 1));

  function handleCustomerChange() {
    petId = customerPets[0]?.id || '';
  }

  function submitOrder() {
    submitted = true;
  }
</script>

<svelte:head><title>Tạo đơn hàng · Pawline</title></svelte:head>

<div class="page-header">
  <div>
    <a class="muted-link" href="/orders">← Quay lại đơn hàng</a>
    <p class="eyebrow" style="margin-top:18px">Tạo thật đơn giản</p>
    <h1>Tạo đơn hàng</h1>
    <p class="page-subtitle">Thêm sản phẩm hoặc dịch vụ chăm sóc vào hồ sơ khách hàng.</p>
  </div>
</div>

{#if submitted}<div class="success-banner">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg><span
      >Đơn nháp đã được lưu cục bộ. Bạn có thể xem lại trong không gian mẫu này.</span
    ><a class="muted-link" href="/orders">Xem đơn hàng →</a>
  </div>{/if}

<section class="card detail-card" style="max-width:760px">
  <form
    onsubmit={event => {
      event.preventDefault();
      submitOrder();
    }}
  >
    <div class="form-grid">
      <div class="form-field">
        <label for="customer">Khách hàng</label><select
          id="customer"
          class="select-field input-field"
          bind:value={customerId}
          onchange={handleCustomerChange}
          >{#each customers as customer}<option value={customer.id}>{customer.name}</option
            >{/each}</select
        >
      </div>
      <div class="form-field">
        <label for="pet">Thú cưng</label><select
          id="pet"
          class="select-field input-field"
          bind:value={petId}
          >{#each customerPets as pet}<option value={pet.id}>{pet.name} · {pet.breed}</option
            >{/each}</select
        >
      </div>
      <div class="form-field full">
        <label for="product">Sản phẩm hoặc dịch vụ</label><select
          id="product"
          class="select-field input-field"
          bind:value={productId}
          >{#each products as product}<option value={product.id}
              >{product.name} · {formatCurrency(product.price)}</option
            >{/each}</select
        >
      </div>
      <div class="form-field">
        <label for="quantity">Số lượng</label><input
          id="quantity"
          class="input-field"
          type="number"
          min="1"
          max="20"
          bind:value={quantity}
        />
      </div>
      <div class="form-field">
        <label for="payment">Trạng thái thanh toán</label><select
          id="payment"
          class="select-field input-field"
          bind:value={paymentStatus}
          ><option value="Pending">Chờ thanh toán</option><option value="Paid">Đã thanh toán</option
          ><option value="Overdue">Quá hạn</option></select
        >
      </div>
    </div>
    <div
      style="background:#f7f9f7;border-radius:10px;padding:16px;margin-top:20px;display:flex;justify-content:space-between;align-items:center"
    >
      <div>
        <span class="row-subtext" style="margin:0 0 5px">Tổng đơn hàng</span><strong
          style="font-family:'Space Grotesk',sans-serif;font-size:22px"
          >{formatCurrency(total)}</strong
        >
      </div>
      <span class="row-subtext" style="margin:0">Dữ liệu mẫu · chưa xử lý thanh toán</span>
    </div>
    <div class="form-actions">
      <a class="btn-secondary" href="/orders">Cancel</a><button class="btn-primary" type="submit"
        >Lưu đơn nháp</button
      >
    </div>
  </form>
</section>
