/* ============================================================
   Zweite Chance — script.js
   Heartbeat cursor, marquee + testimonials, FAQ accordion,
   live toast, scroll-reveal, smooth scroll, theme switch.
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Data ---------- */
  var marquee = [
    '8000+ Menschen begleitet', '4,9/5 Durchschnittsbewertung', '100% vertraulich',
    'Psychologisch fundierte Methode', '10+ Jahre Erfahrung',
    'Kostenloses Video-Training'
  ];

  var testimonials = [
    { quote: 'Endlich habe ich meinen Anteil daran verstanden. Drei Wochen später hatten wir das Gespräch, das ich monatelang vermieden hatte.', name: 'Stefan W.', meta: 'Verifizierter Teilnehmer', initial: 'S', color: 'var(--accent)' },
    { quote: 'Keine Spielchen. Es hat mich ernst genommen und mir geholfen, ruhig genug zu werden, um klar zu denken.', name: 'Marco L.', meta: 'Verifizierter Teilnehmer', initial: 'M', color: '#2E7D5B' },
    { quote: 'Ehrlich gesagt half mir das System zu entscheiden, mich NICHT zu melden — und genau diese Klarheit brauchte ich.', name: 'Daniel K.', meta: 'Verifizierter Teilnehmer', initial: 'D', color: '#3A6EA5' },
    { quote: 'Ruhig, praktisch und respektvoll. Ich geriet nicht mehr in Panik, sondern überlegte, was wirklich gesund ist.', name: 'Julian R.', meta: 'Verifizierter Teilnehmer', initial: 'J', color: '#A8884E' }
  ];

  var faqs = [
    { q: 'Ist das Manipulation oder ein billiger Trick?', a: 'Nein. Das Training basiert auf Beziehungspsychologie und Selbstreflexion. Es gibt keine Skripte, um jemanden zu manipulieren — es geht darum, dich selbst zu verstehen und ehrlich zu kommunizieren.' },
    { q: 'Wie lange dauert es und was kostet es?', a: 'Das Video-Training dauert etwa 18 Minuten und ist völlig kostenlos. Es gibt nichts zu bezahlen und du brauchst keine Kreditkarte, um es anzusehen.' },
    { q: 'Was, wenn meine Ex schon jemand Neues hat?', a: 'Das Training geht direkt darauf ein. Es hilft dir, die Situation realistisch einzuschätzen und den gesündesten Weg für dich zu wählen.' },
    { q: 'Werden meine Daten vertraulich behandelt?', a: 'Ja. Alles ist vertraulich und diskret. Wir geben deine Daten niemals weiter, und du kannst das Training privat ansehen.' }
  ];

  var toastPeople = [
    'Stefan W.', 'Marco L.', 'Daniel K.', 'Julian R.', 'Tobias M.',
    'Lukas B.', 'Florian H.', 'Markus S.', 'Christian P.', 'Andreas N.',
    'Patrick E.', 'Kevin R.', 'Simon F.', 'Thomas G.', 'Michael D.',
    'Jan K.', 'Dominik L.', 'Felix M.', 'Alexander W.', 'Niklas T.',
    'David C.', 'Benjamin Z.', 'Sebastian V.', 'Fabian O.', 'Jonas A.'
  ];

  var toastActions = [
    'hat gerade das Training gestartet',
    'sieht sich gerade das Training an',
    'hat das Training abgeschlossen',
    'hat sich gerade angemeldet'
  ];

  function randomAgo() {
    var mins = Math.floor(Math.random() * 12) + 1;
    return mins === 1 ? 'gerade eben' : 'vor ' + mins + ' Min';
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function init() {
    buildMarquee();
    buildTestimonials();
    buildFaq();
    setupReveal();
    setupSmoothScroll();
    startToast();
    setupVideoModal();
    if (!('ontouchstart' in window) && window.matchMedia('(pointer:fine)').matches) {
      setupHeartbeat();
    }
  }

  /* ---------- Marquee (duplicated for seamless loop) ---------- */
  function buildMarquee() {
    var el = document.getElementById('marquee');
    if (!el) return;
    var star = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.4"><path d="M12 2l2.4 7.4H22l-6 4.4 2.3 7.2-6.3-4.6L5.7 21 8 13.8 2 9.4h7.6z"/></svg>';
    var items = marquee.concat(marquee).map(function (label) {
      return '<span class="marquee-item">' + star + ' ' + esc(label) + '</span>';
    });
    el.innerHTML = items.join('');
  }

  /* ---------- Testimonials (duplicated for seamless loop) ---------- */
  function buildTestimonials() {
    var el = document.getElementById('testimonials');
    if (!el) return;
    var html = testimonials.concat(testimonials).map(function (t) {
      return '' +
        '<div class="testimonial">' +
          '<div class="stars">★★★★★</div>' +
          '<p class="testimonial-quote">' + esc(t.quote) + '</p>' +
          '<div class="testimonial-foot">' +
            '<div class="testimonial-avatar" style="background:' + t.color + '">' + esc(t.initial) + '</div>' +
            '<div>' +
              '<div class="testimonial-name">' + esc(t.name) + '</div>' +
              '<div class="testimonial-meta">' + esc(t.meta) + '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    });
    el.innerHTML = html.join('');
  }

  /* ---------- FAQ accordion ---------- */
  function buildFaq() {
    var el = document.getElementById('faq-list');
    if (!el) return;
    el.innerHTML = faqs.map(function (f, i) {
      return '' +
        '<div class="faq-item reveal' + (i === 0 ? ' open' : '') + '">' +
          '<button class="faq-q" aria-expanded="' + (i === 0) + '">' +
            esc(f.q) +
            '<span class="faq-toggle">+</span>' +
          '</button>' +
          '<div class="faq-a"><div class="faq-a-inner">' + esc(f.a) + '</div></div>' +
        '</div>';
    }).join('');

    el.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq-q');
      if (!btn) return;
      var item = btn.parentElement;
      var isOpen = item.classList.contains('open');
      // close all
      el.querySelectorAll('.faq-item').forEach(function (it) {
        it.classList.remove('open');
        it.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  function setupReveal() {
    var els = [].slice.call(document.querySelectorAll('.reveal, .reveal-l, .reveal-r, .reveal-s'));
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -6% 0px' });

    var vh = window.innerHeight || document.documentElement.clientHeight;
    els.forEach(function (el) {
      // Reveal anything already in view on load straight away (no waiting for scroll).
      if (el.getBoundingClientRect().top < vh * 0.92) {
        el.classList.add('in');
      } else {
        io.observe(el);
      }
    });
  }

  /* ---------- Smooth scroll to CTA ---------- */
  function setupSmoothScroll() {
    document.querySelectorAll('[data-scroll-cta]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var cta = document.getElementById('cta');
        if (cta) window.scrollTo({ top: cta.offsetTop - 40, behavior: 'smooth' });
      });
    });

    document.querySelectorAll('[data-scroll-video]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var section = document.getElementById('video-preview');
        var video = document.getElementById('preview-video');
        if (!section) return;
        window.scrollTo({ top: section.offsetTop - 40, behavior: 'smooth' });
        if (video) {
          setTimeout(function () { video.play(); }, 600);
        }
      });
    });
  }

  /* ---------- Live social-proof toast ---------- */
  function startToast() {
    var toast = document.getElementById('toast');
    var nameEl = document.getElementById('toast-name');
    var agoEl = document.getElementById('toast-ago');
    if (!toast) return;

    // shuffle so order is different each page load
    var pool = toastPeople.slice().sort(function () { return 0.5 - Math.random(); });
    var i = 0;

    function show() {
      var name = pool[i % pool.length];
      var action = toastActions[i % toastActions.length];
      i++;
      nameEl.textContent = name;
      document.querySelector('.toast-action').textContent = ' ' + action;
      agoEl.textContent = randomAgo();
      toast.hidden = false;
      toast.classList.remove('show');
      void toast.offsetWidth;
      toast.classList.add('show');
    }
    setTimeout(show, 8000);
    setInterval(show, 14000);
  }

  /* ---------- Heartbeat cursor (middle layer) ---------- */
  function setupHeartbeat() {
    var canvas = document.getElementById('heartbeat');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0;

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    var cx = W / 2, cy = H * 0.4, active = false, alpha = 0, seen = false;
    window.addEventListener('mousemove', function (e) { cx = e.clientX; cy = e.clientY; active = true; seen = true; }, { passive: true });
    window.addEventListener('mouseout', function (e) { if (!e.relatedTarget && !e.toElement) active = false; }, { passive: true });
    window.addEventListener('blur', function () { active = false; });
    window.addEventListener('resize', resize);

    var rings = [];
    var lastLub = -1, lastDub = -1;
    var P = 1.05, maxR = 72, life = 1.05;

    function heartPath(hx, hy, rad) {
      var sc = rad / 17;
      ctx.beginPath();
      for (var a = 0; a <= Math.PI * 2 + 0.001; a += 0.16) {
        var sx = 16 * Math.pow(Math.sin(a), 3);
        var sy = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a);
        var px = hx + sc * sx, py = hy - sc * sy;
        if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }

    function accentRgb() {
      return (getComputedStyle(document.documentElement).getPropertyValue('--accentRgb') || '194,74,69').trim();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      alpha += ((active ? 1 : 0) - alpha) * 0.07;
      var t = performance.now() / 1000;
      var rgb = accentRgb();
      var cycle = Math.floor(t / P), localT = t - cycle * P;

      if (seen && active) {
        if (localT >= 0 && lastLub !== cycle) { rings.push({ x: cx, y: cy, born: t, s: 1 }); lastLub = cycle; }
        if (localT >= 0.21 && lastDub !== cycle) { rings.push({ x: cx, y: cy, born: t, s: 0.74 }); lastDub = cycle; }
      }
      rings = rings.filter(function (r) { return (t - r.born) < life; });

      ctx.shadowColor = 'rgba(' + rgb + ',0.8)';
      for (var k = 0; k < rings.length; k++) {
        var r = rings[k];
        var age = (t - r.born) / life;
        var e = 1 - Math.pow(1 - age, 2);
        var rad = 9 + e * maxR * r.s;
        var a = (1 - age) * 0.5 * alpha * r.s;
        if (a <= 0) continue;
        heartPath(r.x, r.y, rad);
        ctx.lineWidth = Math.max(0.6, (1 - age) * 2.8);
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(' + rgb + ',' + a + ')';
        ctx.shadowBlur = 14;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      if (seen && alpha > 0.02) {
        var env = Math.exp(-Math.pow(localT / 0.055, 2)) + 0.7 * Math.exp(-Math.pow((localT - 0.21) / 0.055, 2));
        var hr = 24 + env * 18;
        var hg = ctx.createRadialGradient(cx, cy, 0, cx, cy, hr);
        hg.addColorStop(0, 'rgba(' + rgb + ',' + ((0.40 + 0.32 * env) * alpha) + ')');
        hg.addColorStop(1, 'rgba(' + rgb + ',0)');
        ctx.fillStyle = hg;
        ctx.beginPath(); ctx.arc(cx, cy, hr, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = 'rgba(' + rgb + ',' + alpha + ')';
        heartPath(cx, cy, 7 + env * 5); ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  /* ---------- Video-midpoint registration modal ---------- */
  function setupVideoModal() {
    var video    = document.getElementById('preview-video');
    var overlay  = document.getElementById('reg-modal');
    var closeBtn = document.getElementById('modal-close');
    if (!overlay) return;

    var pausedAt  = 0;
    var submitted = false;

    function openModal() {
      overlay.style.display = 'flex';
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          overlay.classList.add('open');
          document.body.style.overflow = 'hidden';
        });
      });
    }

    function closeModal() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(function () {
        overlay.style.display = 'none';
        if (!video) return;
        if (submitted) {
          video.currentTime = pausedAt;
          video.play();
        } else {
          video.currentTime = 0;
          video.pause();
          modalFired = false;
        }
      }, 380);
    }

    if (video) {
      var modalFired = false;
      video.addEventListener('timeupdate', function () {
        if (!modalFired && !submitted && video.duration && video.currentTime >= video.duration * 0.5) {
          modalFired = true;
          pausedAt = video.currentTime;
          video.pause();
          openModal();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
    });

    var form   = document.getElementById('modal-form');
    var status = document.getElementById('mf-status');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var emailVal = document.getElementById('mf-email').value.trim();
      if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        status.style.color = '#E0795A';
        status.textContent = 'Bitte gib eine gültige E-Mail-Adresse ein.';
        return;
      }
      submitted = true;
      var inner = document.getElementById('modal-inner');
      if (!inner) return;
      inner.innerHTML =
        '<div class="modal-success">' +
          '<div class="modal-success-icon">' +
            '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.6" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>' +
          '</div>' +
          '<h3 class="modal-success-title">Wir haben deine Anfrage!</h3>' +
          '<p class="modal-success-sub">Du erhältst bald eine persönliche Nachricht von uns.<br>Danke, dass du diesen ersten Schritt gemacht hast.</p>' +
          '<button class="btn-primary" id="modal-done-btn" style="border:none;cursor:pointer;margin-top:28px">' +
            'Video weiter ansehen &nbsp;▶' +
          '</button>' +
        '</div>';
      var doneBtn = document.getElementById('modal-done-btn');
      if (doneBtn) doneBtn.addEventListener('click', closeModal);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
