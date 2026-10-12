// Wedding date — used by the countdown and the calendar
const WEDDING = new Date('2027-09-03T13:20:00+03:00');
const COLORS = ['#f06d9c', '#ff9a4d', '#ffc93c', '#5aa9e6', '#b58ad6', '#7cc576'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Intro envelope ---------- */
const intro = $('#intro');
function openInvite() {
  if (intro.classList.contains('is-open')) return;
  intro.classList.add('is-open');
  burstConfetti($('.intro__confetti'));
  setTimeout(() => {
    document.body.classList.remove('is-locked');
    document.body.classList.add('is-ready');
  }, reduceMotion ? 0 : 1100);
  setTimeout(() => intro.remove(), 2600);
}
$('#envelope').addEventListener('click', openInvite);

function burstConfetti(host) {
  for (let i = 0; i < 46; i++) {
    const bit = document.createElement('span');
    bit.className = 'confetti-bit';
    const angle = Math.random() * Math.PI * 2;
    const dist = 160 + Math.random() * 260;
    bit.style.setProperty('--c', COLORS[i % COLORS.length]);
    bit.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
    bit.style.setProperty('--ty', `${Math.sin(angle) * dist - 80}px`);
    bit.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    bit.style.setProperty('--d', `${.15 + Math.random() * .25}s`);
    if (i % 3 === 0) bit.style.borderRadius = '50%';
    host.appendChild(bit);
  }
}

/* ---------- Colorful letters in the hero title ---------- */
let letterIndex = 0;
$$('[data-letters]').forEach((el) => {
  const text = el.textContent;
  el.textContent = '';
  for (const ch of text) {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = ch;
    span.style.color = COLORS[letterIndex % COLORS.length];
    span.style.setProperty('--i', letterIndex);
    span.style.setProperty('--r', `${(Math.random() * 14 - 7).toFixed(1)}deg`);
    span.setAttribute('aria-hidden', 'true');
    el.appendChild(span);
    letterIndex++;
  }
});

/* ---------- Wide bunting flags ---------- */
(function buildFlags() {
  const g = $('#wide-flags');
  const n = 12;
  const svgNS = 'http://www.w3.org/2000/svg';
  const fills = ['#f6a5c0', '#ffb27a', '#ffe08a', '#a9d68b', '#8fc8f0', '#c9a7e8'];
  const icons = ['#f06d9c', '#ff7a3d', '#f5b800', '#5fae4a', '#3f8fd6', '#9b6ad0'];
  for (let i = 0; i < n; i++) {
    const t = (i + .5) / n;
    const x = 400 * t;
    const y = (1 - t) ** 2 * 10 + 2 * (1 - t) * t * 50 + t ** 2 * 10;
    const flag = document.createElementNS(svgNS, 'g');
    flag.style.setProperty('--i', i);
    const c = i % fills.length;
    flag.innerHTML = `
      <path d="M${x - 15} ${y} L${x + 15} ${y} L${x} ${y + 44} Z" fill="${fills[c]}" stroke="#00000014" />
      ${i % 2
        ? `<path transform="translate(${x - 6} ${y + 9}) scale(.5)" d="M12 21s-7.5-4.6-9.6-9.2C.9 8.5 3 4.5 6.7 4.5c2.2 0 3.6 1.3 4.3 2.6h2c.7-1.3 2.1-2.6 4.3-2.6 3.7 0 5.8 4 4.3 7.3C19.5 16.4 12 21 12 21z" fill="${icons[c]}" />`
        : `<g fill="#ffffff99"><circle cx="${x - 6}" cy="${y + 8}" r="2"/><circle cx="${x + 5}" cy="${y + 10}" r="2"/><circle cx="${x}" cy="${y + 20}" r="2"/><circle cx="${x - 3}" cy="${y + 30}" r="1.6"/></g>`}
    `;
    g.appendChild(flag);
  }
})();

/* ---------- Calendar ---------- */
(function buildCalendar() {
  const host = $('#calendar');
  const year = 2027, month = 8; // September (0-based)
  const first = new Date(year, month, 1);
  const days = new Date(year, month + 1, 0).getDate();
  const offset = (first.getDay() + 6) % 7; // Monday-first
  const dows = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
  let html = `<div class="calendar__month">Сентябрь</div><div class="calendar__grid">`;
  html += dows.map((d) => `<span class="calendar__dow">${d}</span>`).join('');
  for (let i = 0; i < offset; i++) html += '<span></span>';
  for (let d = 1; d <= days; d++) {
    const isWedding = d === WEDDING.getUTCDate();
    html += `<span class="calendar__day${isWedding ? ' calendar__day--wedding' : ''}" style="--i:${d}">${d}${
      isWedding ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path pathLength="80" d="M12 20.5s-7.2-4.4-9.2-8.9C1.4 8.4 3.4 4.8 6.8 4.8c2.3 0 3.8 1.5 4.9 3.2.9-1.8 2.7-3.4 5.2-3.3 3.3.1 5.1 3.6 3.7 6.8-2 4.5-8.6 9-8.6 9z"/></svg>' : ''
    }</span>`;
  }
  host.innerHTML = html + '</div>';
})();

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    }
  });
}, { threshold: .18, rootMargin: '0px 0px -6% 0px' });
$$('.reveal, .hands, .palette').forEach((el) => io.observe(el));

