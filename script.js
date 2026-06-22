/* MAXIMIZA TU EMPRESA - V3
   Fase 2.1: Estado dinámico
   Fase 2.2: Spotify widget visual
   Fase 3: Preparado para Netlify Functions
*/

const CONFIG = {
  whatsapp: "989562313",
  whatsappInternational: "51989562313",
  email: "zamirrojas1990@gmail.com",
  spotifyFunction: "/.netlify/functions/spotify-now-playing",
  statusFunction: "/.netlify/functions/status",
  spotifyFallbackPage: "spotify.html"
};

const STATUS_CONFIG = {
  timezone: "America/Lima",
  defaultStatus: {
    key: "available",
    label: "Disponible",
    title: "Disponible para nuevos proyectos",
    description: "Puedes escribirme por WhatsApp para solicitar páginas web, sistemas o soporte digital.",
    className: "status-available"
  },
  schedule: [
    {
      key: "office",
      label: "En oficina",
      title: "Trabajando en oficina",
      description: "Estoy atendiendo proyectos, revisando avances o preparando nuevas soluciones digitales.",
      className: "status-office",
      days: [1, 2, 3, 4, 5, 6],
      start: "09:00",
      end: "18:30"
    },
    {
      key: "gym",
      label: "En gimnasio",
      title: "En entrenamiento",
      description: "Ahora estoy en el gimnasio. Puedes dejarme tu mensaje y te responderé apenas esté disponible.",
      className: "status-gym",
      days: [1, 2, 3, 4, 5, 6],
      start: "19:30",
      end: "21:30"
    },
    {
      key: "rest",
      label: "Descansando",
      title: "Fuera de horario",
      description: "Estoy fuera de horario. Igual puedes escribirme y te responderé cuando esté disponible.",
      className: "status-rest",
      days: [0, 1, 2, 3, 4, 5, 6],
      start: "22:30",
      end: "07:30"
    }
  ],
  manualStatuses: [
    {
      key: "available",
      label: "Disponible",
      title: "Disponible para nuevos proyectos",
      description: "Puedes escribirme ahora por WhatsApp para solicitar una página web o sistema.",
      className: "status-available",
      icon: "✓"
    },
    {
      key: "office",
      label: "En oficina",
      title: "Trabajando en oficina",
      description: "Estoy revisando proyectos, páginas web o sistemas digitales.",
      className: "status-office",
      icon: "⌂"
    },
    {
      key: "gym",
      label: "En gimnasio",
      title: "En entrenamiento",
      description: "Estoy entrenando. Déjame tu mensaje y responderé al terminar.",
      className: "status-gym",
      icon: "⚡"
    },
    {
      key: "busy",
      label: "Ocupado",
      title: "Ocupado por el momento",
      description: "Estoy atendiendo algo importante. Puedes escribirme y responderé luego.",
      className: "status-busy",
      icon: "●"
    },
    {
      key: "working",
      label: "Trabajando",
      title: "Trabajando en proyecto",
      description: "Estoy concentrado desarrollando o diseñando un proyecto digital.",
      className: "status-office",
      icon: "⌘"
    },
    {
      key: "rest",
      label: "Descansando",
      title: "Descansando",
      description: "Estoy fuera de horario. Puedes dejarme tu mensaje.",
      className: "status-rest",
      icon: "☾"
    }
  ]
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

document.addEventListener("DOMContentLoaded", () => {
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  initNavigation();
  initCursorGlow();
  initReveal();
  initCopyButtons();
  initMagneticButtons();
  initTiltCards();
  initStatus();
  initStatusAdmin();
  initAdminLogin();
  initSpotifyWidget();
  initParticles();
});

function initNavigation() {
  const menuBtn = $("#menuBtn");
  const navLinks = $("#navLinks");

  menuBtn?.addEventListener("click", () => {
    navLinks?.classList.toggle("open");
  });

  navLinks?.addEventListener("click", (event) => {
    if (event.target.tagName === "A") navLinks.classList.remove("open");
  });

  const current = document.body.dataset.page;
  $$("[data-nav]").forEach((link) => {
    if (link.dataset.nav === current) link.classList.add("active");
  });
}

function initCursorGlow() {
  const cursorGlow = $(".cursor-glow");
  window.addEventListener("pointermove", (event) => {
    if (!cursorGlow) return;
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

function initReveal() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach((item) => revealObserver.observe(item));
}

function initCopyButtons() {
  $("#copyPhone")?.addEventListener("click", async () => {
    await copyText(CONFIG.whatsapp, "WhatsApp copiado: 989562313", "WhatsApp: 989562313");
  });

  $("#copyEmail")?.addEventListener("click", async () => {
    await copyText(CONFIG.email, "Correo copiado: zamirrojas1990@gmail.com", "Correo: zamirrojas1990@gmail.com");
  });
}

async function copyText(text, success, fallback) {
  try {
    await navigator.clipboard.writeText(text);
    showToast(success);
  } catch {
    showToast(fallback);
  }
}

function initMagneticButtons() {
  $$(".magnetic").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * .08}px, ${y * .12}px) translateY(-2px)`;
    });
    button.addEventListener("mouseleave", () => button.style.transform = "");
  });
}

function initTiltCards() {
  $$(".link-card, .project-card, .service-card, .pay-card, .info-card, .status-option").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - .5) * -8;
      card.style.transform = `translateY(-7px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener("mouseleave", () => card.style.transform = "");
  });
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast = setTimeout(() => toast.classList.remove("show"), 3200);
}

