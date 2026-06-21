import { firebaseConfig } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const DEFAULT_CONTENT = {
  brandName: "Maximiza tu Empresa",
  displayName: "Zamir Rojas Jaramillo",
  heroTitle: "Tu acceso directo a mis redes, proyectos y servicios",
  heroSubtitle: "Creador de páginas web, portafolios y soluciones digitales para negocios.",
  email: "maximizatuempresas@gmail.com",
  whatsapp: "989562313",
  whatsappMessage: "Hola Zamir, quiero información sobre una página web.",
  facebookUrl: "#",
  spotifyUrl: "#",
  instagramUrl: "#",
  tiktokUrl: "#",
  youtubeUrl: "#",
  linkedinUrl: "#",
  githubUrl: "#",
  profileImageUrl: "",
  statusLabel: "Disponible",
  statusDescription: "Puedes escribirme para solicitar páginas web, sistemas o soporte digital."
};

function firebaseIsConfigured() {
  return firebaseConfig && firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("PEGA_AQUI");
}

async function loadContent() {
  if (!firebaseIsConfigured()) {
    applyContent(DEFAULT_CONTENT);
    return;
  }

  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const snap = await getDoc(doc(db, "site", "content"));
    const data = snap.exists() ? { ...DEFAULT_CONTENT, ...snap.data() } : DEFAULT_CONTENT;
    applyContent(data);
  } catch (error) {
    console.warn("Firebase público no disponible:", error);
    applyContent(DEFAULT_CONTENT);
  }
}

function applyContent(data) {
  setText("[data-content='brandName']", data.brandName);
  setText("[data-content='displayName']", data.displayName);
  setText("[data-content='heroTitle']", data.heroTitle);
  setText("[data-content='heroSubtitle']", data.heroSubtitle);
  setText("[data-content='email']", data.email);
  setText("[data-content='statusLabel']", data.statusLabel);
  setText("[data-content='statusDescription']", data.statusDescription);

  setHref("[data-link='email']", `mailto:${data.email}`);
  setHref("[data-link='facebook']", data.facebookUrl);
  setHref("[data-link='spotify']", data.spotifyUrl);
  setHref("[data-link='instagram']", data.instagramUrl);
  setHref("[data-link='tiktok']", data.tiktokUrl);
  setHref("[data-link='youtube']", data.youtubeUrl);
  setHref("[data-link='linkedin']", data.linkedinUrl);
  setHref("[data-link='github']", data.githubUrl);

  const waText = encodeURIComponent(data.whatsappMessage || DEFAULT_CONTENT.whatsappMessage);
  setHref("[data-link='whatsapp']", `https://wa.me/51${cleanPhone(data.whatsapp)}?text=${waText}`);

  if (data.profileImageUrl) {
    document.querySelectorAll("[data-image='profile']").forEach((img) => {
      img.src = data.profileImageUrl;
      img.alt = data.displayName || "Foto principal";
    });
  }
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((el) => {
    if (value) el.textContent = value;
  });
}

function setHref(selector, href) {
  document.querySelectorAll(selector).forEach((el) => {
    if (href && href !== "#") {
      el.href = href;
      el.classList.remove("placeholder-link");
    }
  });
}

function cleanPhone(value) {
  return String(value || "").replace(/\D/g, "");
}

loadContent();
