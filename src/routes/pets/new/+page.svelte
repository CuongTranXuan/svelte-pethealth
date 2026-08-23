<script lang="ts">
  import { base } from '$app/paths';
  import { customers } from '$lib/data/pawline';
  let saved = $state(false);
  function submit() {
    saved = true;
  }
</script>

<svelte:head><title>Thêm thú cưng · Pawline</title></svelte:head>
<div class="page-header">
  <div>
    <a class="muted-link" href={base + '/pets'}>← Quay lại thú cưng</a>
    <p class="eyebrow" style="margin-top:18px">Mỗi hồ sơ đều hữu ích</p>
    <h1>Thêm thú cưng</h1>
    <p class="page-subtitle">Cung cấp những thông tin cần thiết để đội ngũ chăm sóc tốt hơn.</p>
  </div>
</div>
{#if saved}<div class="success-banner">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg><span
      >Hồ sơ thú cưng đã được lưu cục bộ trong bản mẫu này.</span
    ><a class="muted-link" href={base + '/pets'}>Xem danh bạ →</a>
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
        <label for="name">Tên thú cưng</label><input
          id="name"
          class="input-field"
          required
          placeholder="ví dụ: Miso"
        />
      </div>
      <div class="form-field">
        <label for="owner">Chủ nuôi</label><select id="owner" class="select-field input-field"
          >{#each customers as customer}<option value={customer.id}>{customer.name}</option
            >{/each}</select
        >
      </div>
      <div class="form-field">
        <label for="species">Loài</label><select id="species" class="select-field input-field"
          ><option value="Dog">Chó</option><option value="Cat">Mèo</option><option value="Rabbit"
            >Thỏ</option
          ></select
        >
      </div>
      <div class="form-field">
        <label for="breed">Giống</label><input
          id="breed"
          class="input-field"
          placeholder="ví dụ: Toy Poodle"
        />
      </div>
      <div class="form-field full">
        <label for="note">Ghi chú chăm sóc</label><textarea
          id="note"
          class="input-field"
          rows="3"
          placeholder="Đội ngũ cần nhớ điều gì?"
        ></textarea>
      </div>
    </div>
    <div class="form-actions">
      <a class="btn-secondary" href={base + '/pets'}>Hủy</a><button
        class="btn-primary"
        type="submit">Lưu hồ sơ thú cưng</button
      >
    </div>
  </form>
</section>
