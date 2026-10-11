(() => {
  const MOBILE_BREAKPOINT = 767;
  const FADE_MS = 500;
  const desktopMain = document.querySelector('.quad-main');
  const mobileMain = document.querySelector('.mobile-main');
  const nav = document.getElementById('mobile-nav');
  const toggle = document.querySelector('.mobile-menu-toggle');
  const menuHost = document.getElementById('mobile-menu-host');
  let desktopBusy = false;
  let mobileBusy = false;
  function fadeNavigate(frame, href, type) {
    if (!frame || !href) return;
    if ((type === 'desktop' && desktopBusy) || (type === 'mobile' && mobileBusy)) return;
    if (type === 'desktop') desktopBusy = true;
    else mobileBusy = true;
    frame.classList.add('is-fading');
    window.setTimeout(() => {
      frame.addEventListener('load', () => {
        window.requestAnimationFrame(() => frame.classList.remove('is-fading'));
        if (type === 'desktop') desktopBusy = false;
        else mobileBusy = false;
      }, { once: true });
      frame.src = href;
    }, FADE_MS);
  }
  window.addEventListener('message', event => {
    const data = event.data;
    if (!data || data.type !== 'quad-desktop-navigate' || typeof data.href !== 'string') return;
    if (mobileMain && event.source === mobileMain.contentWindow) {
      fadeNavigate(mobileMain, data.href, 'mobile');
      return;
    }
    fadeNavigate(desktopMain, data.href, 'desktop');
  });
  if (menuHost && window.renderQuadMenu) renderQuadMenu(menuHost, { mobile: true });
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }
  if (menuHost) {
    const MENU_MS = 260;
    function closeSection(section) {
      const list = section.querySelector('ul');
      if (!list || !section.open) return;
      list.style.height = list.scrollHeight + 'px';
      window.requestAnimationFrame(() => {
        list.style.height = '0px';
        window.setTimeout(() => { section.open = false; }, MENU_MS);
      });
    }
    function openSection(section) {
      const list = section.querySelector('ul');
      if (!list) return;
      menuHost.querySelectorAll('details').forEach(other => {
        if (other !== section) closeSection(other);
      });
      section.open = true;
      list.style.height = '0px';
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => { list.style.height = list.scrollHeight + 'px'; });
      });
    }
    menuHost.addEventListener('click', event => {
      const summary = event.target.closest('summary');
      if (summary) {
        const section = summary.closest('details');
        if (!section) return;
        event.preventDefault();
        if (section.open) closeSection(section); else openSection(section);
        return;
      }
      if (window.innerWidth > MOBILE_BREAKPOINT) return;
      const link = event.target.closest('a');
      if (!link || link.target === '_blank' || link.protocol === 'mailto:') return;
      event.preventDefault();
      if (nav) nav.classList.remove('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      fadeNavigate(mobileMain, link.href, 'mobile');
    });
  }
})();
