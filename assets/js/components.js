/* components.js — общие шапка и подвал для всех страниц сайта.
   Пути строятся от <meta name="site-root">, поэтому страницы можно
   класть на любую глубину папок. */

(function () {
  "use strict";

  var NAV = [
    { id: "home", label: "Главная", href: "index.html" },
    { id: "info", label: "Информация", href: "info/index.html" },
    { id: "team", label: "Состав", href: "team/index.html" }
  ];

  /* Персональные карточки тоже принадлежат разделу «Состав». */
  var PAGE_ALIAS = { card: "team" };

  function siteRoot() {
    var meta = document.querySelector('meta[name="site-root"]');
    return meta ? (meta.getAttribute("content") || "") : "";
  }

  function currentPage() {
    var page = document.body.getAttribute("data-page") || "home";
    return PAGE_ALIAS[page] || page;
  }

  function navHtml(root, page) {
    return NAV.map(function (item) {
      var current = item.id === page ? ' aria-current="page"' : "";
      return '<a href="' + root + item.href + '"' + current + ">" +
        item.label + "</a>";
    }).join("");
  }

  class SiteHeader extends HTMLElement {
    connectedCallback() {
      var root = siteRoot();
      this.innerHTML =
        '<header class="site-header"><div class="container site-header__inner">' +
        '<a class="brand" href="' + root + 'index.html">' +
        '<img src="' + root + 'assets/img/logo.svg" alt="">' +
        "<span>Группа УДМП-109уцп</span></a>" +
        '<nav class="site-nav">' + navHtml(root, currentPage()) + "</nav>" +
        "</div></header>";
    }
  }

  class SiteFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML =
        '<footer class="site-footer"><div class="container">' +
        "<p>Учебная группа УДМП-109уцп · Московский университет „Синергия“ · 2026</p>" +
        "</div></footer>";
    }
  }

  customElements.define("site-header", SiteHeader);
  customElements.define("site-footer", SiteFooter);
})();
