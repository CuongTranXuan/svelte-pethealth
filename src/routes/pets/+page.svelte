<script lang="ts">
  import { base } from '$app/paths';
  import { pets } from '$lib/data/pawline';

  let search = $state('');
  const filteredPets = $derived(
    pets.filter(pet =>
      `${pet.name} ${pet.customerName} ${pet.breed} ${pet.species}`
        .toLowerCase()
        .includes(search.trim().toLowerCase())
    )
  );
</script>

<svelte:head><title>Thú cưng · Pawline</title></svelte:head>
<div class="page-header">
  <div>
    <p class="eyebrow">Mỗi thú cưng đều có một câu chuyện</p>
    <h1>Danh bạ thú cưng</h1>
    <p class="page-subtitle">Nắm đúng thông tin chăm sóc trước cuộc trò chuyện tiếp theo.</p>
  </div>
  <a class="btn-secondary" href={base + '/customers'}>Xem danh bạ khách hàng</a>
</div>
<section class="card table-card" style="margin-top:0">
  <div class="card-header">
    <div>
      <h2>Tất cả thú cưng</h2>
      <p class="page-subtitle">Tìm theo thú cưng, chủ nuôi, loài hoặc giống.</p>
    </div>
  </div>
  <div class="toolbar">
    <label class="search-field" aria-label="Tìm kiếm thú cưng">
      ><svg viewBox="0 0 24 24" aria-hidden="true"
        ><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg
      ><input bind:value={search} placeholder="Tìm thú cưng hoặc chủ nuôi" /></label
    >
  </div>
  <div class="table-scroll">
    <table class="data-table">
      <thead
        ><tr
          ><th>Thú cưng</th><th>Chủ nuôi</th><th>Loài & giống</th><th>Tuổi</th><th
            >Lần ghé gần nhất</th
          ><th>Ghi chú chăm sóc</th></tr
        ></thead
      ><tbody
        >{#each filteredPets as pet}<tr
            ><td
              ><a class="row-name" href={`${base}/pets/${pet.id}`}>{pet.name}</a><span
                class="row-subtext">Hồ sơ {pet.id}</span
              ></td
            ><td
              ><a class="row-name" href={`${base}/customers/${pet.customerId}`}
                >{pet.customerName}</a
              ></td
            ><td
              >{pet.species === 'Dog' ? 'Chó' : pet.species === 'Cat' ? 'Mèo' : 'Thỏ'}<span
                class="row-subtext">{pet.breed}</span
              ></td
            ><td>{pet.age}</td><td>{pet.lastVisit}</td><td style="max-width:240px"
              >{pet.careNote}</td
            ></tr
          >{:else}<tr
            ><td colspan="6"
              ><div class="empty-state">
                <strong>Không tìm thấy thú cưng</strong>Hãy thử từ khóa khác.
              </div></td
            ></tr
          >{/each}</tbody
      >
    </table>
  </div>
</section>
