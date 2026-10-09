(() => {
  const mobileSite = document.querySelector('.mobile-site');
  if (!mobileSite) return;
  const content = document.getElementById('mobile-content');
  const nav = document.getElementById('mobile-nav');
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menuHost = document.getElementById('mobile-menu-host');

  renderQuadMenu(menuHost, { mobile: true });

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  menuHost.addEventListener('toggle', (event) => {
    const section = event.target;
    if (!(section instanceof HTMLDetailsElement) || !section.open) return;
    menuHost.querySelectorAll('details').forEach(other => { if (other !== section) other.open = false; });
  }, true);

  function fixUrls(root, pageUrl) {
    root.querySelectorAll('[src]').forEach(node => {
      const value = node.getAttribute('src');
      if (value) node.src = new URL(value, pageUrl).href;
    });
    root.querySelectorAll('a[href]').forEach(link => {
      const value = link.getAttribute('href');
      if (!value || value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('javascript:')) return;
      link.href = new URL(value, pageUrl).href;
    });
  }

  async function loadPage(path, push = true) {
    try {
      const pageUrl = new URL(path, location.href);
      const response = await fetch(pageUrl.href, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const documentFromPage = new DOMParser().parseFromString(await response.text(), 'text/html');
      const source = documentFromPage.querySelector('main') || documentFromPage.body;
      const imported = source.cloneNode(true);
      fixUrls(imported, pageUrl);
      content.replaceChildren(imported);
      document.title = documentFromPage.title || '[QUAD] Clan Homepage';
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      window.scrollTo(0, 0);
      if (push) history.pushState({ page: pageUrl.pathname }, '', `?page=${encodeURIComponent(pageUrl.pathname)}`);
    } catch (error) {
      content.innerHTML = '<p class="mobile-error">Page unavailable.</p>';
      console.error('QUAD mobile load failed:', error);
    }
  }

  document.addEventListener('click', event => {
    if (!matchMedia('(max-width: 767px)').matches) return;
    const link = event.target.closest('#mobile-nav a, #mobile-content a');
    if (!link || link.target === '_blank' || link.protocol === 'mailto:' || link.origin !== location.origin) return;
    event.preventDefault();
    loadPage(link.href);
  });

  window.addEventListener('popstate', () => {
    const page = new URLSearchParams(location.search).get('page') || 'news/news.html';
    loadPage(page, false);
  });

  const initial = new URLSearchParams(location.search).get('page') || 'news/news.html';
  loadPage(initial, false);
})();