/* ---------- Timeline drawn on scroll + travelling heart ---------- */
const timeline = $('#timeline');
const line = $('#timeline-line');
const track = $('.timeline__track');
const heart = $('#timeline-heart');
const trackLen = track.getTotalLength();
let ticking = false;
function onScroll() {
  ticking = false;
  const rect = timeline.getBoundingClientRect();
  const vh = window.innerHeight;
  const p = Math.min(1, Math.max(0, (vh * .62 - rect.top) / rect.height));
  line.style.strokeDashoffset = String(1 - p);
  const pt = track.getPointAtLength(p * trackLen);
  heart.style.transform = `translate(${(pt.x / 100) * rect.width}px, ${(pt.y / 1000) * rect.height}px)`;
  heart.style.opacity = p > 0 ? '1' : '0';

  // gentle parallax for hero doodles
  const doodles = $('.hero .doodles');
  if (doodles && window.scrollY < vh * 1.5) doodles.style.transform = `translateY(${window.scrollY * .18}px)`;
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

/* ---------- Countdown ---------- */
const nums = Object.fromEntries($$('.timer__num').map((el) => [el.dataset.unit, el]));
function pad(n) { return String(n).padStart(2, '0'); }
function updateTimer() {
  let diff = Math.max(0, WEDDING - Date.now());
  const s = Math.floor(diff / 1000);
  const values = {
    weeks: Math.floor(s / 604800),
    days: Math.floor((s % 604800) / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
  for (const [unit, value] of Object.entries(values)) {
    const el = nums[unit];
    const text = pad(value);
    if (el.textContent !== text) {
      el.textContent = text;
      el.classList.remove('tick');
      void el.offsetWidth;
      el.classList.add('tick');
    }
  }
  if (diff === 0) {
    $('#timer-done').hidden = false;
    clearInterval(timerId);
  }
}
const timerId = setInterval(updateTimer, 1000);
updateTimer();

/* ---------- RSVP (Netlify Forms) ---------- */
const form = $('#rsvp-form');
const statusEl = $('#rsvp-status');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = $('#rsvp-submit');
  const data = new FormData(form);
  const body = new URLSearchParams();
  body.set('form-name', 'rsvp');
  body.set('bot-field', data.get('bot-field') || '');
  body.set('name', (data.get('name') || '').trim());
  body.set('attendance', data.get('attendance') || '');
  body.set('drinks', data.getAll('drinks').join(', '));
  body.set('message', (data.get('message') || '').trim());

  btn.disabled = true;
  statusEl.classList.remove('is-error');
  statusEl.textContent = 'Отправляем…';
  try {
    const res = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    if (!res.ok) throw new Error(res.statusText);
    form.hidden = true;
    $('#rsvp-thanks').hidden = false;
    const r = $('#rsvp').getBoundingClientRect();
    burstHearts(window.innerWidth / 2, r.top + 140, 14);
  } catch {
    statusEl.classList.add('is-error');
    statusEl.textContent = 'Не удалось отправить. Попробуйте ещё раз, пожалуйста.';
  } finally {
    btn.disabled = false;
  }
});

/* ---------- Little hearts on tap ---------- */
function burstHearts(x, y, count = 1) {
  if (reduceMotion) return;
  for (let i = 0; i < count; i++) {
    const h = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    h.setAttribute('viewBox', '0 0 24 24');
    h.classList.add('tap-heart');
    h.innerHTML = '<use href="#i-heart"/>';
    h.style.left = `${x + (count > 1 ? Math.random() * 120 - 60 : 0)}px`;
    h.style.top = `${y + (count > 1 ? Math.random() * 40 - 20 : 0)}px`;
    h.style.setProperty('--c', COLORS[Math.floor(Math.random() * COLORS.length)]);
    h.style.setProperty('--dx', `${Math.random() * 60 - 30}px`);
    h.style.setProperty('--rot', `${Math.random() * 60 - 30}deg`);
    if (count > 1) h.style.animationDelay = `${Math.random() * .4}s`;
    document.body.appendChild(h);
    h.addEventListener('animationend', () => h.remove());
  }
}
$('#card').addEventListener('pointerdown', (e) => {
  if (e.target.closest('input, textarea, label, button, a')) return;
  burstHearts(e.clientX, e.clientY);
});
