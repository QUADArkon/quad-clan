(function () {
  'use strict';

  var catalogue = Array.isArray(window.QUAD_FILES) ? window.QUAD_FILES : [];
  var CATEGORY_PAGES = {
    engines: 'files/engines.html',
    maps_sp: 'files/maps_sp.html',
    maps_mp: 'files/maps_mp.html',
    mods: 'files/mods.html',
    bots: 'files/bots.html',
    improvements: 'files/improvements.html',
    tools: 'files/tools.html'
  };

  function activeFiles() {
    return catalogue.filter(function (file) {
      return file && file.active !== false;
    });
  }

  /* Stored as DDMMYYYY. Convert only for chronological comparison. */
  function dateKey(value) {
    var v = String(value || '');
    var m = v.match(/^(\d{2})(\d{2})(\d{4})$/);
    return m ? m[3] + m[2] + m[1] : '';
  }

  function sortNewest(list) {
    return list.slice().sort(function (a, b) {
      return dateKey(b.date).localeCompare(dateKey(a.date));
    });
  }

  /* Visible dates use English/US format MM/DD/YYYY. */
  function displayDate(value) {
    var v = String(value || '');
    var m = v.match(/^(\d{2})(\d{2})(\d{4})$/);
    return m ? m[2] + '/' + m[1] + '/' + m[3] : v;
  }

  function downloadHref(file) {
    return file.url || (file.filename ? '../files/' + file.category + '/' + file.filename : '');
  }

  function categoryHref(file) {
    var page = CATEGORY_PAGES[file.category];
    return page && file.id ? page + '#' + encodeURIComponent(file.id) : '';
  }

  function navigateInternal(href) {
    if (!href) return;
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'quad-desktop-navigate',
        href: href
      }, '*');
    } else {
      window.location.href = '../' + href;
    }
  }

  function renderCategory() {
    var list = document.getElementById('filesList');
    if (!list) return;

    var category = list.dataset.category || '';
    var files = sortNewest(activeFiles().filter(function (file) {
      return file.category === category;
    }));

    if (!files.length) {
      var empty = document.createElement('p');
      empty.className = 'files-empty';
      empty.textContent = 'No files available yet.';
      list.appendChild(empty);
      return;
    }

    files.forEach(function (file) {
      var article = document.createElement('article');
      article.className = 'file-entry content-box';
      if (file.id) article.id = file.id;

      var title = document.createElement('h4');
      title.className = 'file-title';
      title.textContent = file.title || file.filename || 'Untitled file';
      article.appendChild(title);

      if (file.description) {
        var description = document.createElement('p');
        description.className = 'file-description';
        description.textContent = file.description;
        article.appendChild(description);
      }

      var metaParts = [];
      if (file.version) metaParts.push('Version: ' + file.version);
      if (file.author) metaParts.push('Author: ' + file.author);
      if (file.size) metaParts.push('Size: ' + file.size);
      if (file.date) metaParts.push('Date: ' + displayDate(file.date));

      if (metaParts.length) {
        var meta = document.createElement('p');
        meta.className = 'file-meta';
        meta.textContent = metaParts.join(' | ');
        article.appendChild(meta);
      }

      if (file.filename) {
        var download = document.createElement('a');
        download.className = 'file-download';
        download.href = downloadHref(file);
        download.textContent = 'Download ' + file.filename;
        article.appendChild(download);
      }

      list.appendChild(article);
    });

    highlightHashTarget();
  }

  function highlightHashTarget() {
    if (!window.location.hash) return;
    var id;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch (e) {
      id = window.location.hash.slice(1);
    }
    if (!id) return;

    var target = document.getElementById(id);
    if (!target) return;

    var title = target.querySelector('.file-title');
    target.scrollIntoView({block: 'center'});

    if (title) {
      title.classList.add('is-target');
      window.setTimeout(function () {
        title.classList.remove('is-target');
      }, 1800);
    }
  }

  function renderLatest() {
    var latest = document.getElementById('latestFiles');
    if (!latest) return;

    var limit = parseInt(latest.dataset.filesLimit, 10) || 5;
    var files = sortNewest(activeFiles()).slice(0, limit);
    var links = document.createElement('div');
    links.className = 'file-links';

    if (!files.length) {
      var empty = document.createElement('div');
      empty.className = 'files-empty';
      empty.textContent = 'No files available yet.';
      latest.appendChild(empty);
      return;
    }

    files.forEach(function (file) {
      var href = categoryHref(file);
      if (!href) return;

      var a = document.createElement('a');
      a.href = '../' + href;

      var label = displayDate(file.date);
      if (label) label += ' ';
      label += file.latestTitle || file.title || file.filename || 'Untitled file';
      if (file.author) label += ' by ' + file.author;
      a.textContent = label;

      a.addEventListener('click', function (event) {
        event.preventDefault();
        navigateInternal(href);
      });

      links.appendChild(a);
    });

    latest.appendChild(links);
  }

  renderCategory();
  renderLatest();
})();
