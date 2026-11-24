/* card.js — собирает персональную карточку из JSON-анкеты на странице.
   Анкета — это блок <script type="application/json" data-student>.
   Работает без сети и без сервера, прямо с диска. */

(function () {
  "use strict";

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function siteRoot() {
    var meta = document.querySelector('meta[name="site-root"]');
    return meta ? (meta.getAttribute("content") || "") : "";
  }

  function initials(name) {
    var parts = String(name || "").trim().split(/\s+/);
    return parts.slice(0, 2).map(function (part) {
      return part.charAt(0).toUpperCase();
    }).join("");
  }

  var CONTACT_LABELS = {
    email: "Почта",
    telegram: "Telegram",
    github: "GitHub",
    phone: "Телефон"
  };

  function contactHref(key, value) {
    var v = String(value).trim();
    if (key === "email") return "mailto:" + v;
    if (key === "telegram") return "https://t.me/" + v.replace(/^@/, "");
    if (key === "github") {
      return "https://github.com/" +
        v.replace(/^https?:\/\/github\.com\//, "").replace(/^@/, "");
    }
    if (key === "phone") return "tel:" + v.replace(/[^+\d]/g, "");
    return null;
  }

  var box = document.getElementById("card-data");
  var block = document.querySelector('script[type="application/json"][data-student]');

  /* Анкеты нет — студент пишет карточку своим HTML, пустую зону убираем. */
  if (box && !block) box.remove();

  var free = document.querySelector(".free");
  if (free && !free.querySelector("*")) free.hidden = true;

  if (!box || !block) return;

  var data;
  try {
    data = JSON.parse(block.textContent);
  } catch (error) {
    box.innerHTML =
      '<div class="card-error">Не получилось прочитать анкету: ' +
      esc(error.message) +
      ". Проверьте блок &lt;script type=\"application/json\" data-student&gt;.</div>";
    return;
  }

  var root = siteRoot();
  var html = "";

  /* Шапка: фото, имя, роль */
  var photo = data.photo
    ? '<img class="card__photo" src="' + esc(root + data.photo) +
      '" alt="Фото: ' + esc(data.name) + '">'
    : '<div class="card__photo card__photo--empty" aria-hidden="true">' +
      esc(initials(data.name)) + "</div>";

  html += '<div class="card__head">' + photo +
    '<div><h1 class="card__name">' + esc(data.name) + "</h1>" +
    '<p class="card__role">' + esc(data.role || "") + "</p></div></div>";

  /* О себе */
  if (data.about) {
    var paragraphs = Array.isArray(data.about)
      ? data.about
      : String(data.about).split(/\n\s*\n/);

    html += '<section class="card__section"><h2>О себе</h2>';
    paragraphs.forEach(function (text) {
      var t = String(text).trim();
      if (t) html += "<p>" + esc(t) + "</p>";
    });
    html += "</section>";
  }

  /* Навыки */
  if (Array.isArray(data.skills) && data.skills.length) {
    html += '<section class="card__section"><h2>Навыки</h2><div class="badges">' +
      data.skills.map(function (skill) {
        return '<span class="badge">' + esc(skill) + "</span>";
      }).join("") +
      "</div></section>";
  }

  /* Контакты */
  if (data.contacts) {
    var rows = "";
    Object.keys(data.contacts).forEach(function (key) {
      var value = String(data.contacts[key] == null ? "" : data.contacts[key]).trim();
      if (!value) return;

      var label = esc(CONTACT_LABELS[key] || key);
      var href = contactHref(key, value);

      rows += "<li><span class=\"label\">" + label + "</span>" +
        (href
          ? '<a href="' + esc(href) + '" target="_blank" rel="noopener">' + esc(value) + "</a>"
          : "<span>" + esc(value) + "</span>") +
        "</li>";
    });

    if (rows) {
      html += '<section class="card__section"><h2>Контакты</h2>' +
        '<ul class="link-list">' + rows + "</ul></section>";
    }
  }

  box.innerHTML = html;

  if (data.name) {
    document.title = data.name + " — группа УДМП-109уцп";
  }
})();
