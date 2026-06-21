/* MAXIMIZA TU EMPRESA - V2 */

const CONFIG = {
  whatsapp: "989562313",
  whatsappInternational: "51989562313",
  email: "zamirrojas1990@gmail.com",
  spotify: "#",
  facebook: "#"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

document.addEventListener("DOMContentLoaded", () => {
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

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

  const cursorGlow = $(".cursor-glow");
  window.addEventListener("pointermove", (event) => {
    if (!cursorGlow) return;
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });

  $$(".reveal").forEach((item) => revealObserver.observe(item));

  $$(".placeholder-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const name = link.dataset.name || "este enlace";
      showToast(`${name}: falta colocar tu enlace exacto en script.js.`);
    });
  });

  $("#copyPhone")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.whatsapp);
      showToast("WhatsApp copiado: 989562313");
    } catch {
      showToast("WhatsApp: 989562313");
    }
  });

  $("#copyEmail")?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.email);
      showToast("Correo copiado: zamirrojas1990@gmail.com");
    } catch {
      showToast("Correo: zamirrojas1990@gmail.com");
    }
  });

  $$(".magnetic").forEach((button) => {
    button.addEventListener("mousemove", (event) => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * .08}px, ${y * .12}px) translateY(-2px)`;
    });
    button.addEventListener("mouseleave", () => button.style.transform = "");
  });

  $$(".link-card, .project-card, .service-card, .pay-card, .info-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - .5) * 8;
      const y = ((event.clientY - rect.top) / rect.height - .5) * -8;
      card.style.transform = `translateY(-7px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener("mouseleave", () => card.style.transform = "");
  });

  initParticles();
});

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast = setTimeout(() => toast.classList.remove("show"), 3200);
}

/* Enviar solicitud por WhatsApp desde la página Solicitar */
function sendServiceRequest() {
  const name = encodeURIComponent($("#clientName")?.value || "");
  const business = encodeURIComponent($("#businessName")?.value || "");
  const message = encodeURIComponent($("#projectMessage")?.value || "");
  const text = `Hola Zamir, quiero solicitar una página web.%0A%0ANombre: ${name}%0ANegocio: ${business}%0AIdea: ${message}`;
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