/* ===============================
   ESTADO DINÁMICO
   =============================== */

function initStatus() {
  const status = getCurrentStatus();
  renderStatus(status);
  loadRemoteStatus();
}

async function loadRemoteStatus() {
  try {
    const response = await fetch(CONFIG.statusFunction, {
      headers: { "Accept": "application/json" },
      cache: "no-store"
    });

    if (!response.ok) return;

    const data = await response.json();
    if (data && data.manual && data.status) {
      renderStatus(data.status);
    }
  } catch {
    // En local o sin Netlify Functions, se mantiene el horario automático.
  }
}

function getCurrentStatus() {
  const manual = getManualStatus();
  if (manual) return manual;

  const now = getLimaTimeParts();
  const match = STATUS_CONFIG.schedule.find((item) => {
    return item.days.includes(now.day) && isTimeInside(now.minutes, item.start, item.end);
  });

  return match || STATUS_CONFIG.defaultStatus;
}

function getManualStatus() {
  const raw = localStorage.getItem("maximiza_status_manual");
  if (!raw) return null;

  try {
    const data = JSON.parse(raw);
    if (!data || !data.key) return null;

    if (data.expiresAt && Date.now() > data.expiresAt) {
      localStorage.removeItem("maximiza_status_manual");
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

function getLimaTimeParts() {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: STATUS_CONFIG.timezone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  const parts = formatter.formatToParts(new Date());
  const weekdayText = parts.find(p => p.type === "weekday")?.value || "Mon";
  const hour = Number(parts.find(p => p.type === "hour")?.value || 0);
  const minute = Number(parts.find(p => p.type === "minute")?.value || 0);

  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    day: map[weekdayText] ?? new Date().getDay(),
    minutes: hour * 60 + minute
  };
}

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function isTimeInside(current, start, end) {
  const s = toMinutes(start);
  const e = toMinutes(end);

  if (s <= e) return current >= s && current <= e;
  return current >= s || current <= e;
}

function renderStatus(status) {
  const label = $("[data-status-label]");
  const title = $("[data-status-title]");
  const description = $("[data-status-description]");
  const dot = $("[data-status-dot]");

  if (label) label.textContent = status.label || "Disponible";
  if (title) title.textContent = status.title || "Estado personal";
  if (description) description.textContent = status.description || "";

  if (dot) {
    dot.className = "dot";
    dot.classList.add(status.className || "status-available");
  }

  const preview = $("#currentStatusPreview");
  if (preview) {
    preview.innerHTML = `
      <strong>${status.label || "Disponible"}</strong>
      <p>${status.description || ""}</p>
    `;
  }
}

function initStatusAdmin() {
  const container = $("#statusOptions");
  if (!container) return;

  const manual = getManualStatus();

  container.innerHTML = STATUS_CONFIG.manualStatuses.map((status) => `
    <button class="status-option info-card glass ${manual?.key === status.key ? "active" : ""}" data-status-key="${status.key}">
      <span>${status.icon}</span>
      <h3>${status.label}</h3>
      <p>${status.description}</p>
    </button>
  `).join("");

  container.addEventListener("click", (event) => {
    const button = event.target.closest("[data-status-key]");
    if (!button) return;

    const selected = STATUS_CONFIG.manualStatuses.find(s => s.key === button.dataset.statusKey);
    if (!selected) return;

    const duration = Number($("#statusDuration")?.value || 4);
    const expiresAt = Date.now() + duration * 60 * 60 * 1000;

    localStorage.setItem("maximiza_status_manual", JSON.stringify({
      ...selected,
      expiresAt
    }));

    showToast(`Estado cambiado: ${selected.label}`);
    renderStatus(selected);
    initStatusAdmin();
  });

  $("#clearStatus")?.addEventListener("click", () => {
    localStorage.removeItem("maximiza_status_manual");
    const automatic = getCurrentStatus();
    renderStatus(automatic);
    initStatusAdmin();
    showToast("Estado manual eliminado. Volvió el horario automático.");
  });
}


/* ===============================
   ADMIN PRIVADO
   =============================== */

function initAdminLogin() {
  const loginForm = $("#adminLoginForm");
  const panel = $("#adminPanel");
  const loginBox = $("#adminLoginBox");

  if (!loginForm) return;

  const savedPassword = sessionStorage.getItem("maximiza_admin_password");
  if (savedPassword) {
    showAdminPanel();
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const password = $("#adminPassword")?.value || "";
    const message = $("#adminMessage");

    if (!password.trim()) {
      if (message) message.textContent = "Ingresa la clave.";
      return;
    }

    if (message) message.textContent = "Verificando...";

    try {
      const result = await adminRequest({ action: "check", password });

      if (result.ok) {
        sessionStorage.setItem("maximiza_admin_password", password);
        showAdminPanel();
        showToast("Acceso correcto");
      } else {
        if (message) message.textContent = "Clave incorrecta.";
      }
    } catch {
      if (message) message.textContent = "Requiere Netlify Functions.";
    }
  });

  $("#adminLogout")?.addEventListener("click", () => {
    sessionStorage.removeItem("maximiza_admin_password");
    panel?.classList.add("hidden");
    if (panel) panel.hidden = true;
    loginBox?.classList.remove("hidden");
    if (loginBox) loginBox.hidden = false;
    showToast("Sesión cerrada");
  });

  $("#adminClearStatus")?.addEventListener("click", async () => {
    const password = sessionStorage.getItem("maximiza_admin_password");
    if (!password) return;

    try {
      const result = await adminRequest({ action: "clear", password });
      if (result.ok) {
        showToast("Estado manual eliminado");
        renderStatus(getCurrentStatus());
      }
    } catch {
      showToast("No se pudo limpiar el estado");
    }
  });
}

function showAdminPanel() {
  const loginBox = $("#adminLoginBox");
  const panel = $("#adminPanel");

  loginBox?.classList.add("hidden");
  if (loginBox) loginBox.hidden = true;

  panel?.classList.remove("hidden");
  if (panel) panel.hidden = false;

  renderAdminStatusButtons();
  loadRemoteStatus();
}

function renderAdminStatusButtons() {
  const container = $("#adminStatusOptions");
  if (!container) return;

  container.innerHTML = STATUS_CONFIG.manualStatuses.map((status) => `
    <button class="status-option info-card glass" data-admin-status="${status.key}">
      <span>${status.icon}</span>
      <h3>${status.label}</h3>
      <p>${status.description}</p>
    </button>
  `).join("");

  container.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-admin-status]");
    if (!button) return;

    const statusKey = button.dataset.adminStatus;
    const durationHours = Number($("#adminDuration")?.value || 4);
    const password = sessionStorage.getItem("maximiza_admin_password");

    if (!password) {
      showToast("Primero inicia sesión");
      return;
    }

    try {
      const result = await adminRequest({
        action: "set",
        password,
        statusKey,
        durationHours
      });

      if (result.ok && result.status) {
        renderStatus(result.status);
        showToast(`Estado actualizado: ${result.status.label}`);
      } else {
        showToast(result.message || "No se pudo actualizar");
      }
    } catch {
      showToast("No se pudo conectar con Netlify Function");
    }
  });
}

