<script lang="ts">
  import { customers } from '$lib/data/pawline';
  let saved = $state(false);
  function submit() {
    saved = true;
  }
</script>

<svelte:head><title>Add pet · Pawline</title></svelte:head>
<div class="page-header">
  <div>
    <a class="muted-link" href="/pets">← Back to pets</a>
    <p class="eyebrow" style="margin-top:18px">Every profile helps</p>
    <h1>Add pet</h1>
    <p class="page-subtitle">Give the team the essentials they need to care well.</p>
  </div>
</div>
{#if saved}<div class="success-banner">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg><span
      >Pet profile saved locally in this demo.</span
    ><a class="muted-link" href="/pets">View directory →</a>
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
        <label for="name">Pet name</label><input
          id="name"
          class="input-field"
          required
          placeholder="e.g. Miso"
        />
      </div>
      <div class="form-field">
        <label for="owner">Owner</label><select id="owner" class="select-field input-field"
          >{#each customers as customer}<option value={customer.id}>{customer.name}</option
            >{/each}</select
        >
      </div>
      <div class="form-field">
        <label for="species">Species</label><select id="species" class="select-field input-field"
          ><option>Dog</option><option>Cat</option><option>Rabbit</option></select
        >
      </div>
      <div class="form-field">
        <label for="breed">Breed</label><input
          id="breed"
          class="input-field"
          placeholder="e.g. Toy Poodle"
        />
      </div>
      <div class="form-field full">
        <label for="note">Care note</label><textarea
          id="note"
          class="input-field"
          rows="3"
          placeholder="Anything the team should remember?"
        ></textarea>
      </div>
    </div>
    <div class="form-actions">
      <a class="btn-secondary" href="/pets">Cancel</a><button class="btn-primary" type="submit"
        >Save pet profile</button
      >
    </div>
  </form>
</section>
