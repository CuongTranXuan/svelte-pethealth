<script lang="ts">
  import { base } from '$app/paths';
  let saved = $state(false);
  function submit() {
    saved = true;
  }
</script>

<svelte:head><title>Thêm khách hàng · Pawline</title></svelte:head>
<div class="page-header">
  <div>
    <a class="muted-link" href={base + '/customers'}>← Quay lại khách hàng</a>
    <p class="eyebrow" style="margin-top:18px">Bắt đầu từ một cái tên</p>
    <h1>Thêm khách hàng</h1>
    <p class="page-subtitle">Tạo hồ sơ đơn giản cho một gia đình thú cưng mới.</p>
  </div>
</div>
{#if saved}<div class="success-banner">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg><span
      >Khách hàng đã được lưu cục bộ trong bản mẫu này.</span
    ><a class="muted-link" href={base + '/customers'}>Xem danh bạ →</a>
  </div>{/if}
<section class="card detail-card" style="max-width:760px">
  <form
    onsubmit={event => {
      event.preventDefault();
      submit();
    }}
  >
    <div class="form-grid">
      <div class="form-field">
        <label for="name">Full name</label><input
          id="name"
          class="input-field"
          required
          placeholder="e.g. Ha Nguyen"
        />
      </div>
      <div class="form-field">
        <label for="phone">Phone</label><input
          id="phone"
          class="input-field"
          required
          placeholder="090 000 0000"
        />
      </div>
      <div class="form-field">
        <label for="email">Email</label><input
          id="email"
          class="input-field"
          type="email"
          placeholder="name@example.com"
        />
      </div>
      <div class="form-field">
        <label for="city">Khu vực</label><input
          id="city"
          class="input-field"
          placeholder="Quận 1, TP. HCM"
        />
      </div>
    </div>
    <div class="form-actions">
      <a class="btn-secondary" href={base + '/customers'}>Hủy</a><button
        class="btn-primary"
        type="submit">Lưu khách hàng</button
      >
    </div>
  </form>
</section>
