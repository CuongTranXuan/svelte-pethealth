<script lang="ts">
  import { base } from '$app/paths';
  import type { Order } from '$lib/data/pawline';
  import {
    formatCurrency,
    formatDate,
    translateFulfillmentStatus,
    translatePaymentStatus,
  } from '$lib/utils/format';
  import StatusBadge from './StatusBadge.svelte';

  const { order }: { order: Order } = $props();

  function paymentTone(status: Order['paymentStatus']) {
    return status === 'Paid' ? 'positive' : status === 'Overdue' ? 'danger' : 'attention';
  }

  function fulfillmentTone(status: Order['fulfillmentStatus']) {
    return status === 'Completed' ? 'positive' : status === 'Processing' ? 'attention' : 'neutral';
  }
</script>

<tr>
  <td>
    <a class="row-name" href={`${base}/orders/${order.id}`}>{order.id}</a>
    <span class="row-subtext">{formatDate(order.date)}</span>
  </td>
  <td>
    <span class="row-name">{order.customerName}</span>
    <span class="row-subtext">cho {order.petName}</span>
  </td>
  <td class="row-name">{formatCurrency(order.total)}</td>
  <td
    ><StatusBadge
      label={translatePaymentStatus(order.paymentStatus)}
      tone={paymentTone(order.paymentStatus)}
    /></td
  >
  <td
    ><StatusBadge
      label={translateFulfillmentStatus(order.fulfillmentStatus)}
      tone={fulfillmentTone(order.fulfillmentStatus)}
    /></td
  >
</tr>
