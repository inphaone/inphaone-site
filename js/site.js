(function () {
  "use strict";
  var S = window.SITE || {};
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(id) { return document.getElementById(id); }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* year */
  var y = $("year"); if (y) y.textContent = new Date().getFullYear();

  /* links */
  if (S.links) {
    document.querySelectorAll("[data-link]").forEach(function (a) {
      var k = a.getAttribute("data-link"); if (S.links[k]) a.href = S.links[k];
    });
    if (S.links.email) document.querySelectorAll("a.mail").forEach(function (a) { a.href = "mailto:" + S.links.email; a.textContent = S.links.email; });
  }

  /* hero */
  if (S.hero) {
    if (S.hero.headline && $("headline")) $("headline").textContent = S.hero.headline;
    if (S.hero.tag && $("signal")) $("signal").setAttribute("data-text", S.hero.tag);
  }

  /* signal scramble */
  var sig = $("signal");
  if (sig) {
    var target = sig.getAttribute("data-text") || sig.textContent;
    if (reduce) { sig.textContent = target; }
    else {
      var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#*", frame = 0;
      var t = setInterval(function () {
        frame++; var done = Math.floor(frame / 2), out = "";
        for (var i = 0; i < target.length; i++) out += (i < done || target[i] === " ") ? target[i] : chars[Math.floor(Math.random() * chars.length)];
        sig.textContent = out;
        if (done >= target.length) clearInterval(t);
      }, 60);
    }
  }

  /* listen */
  var play = $("play-spotify");
  if (play) play.addEventListener("click", function () {
    var url = (S.links && S.links.spotify) || "https://open.spotify.com/artist/0F5VMlDz3p1ZcUj0ktYers";
    var m = url.match(/open\.spotify\.com\/(artist|album|track|playlist)\/([A-Za-z0-9]+)/);
    if (!m) { window.open(url, "_blank", "noopener"); return; }
    var deck = $("deck");
    var f = document.createElement("iframe");
    f.src = "https://open.spotify.com/embed/" + m[1] + "/" + m[2] + "?utm_source=generator&theme=0";
    f.title = "Inpha One on Spotify";
    f.loading = "lazy";
    f.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    deck.querySelector(".eq").replaceWith(f);
    play.remove();
  });

  /* watch: click to load YouTube in place */
  var v = S.video || {};
  var link = $("video-link");
  if (link) {
    if (v.id) link.href = "https://youtu.be/" + v.id;
    if (v.title && $("video-title")) $("video-title").textContent = v.title;
    if (v.title) link.setAttribute("aria-label", "Play " + v.title);
    link.addEventListener("click", function (e) {
      var id = v.id || "W3c4xrvIa-o";
      e.preventDefault();
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      f.title = (v.title || "Inpha One") + " on YouTube";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      f.allowFullscreen = true;
      link.replaceWith(f);
    });
  }

  /* shows: sort into upcoming and past by date */
  var list = $("shows-list");
  if (list && Array.isArray(S.shows)) {
    var today = new Date(); today.setHours(0, 0, 0, 0);
    function parse(d) { var p = String(d).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
    function fmt(d) { var p = String(d).split("-"); return p[2] + "." + p[1] + "." + p[0]; }
    function row(s) {
      var where = esc(s.event) + (s.venue ? ", " + esc(s.venue) : "");
      if (s.tickets) where = "<a href=\"" + esc(s.tickets) + "\" target=\"_blank\" rel=\"noopener\">" + where + "</a>";
      return "<div class=\"show\"><span class=\"show-date\">" + esc(fmt(s.date)) + "</span><span class=\"show-where\">" + where + "</span>" +
        (s.with ? "<span class=\"show-with\">with " + esc(s.with) + "</span>" : "") + "</div>";
    }
    var up = S.shows.filter(function (s) { return parse(s.date) >= today; }).sort(function (a, b) { return parse(a.date) - parse(b.date); });
    var past = S.shows.filter(function (s) { return parse(s.date) < today; }).sort(function (a, b) { return parse(b.date) - parse(a.date); });
    var html = up.length ? "<div class=\"upcoming\">" + up.map(row).join("") + "</div>" : "<p class=\"nosignal\">NO SIGNAL · nothing announced right now</p>";
    if (past.length) html += "<p class=\"shows-head\">PAST TRANSMISSIONS</p><div class=\"past\">" + past.map(row).join("") + "</div>";
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
  if (bubble) {
    var first = "hey, let's keep in touch";
    if ("IntersectionObserver" in window && !reduce) {
      bubble.textContent = "";
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { typeText(first); io.disconnect(); }
      }, { threshold: 0.4 });
      io.observe(bubble);
    }
  }

  /* sign-up */
  var form = $("signup"), msg = $("form-msg"), got = $("received");
  function done() { form.hidden = true; got.hidden = false; typeText("yay! talk soon"); }
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    var input = $("fan-email"), email = (input.value || "").trim();
    msg.textContent = "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { msg.textContent = "That email doesn't look right. Try again?"; input.focus(); return; }
    if (S.kitFormId) {
      var body = new FormData(); body.append("email_address", email);
      fetch("https://app.kit.com/forms/" + encodeURIComponent(S.kitFormId) + "/subscriptions", { method: "POST", body: body, mode: "no-cors" })
        .then(done)
        .catch(function () { msg.textContent = "Signal lost. Please try again in a moment."; });
    } else {
      var to = (S.links && S.links.email) || "inphaone@gmail.com";
      window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent("Keep me in touch") + "&body=" + encodeURIComponent("Please add " + email + " to the Inpha One list.");
      done();
    }
  });
})();
