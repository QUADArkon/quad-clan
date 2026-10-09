(() => {
  const mobileSite = document.querySelector('.mobile-site');
  if (!mobileSite) return;

  const content = document.getElementById('mobile-content');
  const nav = document.getElementById('mobile-nav');
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menuHost = document.getElementById('mobile-menu-host');
  let frameObserver = null;

  renderQuadMenu(menuHost, { mobile: true });

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  menuHost.addEventListener('toggle', event => {
    const section = event.target;
    if (!(section instanceof HTMLDetailsElement) || !section.open) return;
    menuHost.querySelectorAll('details').forEach(other => {
      if (other !== section) other.open = false;
    });
  }, true);

  function fixUrls(root, pageUrl) {
    root.querySelectorAll('[src]').forEach(node => {
      const value = node.getAttribute('src');
      if (value && !value.startsWith('data:') && !value.startsWith('blob:')) {
        node.src = new URL(value, pageUrl).href;
      }
    });

    root.querySelectorAll('a[href]').forEach(link => {
      const value = link.getAttribute('href');
      if (!value || value.startsWith('#') || value.startsWith('mailto:') || value.startsWith('javascript:')) return;
      link.href = new URL(value, pageUrl).href;
    });
  }

  function clearPageResources() {
    if (frameObserver) {
      frameObserver.disconnect();
      frameObserver = null;
    }
    document.querySelectorAll('[data-mobile-page-style]').forEach(node => node.remove());
    content.className = 'mobile-content';
    content.removeAttribute('style');
    content.replaceChildren();
  }

  function copyPageTypography(sourceBody) {
    const properties = [
      'color', 'font', 'font-family', 'font-size', 'font-style',
      'font-weight', 'font-variant', 'line-height', 'letter-spacing',
      'text-align', 'text-decoration', 'text-transform', 'word-spacing'
    ];

    sourceBody.classList.forEach(className => content.classList.add(className));

    function inspectRules(rules) {
      Array.from(rules || []).forEach(rule => {
        if (rule.cssRules) {
          inspectRules(rule.cssRules);
          return;
        }
        if (!rule.selectorText || !rule.style) return;
        const matches = rule.selectorText.split(',').some(selector => {
          try { return sourceBody.matches(selector.trim()); }
          catch { return false; }
        });
        if (!matches) return;
        properties.forEach(property => {
          const value = rule.style.getPropertyValue(property);
          if (value) content.style.setProperty(property, value, rule.style.getPropertyPriority(property));
        });
      });
    }

    Array.from(document.styleSheets).forEach(sheet => {
      try { inspectRules(sheet.cssRules); }
      catch { /* Ignore inaccessible external stylesheets. */ }
    });

    properties.forEach(property => {
      const value = sourceBody.style.getPropertyValue(property);
      if (value) content.style.setProperty(property, value, sourceBody.style.getPropertyPriority(property));
    });
  }

  function rewriteCssUrls(cssText, pageUrl) {
    return cssText.replace(/url\(\s*(['"]?)(?!data:|blob:|https?:|\/)([^'"\)]+)\1\s*\)/gi,
      (_, quote, value) => `url("${new URL(value.trim(), pageUrl).href}")`);
  }

  function importPageStyles(documentFromPage, pageUrl) {
    documentFromPage.querySelectorAll('head style').forEach(sourceStyle => {
      const style = document.createElement('style');
      style.dataset.mobilePageStyle = '';
      style.textContent = rewriteCssUrls(sourceStyle.textContent, pageUrl);
      document.head.appendChild(style);
    });
  }

  function closeMenu() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function loadInteractivePage(pageUrl) {
    const frame = document.createElement('iframe');
    frame.className = 'mobile-page-frame';
    frame.src = pageUrl.href;
    frame.title = 'QUAD content';
    frame.allow = 'autoplay';
    frame.setAttribute('scrolling', 'no');
    frame.style.display = 'block';
    frame.style.width = '100%';
    frame.style.height = '1px';
    frame.style.border = '0';

    const resizeFrame = () => {
      try {
        const doc = frame.contentDocument;
        if (!doc) return;
        frame.style.height = `${Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight)}px`;
      } catch (error) {
        console.error('QUAD mobile iframe resize failed:', error);
      }
    };

    frame.addEventListener('load', () => {
      resizeFrame();
      try {
        frameObserver = new ResizeObserver(resizeFrame);
        frameObserver.observe(frame.contentDocument.documentElement);
      } catch {
        window.setTimeout(resizeFrame, 250);
      }
    }, { once: true });

    content.appendChild(frame);
  }

  async function loadPage(path, push = true) {
    try {
      const pageUrl = new URL(path, location.href);
      const response = await fetch(pageUrl.href, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const documentFromPage = new DOMParser().parseFromString(await response.text(), 'text/html');
      const hasOwnRuntime = !!documentFromPage.querySelector('script, audio, video');

      clearPageResources();

      if (hasOwnRuntime) {
        loadInteractivePage(pageUrl);
      } else {
        const source = documentFromPage.querySelector('main') || documentFromPage.body;
        const imported = source.cloneNode(true);
        fixUrls(imported, pageUrl);
        importPageStyles(documentFromPage, pageUrl);
        copyPageTypography(documentFromPage.body);
        content.appendChild(imported);
      }

      if (push) document.title = documentFromPage.title || '[QUAD] Clan Homepage';
      closeMenu();
      window.scrollTo(0, 0);

      if (push) {
        history.pushState({ page: pageUrl.pathname }, '', `?page=${encodeURIComponent(pageUrl.pathname)}`);
      }
    } catch (error) {
      clearPageResources();
      content.innerHTML = '<p class="mobile-error">Page unavailable.</p>';
      closeMenu();
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
