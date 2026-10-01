  // 分頁
  document.querySelectorAll('.tab').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (x) { x.setAttribute('aria-selected', 'false'); });
      document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
      t.setAttribute('aria-selected', 'true');
      document.getElementById(t.getAttribute('aria-controls')).classList.add('active');
    });
  });

  // YouTube：點擊才載入 iframe
  document.querySelectorAll('.yt').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + b.dataset.id + '?autoplay=1&rel=0';
      f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true;
      f.title = b.getAttribute('aria-label');
      b.replaceChildren(f);
    });
  });

  // 進場淡入
  (function () {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (en.isIntersecting) { en.target.style.transitionDelay = (Math.min(i, 5) * 70) + 'ms'; en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  })();

  // 星空：緩慢閃爍的星點 + 每 7–12 秒一顆流星
  (function () {
    var c = document.getElementById('sky');
    if (!c || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var ctx = c.getContext('2d'), W, H, stars = [], meteor = null, nextMeteor = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() {
      var r = c.parentElement.getBoundingClientRect(); W = r.width; H = r.height;
      c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = [];
      var n = Math.round(W * H / 9000);
      for (var i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H * .92, r: Math.random() * 1.3 + .3, p: Math.random() * Math.PI * 2, s: .4 + Math.random() * .9, warm: Math.random() < .18 });
    }
    function spawnMeteor(t) {
      var x0 = W * (.35 + Math.random() * .6), y0 = H * (Math.random() * .25);
      meteor = { x: x0, y: y0, vx: -(5 + Math.random() * 3), vy: 2.2 + Math.random() * 1.2, life: 0, max: 55 + Math.random() * 20 };
      nextMeteor = t + 7000 + Math.random() * 5000;
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i], a = .35 + .65 * (0.5 + 0.5 * Math.sin(t / 1000 * s.s + s.p));
        ctx.globalAlpha = a; ctx.fillStyle = s.warm ? '#ffd27f' : '#ffffff';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (!meteor && t > nextMeteor) spawnMeteor(t);
      if (meteor) {
        var m = meteor, k = m.life / m.max, fade = k < .2 ? k / .2 : 1 - (k - .2) / .8;
        var g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * 14, m.y - m.vy * 14);
        g.addColorStop(0, 'rgba(255,240,200,' + (.9 * fade) + ')'); g.addColorStop(1, 'rgba(255,240,200,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(m.x - m.vx * 14, m.y - m.vy * 14); ctx.stroke();
        m.x += m.vx; m.y += m.vy; m.life++;
        if (m.life > m.max || m.x < -50 || m.y > H) meteor = null;
      }
      requestAnimationFrame(draw);
    }
    size(); nextMeteor = 2500; window.addEventListener('resize', size);
    requestAnimationFrame(draw);
  })();