async function adminRequest(payload) {
  const response = await fetch(CONFIG.statusFunction, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return response.json();
}


/* ===============================
   SPOTIFY WIDGET
   =============================== */

async function initSpotifyWidget() {
  const widget = $("#spotifyWidget");
  if (!widget) return;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(CONFIG.spotifyFunction, {
      signal: controller.signal,
      headers: { "Accept": "application/json" }
    });

    clearTimeout(timeout);

    if (!response.ok) throw new Error("Spotify function not ready");
    const data = await response.json();

    renderSpotify(data);
  } catch {
    renderSpotify({
      isPlaying: false,
      configured: false,
      title: "Spotify pendiente",
      artist: "Conecta Netlify Functions para mostrar lo que escuchas.",
      url: "spotify.html"
    });
  }
}

function renderSpotify(data) {
  const widgets = $$("#spotifyWidget, #spotifyWidgetLarge");
  widgets.forEach((widget) => {
    const cover = widget.querySelector(".spotify-cover");
    const title = widget.querySelector("#spotifyTitle, [data-spotify-title]");
    const artist = widget.querySelector("#spotifyArtist, [data-spotify-artist]");

    if (cover) {
      if (data.albumImageUrl) {
        cover.innerHTML = `<img src="${escapeHTML(data.albumImageUrl)}" alt="Portada de álbum">`;
      } else {
        cover.innerHTML = `<span>♫</span>`;
      }
    }

    if (title) title.textContent = data.title || "Spotify pendiente";
    if (artist) {
      artist.innerHTML = `
        ${data.artist || "Conecta Spotify para mostrar música en vivo."}
        ${data.url ? `<br><a href="${escapeHTML(data.url)}" target="_blank" rel="noopener">Abrir en Spotify →</a>` : ""}
      `;
    }

    const label = widget.querySelector("[data-spotify-state]");
    if (label) {
      label.textContent = data.isPlaying ? "Escuchando ahora" : "Spotify";
    }
  });
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/* Enviar solicitud por WhatsApp desde la página Solicitar */
function sendServiceRequest() {
  const name = encodeURIComponent($("#clientName")?.value || "");
  const business = encodeURIComponent($("#businessName")?.value || "");
  const message = encodeURIComponent($("#projectMessage")?.value || "");
  const text = `Hola Natán, quiero solicitar una página web.%0A%0ANombre: ${name}%0ANegocio: ${business}%0AIdea: ${message}`;
  window.open(`https://wa.me/${CONFIG.whatsappInternational}?text=${text}`, "_blank", "noopener");
}

/* Partículas */
function initParticles() {
  const canvas = $("#particles");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  let width = 0;
  let height = 0;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth * devicePixelRatio;
    height = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const amount = Math.min(100, Math.floor(window.innerWidth / 14));
    particles = Array.from({ length: amount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * .32 * devicePixelRatio,
      vy: (Math.random() - .5) * .32 * devicePixelRatio,
      r: (Math.random() * 1.65 + .55) * devicePixelRatio,
      a: Math.random() * .55 + .22
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${p.a})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 118 * devicePixelRatio) {
          const opacity = (1 - dist / (118 * devicePixelRatio)) * .14;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(155, 92, 255, ${opacity})`;
          ctx.lineWidth = devicePixelRatio;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}
