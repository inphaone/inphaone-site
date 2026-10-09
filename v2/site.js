(function () {
  "use strict";
  var S = window.SITE || {};
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(id) { return document.getElementById(id); }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* links and headline from the shared content file */
  if (S.links) {
    document.querySelectorAll("[data-link]").forEach(function (a) { var k = a.getAttribute("data-link"); if (S.links[k]) a.href = S.links[k]; });
    if (S.links.email) document.querySelectorAll("a.mail").forEach(function (a) { a.href = "mailto:" + S.links.email; a.textContent = S.links.email; });
  }
  if (S.hero && S.hero.headline && $("headline")) $("headline").textContent = "( " + S.hero.headline + " )";

  /* hide the "loading" note once Spotify's player has loaded */
  var sp = $("spotify");
  if (sp) sp.addEventListener("load", function () { var h = document.querySelector(".spotify-hold"); if (h) h.textContent = ""; });

  /* watch: click to load YouTube in place */
  var v = S.video || {}, link = $("video-link");
  if (link) {
    if (v.id) link.href = "https://youtu.be/" + v.id;
    if (v.title && $("video-title")) $("video-title").textContent = v.title;
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var f = document.createElement("iframe");
      f.src = "https://www.youtube.com/embed/" + (v.id || "W3c4xrvIa-o") + "?autoplay=1&rel=0&playsinline=1";
      f.title = (v.title || "Inpha One") + " on YouTube";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      f.allowFullscreen = true;
      link.replaceWith(f);
    });
  }

  /* shows: upcoming first, past below, sorted by date */
  var list = $("shows-list");
  if (list && Array.isArray(S.shows)) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    function parse(d) { var p = String(d).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
    function fmt(d) { var p = String(d).split("-"); return p[2] + "." + p[1] + "." + p[0].slice(2); }
    function row(s) {
      var where = esc(s.event) + (s.venue ? ", " + esc(s.venue) : "");
      if (s.tickets) where = "<a href=\"" + esc(s.tickets) + "\" target=\"_blank\" rel=\"noopener\">" + where + "</a>";
      return "<div class=\"show\"><span class=\"show-date\">" + esc(fmt(s.date)) + "</span><span class=\"show-where\">" + where + "</span>" +
        (s.with ? "<span class=\"show-with\">w/ " + esc(s.with) + "</span>" : "") + "</div>";
    }
    var up = S.shows.filter(function (s) { return parse(s.date) >= today; }).sort(function (a, b) { return parse(a.date) - parse(b.date); });
    var past = S.shows.filter(function (s) { return parse(s.date) < today; }).sort(function (a, b) { return parse(b.date) - parse(a.date); });
    var html = up.length ? "<div>" + up.map(row).join("") + "</div>" : "<p class=\"big\">Nothing announced right now.</p>";
    if (past.length) html += "<span class=\"cap shows-head\">PAST SHOWS</span><div>" + past.map(row).join("") + "</div>";
    list.innerHTML = html;
  }

  /* robot bubble */
  var bubble = $("bubble-text"), typer = null;
  function typeText(text) {
    if (!bubble) return;
    clearInterval(typer);
    if (reduce) { bubble.textContent = text; return; }
    var n = 0; bubble.textContent = "";
    typer = setInterval(function () { n++; bubble.textContent = text.slice(0, n); if (n >= text.length) clearInterval(typer); }, 80);
  }
  if (bubble && "IntersectionObserver" in window && !reduce) {
    bubble.textContent = "";
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { typeText("hey, let's keep in touch"); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(bubble);
  }

  /* sign-up: same Google Sheet as the main site, marked as coming from v2 */
  var form = $("signup"), msg = $("form-msg"), got = $("received");
  function done() { form.hidden = true; got.hidden = false; typeText("yay! talk soon"); }
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = $("fan-email"), email = (input.value || "").trim();
    msg.textContent = "";
    var trap = form.querySelector("[name=website]");
    if (trap && trap.value) { done(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = "That email doesn't look right. Try again?"; input.focus(); return; }
    if (S.signupUrl) {
      var btn = form.querySelector("button"); btn.disabled = true;
      fetch(S.signupUrl, { method: "POST", body: new URLSearchParams({ email: email, source: "website-v2" }), mode: "no-cors" })
        .then(done)
        .catch(function () { btn.disabled = false; msg.textContent = "Something went wrong. Please try again in a moment."; });
    } else {
      var to = (S.links && S.links.email) || "inphaone@gmail.com";
      window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent("Keep me in touch") + "&body=" + encodeURIComponent("Please add " + email + " to the Inpha One list.");
      done();
    }
  });
})();
