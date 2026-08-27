/* ============================================================
   RAKSHABANDHAN 3D WEBSITE — script.js
   ============================================================ */

'use strict';

// ── LOADER ──────────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => loader.style.display = 'none', 900);
    initReveal();
    initPetals();
    initWishCarousel();
    initWishGenerator();
    initParallax();
  }, 1800);
});

// ── THREE.JS PARTICLE BACKGROUND ────────────────────────────
(function initThree() {
  const canvas = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Particles
  const count = 1200;
  const geo   = new THREE.BufferGeometry();
  const pos   = new Float32Array(count * 3);
  const colors= new Float32Array(count * 3);

  const palette = [
    [1.0, 0.42, 0.0],   // saffron
    [1.0, 0.84, 0.0],   // gold
    [0.75, 0.22, 0.17],  // crimson
    [1.0, 0.9,  0.7],   // cream
    [1.0, 0.55, 0.0],   // orange
  ];

  for (let i = 0; i < count; i++) {
    pos[i*3]   = (Math.random() - 0.5) * 120;
    pos[i*3+1] = (Math.random() - 0.5) * 80;
    pos[i*3+2] = (Math.random() - 0.5) * 80;
    const c = palette[Math.floor(Math.random() * palette.length)];
    colors[i*3]   = c[0];
    colors[i*3+1] = c[1];
    colors[i*3+2] = c[2];
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color',    new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 0.25,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,
    sizeAttenuation: true,
  });
  const stars = new THREE.Points(geo, mat);
  scene.add(stars);

  // Orbit rings
  const rings = [];
  const ringColors = [0xFFD700, 0xFF6B00, 0xC0392B];
  for (let r = 0; r < 3; r++) {
    const rGeo = new THREE.TorusGeometry(8 + r * 5, 0.06, 8, 100);
    const rMat = new THREE.MeshBasicMaterial({
      color: ringColors[r],
      transparent: true,
      opacity: 0.15,
    });
    const ring = new THREE.Mesh(rGeo, rMat);
    ring.rotation.x = Math.PI / 3 * r;
    ring.rotation.y = Math.PI / 4 * r;
    scene.add(ring);
    rings.push(ring);
  }

  // Mouse tracking
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.004;

    stars.rotation.y = t * 0.05 + mouseX * 0.08;
    stars.rotation.x = mouseY * 0.04;

    rings.forEach((ring, i) => {
      ring.rotation.z += 0.002 * (i + 1);
      ring.rotation.x += 0.001 * (i % 2 === 0 ? 1 : -1);
    });

    // Pulse opacity
    mat.opacity = 0.4 + 0.15 * Math.sin(t);

    renderer.render(scene, camera);
  }
  animate();
})();

// ── SCROLL REVEAL ────────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('visible'), delay);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => obs.observe(el));
}

// ── FLOATING PETALS ──────────────────────────────────────────
function initPetals() {
  const container = document.getElementById('petals');
  const emojis = ['🌸', '🌺', '🌼', '🌹', '🏵️', '✨'];
  
  function spawnPetal() {
    const el = document.createElement('div');
    el.className = 'petal-falling';
    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const size = 0.8 + Math.random() * 1.2;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${size}rem;
      animation-duration: ${6 + Math.random() * 8}s;
      animation-delay: ${Math.random() * 3}s;
      opacity: ${0.4 + Math.random() * 0.4};
    `;
    container.appendChild(el);
    setTimeout(() => el.remove(), 18000);
  }

  for (let i = 0; i < 12; i++) {
    setTimeout(spawnPetal, i * 300);
  }
  setInterval(spawnPetal, 1500);
}

// ── RAKHI 3D MOUSE TILT ──────────────────────────────────────
(function initRakhiTilt() {
  const wrap = document.getElementById('rakhi3d');
  if (!wrap) return;
  document.addEventListener('mousemove', e => {
    const rx = ((e.clientY / window.innerHeight) - 0.5) * 20;
    const ry = ((e.clientX / window.innerWidth)  - 0.5) * 30;
    wrap.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
})();

// ── WISH CAROUSEL ────────────────────────────────────────────
function initWishCarousel() {
  const cards = document.querySelectorAll('.wish-card');
  const dots  = document.querySelectorAll('.dot');
  let current = 0;
  let timer;

  function show(idx) {
    cards[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = idx;
    cards[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() {
    show((current + 1) % cards.length);
  }

  dots.forEach(d => {
    d.addEventListener('click', () => {
      clearInterval(timer);
      show(parseInt(d.dataset.idx));
      timer = setInterval(next, 4500);
    });
  });

  timer = setInterval(next, 4500);
}

// ── WISH GENERATOR ───────────────────────────────────────────
function initWishGenerator() {
  const btn  = document.getElementById('generateWish');
  const out  = document.getElementById('generatedWish');

  const templates = {
    sister: [
      "{sender} to {receiver}: Dear {receiver}, this little thread carries all my love, all my prayers, and all my memories of growing up with you. May you always be healthy, happy, and protected. Happy Rakshabandhan! 🪢",
      "{sender} to {receiver}: You are my first hero, {receiver}. I tie this rakhi on your wrist as a promise — that no matter how far life takes us, my love and prayers are always with you. 🌸",
      "My dearest {receiver}, on this sacred day, I tie this rakhi not just around your wrist but around your heart. You are my strength, my protector, my best friend. Love you always, {sender}. 🪔",
    ],
    brother: [
      "{sender} to {receiver}: Dear {receiver}, your love is the most beautiful gift I have ever received. This Raksha Bandhan, I promise to always stand by your side, through every joy and every storm. 💛",
      "To my wonderful sister {receiver}: The rakhi you tie every year is my greatest treasure. It reminds me of your love, your care, and the beautiful bond we share. Happy Rakshabandhan from {sender}. 🌺",
      "{sender} to {receiver}: You are the one who makes our house a home. Thank you for always caring, always smiling, and always believing in me. This Rakshabandhan I vow to be your guardian forever. 🪢",
    ],
  };

  btn.addEventListener('click', () => {
    const sender   = document.getElementById('senderName').value.trim()   || 'Your Sister';
    const receiver = document.getElementById('receiverName').value.trim() || 'Dear Brother';
    const type     = document.getElementById('wishType').value;
    const pool     = templates[type];
    const tmpl     = pool[Math.floor(Math.random() * pool.length)];
    const wish     = tmpl.replace(/{sender}/g, sender).replace(/{receiver}/g, receiver);

    out.textContent = wish;
    out.classList.remove('hidden');
    out.style.animation = 'none';
    requestAnimationFrame(() => { out.style.animation = ''; });
  });
}

// ── PARALLAX SCROLL ──────────────────────────────────────────
function initParallax() {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const hero = document.querySelector('.hero-content');
        if (hero) hero.style.transform = `translateY(${y * 0.25}px)`;
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ── NAVBAR SCROLL EFFECT ─────────────────────────────────────
(function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(10,3,5,0.92)';
      nav.style.boxShadow  = '0 4px 30px rgba(255,107,0,0.08)';
    } else {
      nav.style.background = 'rgba(10,3,5,0.7)';
      nav.style.boxShadow  = 'none';
    }
  });
})();
