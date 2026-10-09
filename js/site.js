(function () {
  "use strict";
  var S = window.SITE || {};
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(id) { return document.getElementById(id); }
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* banner: start the glitch once the photo is on screen, so the first burst is seen */
  var hero = document.querySelector(".hero"), heroImg = document.querySelector(".hero-img");
  function go() { if (hero) hero.classList.add("go"); }
  if (heroImg && !heroImg.complete) {
    heroImg.addEventListener("load", go);
    heroImg.addEventListener("error", go);
    setTimeout(go, 4000);
  } else { go(); }

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
  /* listen: our deck drives Spotify's own compact player through its iFrame API */
  (function () {
    var deck = $("deck"); if (!deck) return;
    var tracks = (S.tracks && S.tracks.length) ? S.tracks : [{ title: "NORTH STAR", meta: "Single 2024", spotify: "https://open.spotify.com/track/3OpiZ2tQIW1HNmsD6q7peV" }];
    var idx = 0, ctl = null, ready = false, wantPlay = false, playing = false, lastPos = 0, lastDur = 0, loading = false;
    var btn = $("deck-play"), stateEl = $("deck-state"), titleEl = $("deck-title"), metaEl = $("deck-meta"), prog = $("deck-prog"), timeEl = $("deck-time");
    function uri(t) { var m = String(t.spotify).match(/(track|album|artist|playlist)\/([A-Za-z0-9]+)/); return m ? "spotify:" + m[1] + ":" + m[2] : t.spotify; }
    function mmss(ms) { var s = Math.max(0, Math.floor(ms / 1000)); return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }
    function show() {
      var t = tracks[idx];
      titleEl.textContent = t.title; metaEl.textContent = "Inpha One · " + (t.meta || "");
      deck.classList.toggle("playing", playing);
      stateEl.textContent = playing ? "▶ now playing" : "❚❚ paused";
      btn.textContent = playing ? "PAUSE ❚❚" : "PLAY ▶";
      prog.style.width = lastDur ? Math.min(100, lastPos / lastDur * 100) + "%" : "0";
      timeEl.textContent = mmss(lastPos) + (lastDur ? " / " + mmss(lastDur) : "");
    }
    function loadApi() {
      if (window.__spotifyApiLoading) return; window.__spotifyApiLoading = true;
      window.onSpotifyIframeApiReady = function (API) {
        API.createController($("spotify-embed"), { uri: uri(tracks[idx]), width: "100%", height: 80 }, function (c) {
          ctl = c;
          c.addListener("ready", function () { ready = true; loading = false; if (wantPlay) { wantPlay = false; c.play(); } });
          c.addListener("playback_update", function (e) {
            var d = e.data || {};
            var was = playing, nearEnd = lastDur && lastPos >= lastDur - 1500;
            if (!d.isBuffering) playing = !d.isPaused;
            var ended = was && d.isPaused && (nearEnd || (d.duration && d.position >= d.duration - 600));
            lastPos = d.position || 0; lastDur = d.duration || 0;
            show();
            if (ended) { go(1, true); }
          });
        });
      };
      var sc = document.createElement("script"); sc.src = "https://open.spotify.com/embed/iframe-api/v1"; sc.async = true;
      sc.onerror = function () { $("spotify-embed").innerHTML = ""; };
      document.head.appendChild(sc);
    }
    function go(step, autoplay) {
      idx = (idx + step + tracks.length) % tracks.length; lastPos = 0; lastDur = 0; playing = false; show();
      if (ctl) { ready = false; loading = true; wantPlay = !!autoplay; ctl.loadUri(uri(tracks[idx])); setTimeout(function () { if (wantPlay && loading) { wantPlay = false; ctl.play(); } }, 1500); }
    }
    btn.addEventListener("click", function () {
      if (!ctl) { wantPlay = true; loadApi(); return; }
      if (!ready) { wantPlay = true; return; }
      ctl.togglePlay();
    });
    $("deck-prev").addEventListener("click", function () { go(-1, playing); });
    $("deck-next").addEventListener("click", function () { go(1, playing); });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { loadApi(); io.disconnect(); } }, { rootMargin: "300px" });
      io.observe(deck);
    } else { loadApi(); }
    show();
  })();

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
    var trap = form.querySelector("[name=website]");
    if (trap && trap.value) { done(); return; }
    if (S.signupUrl) {
      var btn = form.querySelector("button"); btn.disabled = true;
      var body = new URLSearchParams({ email: email, source: "website" });
      fetch(S.signupUrl, { method: "POST", body: body, mode: "no-cors" })
        .then(done)
        .catch(function () { btn.disabled = false; msg.textContent = "Signal lost. Please try again in a moment."; });
    } else {
      var to = (S.links && S.links.email) || "inphaone@gmail.com";
      window.location.href = "mailto:" + to + "?subject=" + encodeURIComponent("Keep me in touch") + "&body=" + encodeURIComponent("Please add " + email + " to the Inpha One list.");
      done();
    }
  });
})();
