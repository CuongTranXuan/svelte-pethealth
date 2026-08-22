<script lang="ts">
  let saved = $state(false);
  function submit() {
    saved = true;
  }
</script>

<svelte:head><title>Add customer · Pawline</title></svelte:head>
<div class="page-header">
  <div>
    <a class="muted-link" href="/customers">← Back to customers</a>
    <p class="eyebrow" style="margin-top:18px">Start with a name</p>
    <h1>Add customer</h1>
    <p class="page-subtitle">Create a simple profile for a new pet family.</p>
  </div>
</div>
{#if saved}<div class="success-banner">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg><span
      >Customer saved locally in this demo.</span
    ><a class="muted-link" href="/customers">View directory →</a>
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
        <label for="city">Location</label><input
          id="city"
          class="input-field"
          placeholder="District 1, HCMC"
        />
      </div>
    </div>
    <div class="form-actions">
      <a class="btn-secondary" href="/customers">Cancel</a><button class="btn-primary" type="submit"
        >Save customer</button
      >
    </div>
  </form>
</section>
