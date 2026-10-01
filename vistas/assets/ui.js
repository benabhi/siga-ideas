/* SIGA · Utilidades de interfaz compartidas por los mockups */
window.UI = (function () {
  'use strict';

  function icons() { if (window.lucide) window.lucide.createIcons(); }

  function pill(estado) {
    var e = SIGA.ESTADOS[estado];
    return '<span class="pill tone-' + e.tone + '">' + e.label + '</span>';
  }

  var toastTimer;
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status');
      document.body.appendChild(t);
    }
    t.innerHTML = '<i data-lucide="circle-check"></i><span></span>';
    t.querySelector('span').textContent = msg;
    icons();
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2800);
  }

  // Modal simple: opts = { title, text, body (html), confirm, tone, wide, onConfirm(modalEl) -> false para no cerrar }
  function modal(opts) {
    var back = document.createElement('div');
    back.className = 'modal-backdrop';
    back.innerHTML =
      '<div class="modal' + (opts.wide ? ' modal-wide' : '') + '" role="dialog" aria-modal="true" aria-labelledby="modal-title">' +
        '<header><div><h3 id="modal-title"></h3>' + (opts.text ? '<p></p>' : '') + '</div>' +
        '<button class="btn btn-ghost btn-icon" data-close aria-label="Cerrar"><i data-lucide="x"></i></button></header>' +
        '<div class="modal-body">' + (opts.body || '') + '</div>' +
        '<footer>' + (opts.confirm ? '<button class="btn" data-close>Cancelar</button><button class="btn ' + (opts.tone || 'btn-primary') + '" data-ok>' + opts.confirm + '</button>' : '<button class="btn" data-close>Cerrar</button>') + '</footer>' +
      '</div>';
    back.querySelector('h3').textContent = opts.title;
    if (opts.text) back.querySelector('header p').textContent = opts.text;
    document.body.appendChild(back);
    icons();
    function close() { back.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', onKey);
    back.addEventListener('click', function (e) {
      if (e.target === back || e.target.closest('[data-close]')) close();
      if (e.target.closest('[data-ok]') && (!opts.onConfirm || opts.onConfirm(back) !== false)) close();
    });
    var first = back.querySelector('textarea, input, select, [data-ok]');
    if (first) first.focus();
    return back;
  }

  function sidebar() {
    var app = document.querySelector('.app');
    var btn = document.querySelector('.menu-btn');
    if (!app || !btn) return;
    btn.addEventListener('click', function () { app.classList.toggle('nav-open'); });
    document.addEventListener('click', function (e) {
      if (app.classList.contains('nav-open') && !e.target.closest('.sidebar') && !e.target.closest('.menu-btn')) app.classList.remove('nav-open');
    });
  }

  document.addEventListener('DOMContentLoaded', function () { sidebar(); icons(); });

  return { icons: icons, pill: pill, toast: toast, modal: modal };
})();
