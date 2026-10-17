(function () {
  'use strict';

  var catalogue = Array.isArray(window.QUAD_FILES) ? window.QUAD_FILES : [];

  function activeFiles() {
    return catalogue.filter(function (file) {
      return file && file.active !== false;
    });
  }

  function sortNewest(list) {
    return list.slice().sort(function (a, b) {
      return String(b.date || '').localeCompare(String(a.date || ''));
    });
  }

  function displayDate(value) {
    var v = String(value || '');
    var m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? m[2] + '/' + m[3] + '/' + m[1].slice(2) : v;
  }

  function downloadHref(file) {
    return file.filename ? '../files/' + file.category + '/' + file.filename : '';
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
      if (file.date) metaParts.push('Date: ' + file.date);
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
      var a = document.createElement('a');
      a.href = downloadHref(file);
      a.target = 'main';
      var label = displayDate(file.date);
      if (label) label += ' ';
      label += file.title || file.filename || 'Untitled file';
      if (file.author) label += ' by ' + file.author;
      a.textContent = label;
      links.appendChild(a);
    });

    latest.appendChild(links);
  }

  renderCategory();
  renderLatest();
})();
