<script lang="ts">
  import { page } from '$app/state';
  import { pets, customers, orders } from '$lib/data/pawline';
  import { formatCurrency, formatDate } from '$lib/utils/format';

  const pet = $derived(pets.find(item => item.id === page.params.id));
  const owner = $derived(pet ? customers.find(item => item.id === pet.customerId) : undefined);
  const petOrders = $derived(
    pet
      ? orders.filter(order => order.customerId === pet.customerId && order.petName === pet.name)
      : []
  );
</script>

<svelte:head><title>{pet ? `${pet.name} · Pawline` : 'Pet not found · Pawline'}</title></svelte:head
>
{#if pet}
  <div class="page-header">
    <div>
      <a class="muted-link" href="/pets">← Back to pets</a>
      <p class="eyebrow" style="margin-top:18px">Pet profile</p>
      <h1>{pet.name}</h1>
      <p class="page-subtitle">The care context your team can act on at a glance.</p>
    </div>
    <a class="btn-secondary" href="/customers/{pet.customerId}">View owner</a>
  </div>
  <div class="detail-grid">
    <section class="card detail-card">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:22px">
        <div
          class="product-avatar"
          style="width:48px;height:48px;font-size:21px;background:{pet.color}33"
        >
          {pet.species === 'Dog' ? '●' : pet.species === 'Cat' ? '◐' : '◌'}
        </div>
        <div>
          <h2>{pet.name}</h2>
          <p class="page-subtitle" style="margin:4px 0 0">{pet.breed} · {pet.age}</p>
        </div>
      </div>
      <dl class="detail-list">
        <div>
          <dt>Species</dt>
          <dd>{pet.species}</dd>
        </div>
        <div>
          <dt>Breed</dt>
          <dd>{pet.breed}</dd>
        </div>
        <div>
          <dt>Owner</dt>
          <dd><a class="muted-link" href="/customers/{pet.customerId}">{pet.customerName}</a></dd>
        </div>
        <div>
          <dt>Last visit</dt>
          <dd>{formatDate(pet.lastVisit)}</dd>
        </div>
      </dl>
      <div
        style="margin-top:22px;background:#fff8ed;border:1px solid #f5dfbb;border-radius:10px;padding:13px"
      >
        <div class="eyebrow" style="color:#b7782e;margin-bottom:5px">Care note</div>
        <div style="font-size:12px;color:#80613e;line-height:1.55">{pet.careNote}</div>
      </div>
    </section>
    <aside class="card detail-card">
      <h2>Pet spending</h2>
      <div class="metric-value" style="margin:15px 0 5px">
        {formatCurrency(petOrders.reduce((sum, order) => sum + order.total, 0))}
      </div>
      <p class="page-subtitle">{petOrders.length} related orders</p>
      <div style="height:1px;background:#eef2ef;margin:21px 0"></div>
      <h3>Owner contact</h3>
      <p class="page-subtitle" style="color:#4c5c54;margin-top:10px">{owner?.phone}</p>
      <p class="page-subtitle" style="margin-top:4px">{owner?.email}</p>
    </aside>
  </div>
{:else}<div class="empty-state">
    <strong>That pet has wandered off.</strong><a class="muted-link" href="/pets"
      >Return to pets →</a
    >
  </div>{/if}
