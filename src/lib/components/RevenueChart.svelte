<script lang="ts">
  import type { RevenuePoint } from '$lib/data/pawline';
  import { formatCompactCurrency } from '$lib/utils/format';

  const { points, showSummary = true }: { points: RevenuePoint[]; showSummary?: boolean } =
    $props();
  const chartWidth = 720;
  const chartHeight = 190;
  const padding = { top: 12, right: 12, bottom: 25, left: 8 };

  function x(index: number) {
    return (
      padding.left +
      (index * (chartWidth - padding.left - padding.right)) / Math.max(points.length - 1, 1)
    );
  }

  const maxRevenue = $derived(Math.max(...points.map(point => point.revenue), 1));
  const totalRevenue = $derived(points.reduce((sum, point) => sum + point.revenue, 0));
  const totalOrders = $derived(points.reduce((sum, point) => sum + point.orders, 0));

  function y(value: number) {
    return padding.top + (1 - value / maxRevenue) * (chartHeight - padding.top - padding.bottom);
  }

  const linePath = $derived(
    points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(index)} ${y(point.revenue)}`)
      .join(' ')
  );
  const areaPath = $derived(
    `${linePath} L ${x(points.length - 1)} ${chartHeight - padding.bottom} L ${x(0)} ${chartHeight - padding.bottom} Z`
  );
  const gridValues = $derived([0, 0.5, 1].map(ratio => maxRevenue * ratio));
</script>

{#if showSummary}
  <div class="chart-summary">
    <strong>{formatCompactCurrency(totalRevenue)}</strong><span>+12,8% so với kỳ trước</span><span
      style="color:#9aa59f;font-weight:500">{totalOrders} đơn hàng</span
    >
  </div>
{/if}
<svg
  class="chart-svg"
  viewBox="0 0 {chartWidth} {chartHeight}"
  role="img"
  aria-label="Biểu đồ xu hướng doanh thu"
>
  <defs>
    <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#e8684b" stop-opacity=".18" />
      <stop offset="100%" stop-color="#e8684b" stop-opacity="0" />
    </linearGradient>
  </defs>
  {#each gridValues as gridValue}
    <line
      class="chart-gridline"
      x1={padding.left}
      x2={chartWidth - padding.right}
      y1={y(gridValue)}
      y2={y(gridValue)}
    />
  {/each}
  <path class="chart-area" d={areaPath} />
  <path class="chart-line" d={linePath} />
  {#each points as point, index}
    <circle class="chart-point" cx={x(index)} cy={y(point.revenue)} r="4" />
    <text class="chart-label" x={x(index)} y={chartHeight - 5} text-anchor="middle"
      >{point.label}</text
    >
  {/each}
</svg>
