import { firebaseConfig, ADMIN_EMAIL } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

const DEFAULT_CONTENT = {
  brandName: "Maximiza tu Empresa",
  displayName: "Zamir Rojas Jaramillo",
  heroTitle: "Tu acceso directo a mis redes, proyectos y servicios",
  heroSubtitle: "Creador de páginas web, portafolios y soluciones digitales para negocios.",
  email: "maximizatuempresas@gmail.com",
  whatsapp: "989562313",
  whatsappMessage: "Hola Zamir, quiero información sobre una página web.",
  facebookUrl: "",
  spotifyUrl: "",
  instagramUrl: "",
  tiktokUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
  githubUrl: "",
  profileImageUrl: "",
  statusLabel: "Disponible",
  statusDescription: "Puedes escribirme para solicitar páginas web, sistemas o soporte digital.",
  officeHours: "9:00 a. m. - 6:30 p. m.",
  gymHours: "7:30 p. m. - 9:30 p. m.",
  restHours: "10:30 p. m. - 7:30 a. m.",
  servicesText: "Páginas web, portafolios digitales, sistemas web, automatización, diseño futurista y soporte.",
  paymentsText: "Coordinar pagos, donaciones o adelantos por WhatsApp."
};

const loginBox = document.getElementById("adminLoginBox");
const panel = document.getElementById("adminPanel");
const loginForm = document.getElementById("firebaseLoginForm");
const adminMessage = document.getElementById("adminMessage");
const saveButton = document.getElementById("saveContent");
const logoutButton = document.getElementById("logoutButton");
const imageInput = document.getElementById("profileImageInput");

let app;
let auth;
let db;
let storage;
let currentContent = { ...DEFAULT_CONTENT };

function firebaseIsConfigured() {
  return firebaseConfig && firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("PEGA_AQUI");
}

function showMessage(text) {
  if (adminMessage) adminMessage.textContent = text;
}

function setVisible(el, visible) {
  if (!el) return;
  el.hidden = !visible;
  el.classList.toggle("hidden", !visible);
}

function init() {
  if (!firebaseIsConfigured()) {
    showMessage("Falta configurar firebase-config.js");
    return;
  }

  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  loginForm?.addEventListener("submit", handleLogin);
  saveButton?.addEventListener("click", saveContent);
  logoutButton?.addEventListener("click", () => signOut(auth));

  onAuthStateChanged(auth, async (user) => {
    if (user && user.email === ADMIN_EMAIL) {
      setVisible(loginBox, false);
      setVisible(panel, true);
      await loadContent();
    } else {
      setVisible(loginBox, true);
      setVisible(panel, false);
      if (user && user.email !== ADMIN_EMAIL) {
        await signOut(auth);
        showMessage("Este correo no está autorizado.");
      }
    }
  });
}

async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("adminEmail")?.value.trim();
  const password = document.getElementById("adminPassword")?.value;

  if (!email || !password) {
    showMessage("Completa correo y clave.");
    return;
  }

  try {
    showMessage("Ingresando...");
    await signInWithEmailAndPassword(auth, email, password);
    showMessage("");
  } catch (error) {
    showMessage("No se pudo ingresar. Revisa correo o clave.");
  }
}

async function loadContent() {
  try {
    const snap = await getDoc(doc(db, "site", "content"));
    currentContent = snap.exists() ? { ...DEFAULT_CONTENT, ...snap.data() } : { ...DEFAULT_CONTENT };
    fillForm(currentContent);
  } catch (error) {
    showMessage("No se pudo cargar contenido.");
    fillForm(DEFAULT_CONTENT);
  }
}

function fillForm(data) {
  Object.entries(data).forEach(([key, value]) => {
    const input = document.querySelector(`[name="${key}"]`);
    if (input) input.value = value || "";
  });
}

function readForm() {
  const form = document.getElementById("contentForm");
  const data = { ...currentContent };

  form.querySelectorAll("[name]").forEach((input) => {
    data[input.name] = input.value.trim();
  });

  return data;
}

async function saveContent() {
  try {
    showMessage("Guardando...");
    let data = readForm();

    const file = imageInput?.files?.[0];
    if (file) {
      const fileRef = ref(storage, `site/profile-${Date.now()}-${file.name}`);
      await uploadBytes(fileRef, file);
      data.profileImageUrl = await getDownloadURL(fileRef);
    }

    data.updatedAt = serverTimestamp();

    await setDoc(doc(db, "site", "content"), data, { merge: true });
    currentContent = data;
    showMessage("Guardado correctamente.");
  } catch (error) {
    console.error(error);
    showMessage("No se pudo guardar. Revisa reglas de Firebase.");
  }
}

init();
