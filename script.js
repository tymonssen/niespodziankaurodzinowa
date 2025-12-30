/* ============================
   KONFIGURACJA FILMÓW
   ============================ */
const COUNT = 20;
const videoGrid = document.getElementById('videoGrid');
const searchInput = document.getElementById('search');
const shuffleBtn = document.getElementById('shuffleBtn');

let videos = [];

for (let i = 1; i <= COUNT; i++) {
  const id = i;
  const title = `Film ${i}`;
  const src = `videos/video${i}.mp4`;
  const thumb = `images/thumb${i}.jpg`;
  videos.push({ id, title, src, thumb });
}

/* Render miniaturek */
function renderGrid(list) {
  videoGrid.innerHTML = '';
  list.forEach(v => {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.tabIndex = 0;

    card.innerHTML = `
      <img class="thumb" loading="lazy" src="${v.thumb}" alt="${v.title}">
      <div class="meta">
        <div class="title">${v.title}</div>
        <div class="tag">#${v.id}</div>
      </div>
    `;

    card.addEventListener('click', () => openModalById(v.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openModalById(v.id); });

    videoGrid.appendChild(card);
  });
}

renderGrid(videos);

/* Search */
searchInput.addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) return renderGrid(videos);
  const filtered = videos.filter(v =>
    v.title.toLowerCase().includes(q) ||
    String(v.id) === q
  );
  renderGrid(filtered);
});

/* Shuffle */
shuffleBtn.addEventListener('click', () => {
  const idx = Math.floor(Math.random() * videos.length);
  openModalById(videos[idx].id);
});

/* ============================
   Modal / Player
   ============================ */
const modal = document.getElementById('videoModal');
const backdrop = document.getElementById('backdrop');
const player = document.getElementById('player');
const playerTitle = document.getElementById('playerTitle');
const closeModalBtn = document.getElementById('closeModal');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const downloadLink = document.getElementById('downloadLink');

let currentIndex = -1;

/* ███★ POPRAWIONA FUNKCJA ★██ */
function openModalById(id) {
  const idx = videos.findIndex(v => v.id === id);
  if (idx === -1) return;

  currentIndex = idx;
  const item = videos[currentIndex];

  player.pause();
  player.src = item.src;
  player.load();

  playerTitle.textContent = item.title;

  downloadLink.href = item.src;
  downloadLink.setAttribute('download', `${item.title.replace(/\s+/g, '_')}.mp4`);

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');

  /* 🔥 Fix: zablokowanie przewijania */
  document.body.classList.add("no-scroll");

  /* 🔥 Fix: przewinięcie na górę */
  window.scrollTo({ top: 0, behavior: "instant" });

  player.play().catch(() => {});
}

/* Next / Prev */
function openNext() {
  if (currentIndex < 0) return;
  currentIndex = (currentIndex + 1) % videos.length;
  openModalById(videos[currentIndex].id);
}
function openPrev() {
  if (currentIndex < 0) return;
  currentIndex = (currentIndex - 1 + videos.length) % videos.length;
  openModalById(videos[currentIndex].id);
}

nextBtn.addEventListener('click', openNext);
prevBtn.addEventListener('click', openPrev);

/* ███★ POPRAWIONE ZAMYKANIE ★██ */
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  player.pause();
  player.src = '';

  /* 🔥 Fix: przywrócenie scrolla */
  document.body.classList.remove("no-scroll");
}

closeModalBtn.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);

/* klawisze */
window.addEventListener('keydown', e => {
  if (modal.classList.contains('open')) {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') openNext();
    if (e.key === 'ArrowLeft') openPrev();
  }
});

/* Preload miniatur */
videos.slice(0, 6).forEach(v => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = v.src;
  link.as = 'video';
  document.head.appendChild(link);
});

/* ============================
   HEART CONFETTI (TSParticles)
   ============================ */
tsParticles.load("particles-js", {
  particles: {
    number: { value: 60, density: { enable: true, value_area: 900 } },

    shape: {
      type: "image",
      image: [
        { src: "images/heart.png", width: 40, height: 40 },
        { src: "images/heart.png", width: 28, height: 28 },
        { src: "images/heart.png", width: 18, height: 18 }
      ]
    },

    opacity: {
      value: 1,
      random: true
    },

    size: {
      value: 22,
      random: true
    },

    move: {
      enable: true,
      speed: 2,
      direction: "bottom",
      random: true,
      straight: false,
      out_mode: "out",
      wobble: { enable: true, distance: 8, speed: 3 }
    },

    rotate: {
      value: 0,
      random: true,
      direction: "random",
      animation: { enable: true, speed: 10 }
    },

    tilt: {
      enable: true,
      value: { min: 0, max: 360 },
      direction: "random",
      animation: { enable: true, speed: 4 }
    }
  },

  interactivity: {
    events: {
      onhover: { enable: false },
      onclick: { enable: false }
    }
  },

  retina_detect: true
});

