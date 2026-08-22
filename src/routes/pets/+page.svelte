<script lang="ts">
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

<svelte:head><title>Pets · Pawline</title></svelte:head>
<div class="page-header">
  <div>
    <p class="eyebrow">Every pet has a story</p>
    <h1>Pet directory</h1>
    <p class="page-subtitle">Find the right care context before the next conversation.</p>
  </div>
  <a class="btn-secondary" href="/customers">View customer directory</a>
</div>
<section class="card table-card" style="margin-top:0">
  <div class="card-header">
    <div>
      <h2>All pets</h2>
      <p class="page-subtitle">Search by pet, owner, species, or breed.</p>
    </div>
  </div>
  <div class="toolbar">
    <label class="search-field" aria-label="Search pets"
      ><svg viewBox="0 0 24 24" aria-hidden="true"
        ><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg
      ><input bind:value={search} placeholder="Search pets or owners" /></label
    >
  </div>
  <div class="table-scroll">
    <table class="data-table">
      <thead
        ><tr
          ><th>Pet</th><th>Owner</th><th>Species & breed</th><th>Age</th><th>Last visit</th><th
            >Care note</th
          ></tr
        ></thead
      ><tbody
        >{#each filteredPets as pet}<tr
            ><td
              ><a class="row-name" href="/pets/{pet.id}">{pet.name}</a><span class="row-subtext"
                >Profile {pet.id}</span
              ></td
            ><td><a class="row-name" href="/customers/{pet.customerId}">{pet.customerName}</a></td
            ><td>{pet.species}<span class="row-subtext">{pet.breed}</span></td><td>{pet.age}</td><td
              >{pet.lastVisit}</td
            ><td style="max-width:240px">{pet.careNote}</td></tr
          >{:else}<tr
            ><td colspan="6"
              ><div class="empty-state">
                <strong>No pets found</strong>Try another search term.
              </div></td
            ></tr
          >{/each}</tbody
      >
    </table>
  </div>
</section>
