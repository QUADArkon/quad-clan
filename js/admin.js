/* QUAD admin/easter-egg coordinator. Works with file:// and http(s) via postMessage. */
(function () {
  'use strict';

  function isDesktop() {
    var desktop = document.querySelector('.desktop-site');
    return !!desktop && getComputedStyle(desktop).display !== 'none';
  }

  function sendToHeader(active) {
    var frame = document.querySelector('iframe.quad-header');
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage({ type: 'quad-admin-arm', active: !!active && isDesktop() }, '*');
  }

  function showAdminMenu() {
    if (!isDesktop()) return;
    var frame = document.querySelector('iframe.quad-nav');
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage({ type: 'quad-admin-show-menu' }, '*');
  }

  window.addEventListener('message', function (event) {
    if (!event.data) return;

    /* Keep the already-tested Name Maker -> Header protocol unchanged. */
    if (event.data.type === 'quad-admin-arm') {
      sendToHeader(event.data.active);
      return;
    }

    /* Only new behavior: Header complete -> Navigation unlock. */
    if (event.data.type === 'quad-admin-header-complete') {
      showAdminMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (!isDesktop()) sendToHeader(false);
  });
}());
