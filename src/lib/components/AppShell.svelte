<script lang="ts">
  import { page } from '$app/state';
  import type { Snippet } from 'svelte';

  const { children }: { children: Snippet } = $props();
  let menuOpen = $state(false);

  const navigation = [
    { href: '/dashboard', label: 'Overview', icon: 'grid' },
    { href: '/orders', label: 'Orders & bills', icon: 'receipt' },
    { href: '/customers', label: 'Customers & pets', icon: 'users' },
    { href: '/products', label: 'Products', icon: 'package' },
    { href: '/statistics', label: 'Analytics', icon: 'chart' },
  ];

  function isActive(href: string) {
    return page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);
  }
</script>

<div class="app-shell">
  <aside class:open={menuOpen} class="sidebar">
    <div class="brand-lockup">
      <div class="brand-mark">P</div>
      <div>
        <div class="brand-name">Pawline</div>
        <div class="brand-caption">Pet care, made simple</div>
      </div>
    </div>

    <div class="workspace-label">Workspace</div>
    <nav aria-label="Main navigation">
      {#each navigation as item}
        <a class:active={isActive(item.href)} href={item.href} onclick={() => (menuOpen = false)}>
          {#if item.icon === 'grid'}
            <svg viewBox="0 0 24 24" aria-hidden="true"
              ><rect x="4" y="4" width="6" height="6" rx="1" /><rect
                x="14"
                y="4"
                width="6"
                height="6"
                rx="1"
              /><rect x="4" y="14" width="6" height="6" rx="1" /><rect
                x="14"
                y="14"
                width="6"
                height="6"
                rx="1"
              /></svg
            >
          {:else if item.icon === 'receipt'}
            <svg viewBox="0 0 24 24" aria-hidden="true"
              ><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" /><path d="M9 8h6M9 12h6" /></svg
            >
          {:else if item.icon === 'users'}
            <svg viewBox="0 0 24 24" aria-hidden="true"
              ><circle cx="9" cy="8" r="3" /><path
                d="M3.5 19c.5-3 2.4-5 5.5-5s5 2 5.5 5M16 11a3 3 0 1 0-1.5-5.6M16 14c2.5 0 4 1.7 4.5 4"
              /></svg
            >
          {:else if item.icon === 'package'}
            <svg viewBox="0 0 24 24" aria-hidden="true"
              ><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="M4 7v10l8 4 8-4V7M12 11v10" /></svg
            >
          {:else}
            <svg viewBox="0 0 24 24" aria-hidden="true"
              ><path d="M4 19V5M4 19h17" /><path d="m7 15 4-4 3 2 5-6" /></svg
            >
          {/if}
          <span>{item.label}</span>
        </a>
      {/each}
    </nav>

    <div class="sidebar-footnote">
      <div class="footnote-icon">✦</div>
      <div>
        <strong>Keep it caring</strong>
        <p>Small moments make every visit better.</p>
      </div>
    </div>
  </aside>

  {#if menuOpen}
    <button class="scrim" aria-label="Close navigation" onclick={() => (menuOpen = false)}></button>
  {/if}

  <div class="main-column">
    <header class="topbar">
      <button class="menu-toggle" aria-label="Open navigation" onclick={() => (menuOpen = true)}>
        <span></span><span></span><span></span>
      </button>
      <div class="topbar-search">
        <svg viewBox="0 0 24 24" aria-hidden="true"
          ><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg
        >
        <span>Search anything</span>
        <kbd>⌘ K</kbd>
      </div>
      <div class="topbar-actions">
        <button class="icon-button" aria-label="View notifications">
          <svg viewBox="0 0 24 24" aria-hidden="true"
            ><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 8h18c0-1-3-1-3-8M10 21h4" /></svg
          >
          <span class="notification-dot"></span>
        </button>
        <div class="staff-chip">
          <span class="avatar">CT</span><span class="staff-name">Cuong Tran</span><span
            class="chevron">⌄</span
          >
        </div>
      </div>
    </header>
    <main class="page-content">
      {@render children()}
    </main>
  </div>
</div>
