// Netlify Function: status
// Variable requerida en Netlify:
// ADMIN_PASSWORD
//
// Usa Netlify Blobs para guardar el estado global.

const ALLOWED_STATUSES = {
  available: {
    key: "available",
    label: "Disponible",
    title: "Disponible para nuevos proyectos",
    description: "Puedes escribirme ahora por WhatsApp para solicitar una página web o sistema.",
    className: "status-available"
  },
  office: {
    key: "office",
    label: "En oficina",
    title: "Trabajando en oficina",
    description: "Estoy revisando proyectos, páginas web o sistemas digitales.",
    className: "status-office"
  },
  gym: {
    key: "gym",
    label: "En gimnasio",
    title: "En entrenamiento",
    description: "Estoy entrenando. Déjame tu mensaje y responderé al terminar.",
    className: "status-gym"
  },
  busy: {
    key: "busy",
    label: "Ocupado",
    title: "Ocupado por el momento",
    description: "Estoy atendiendo algo importante. Puedes escribirme y responderé luego.",
    className: "status-busy"
  },
  working: {
    key: "working",
    label: "Trabajando",
    title: "Trabajando en proyecto",
    description: "Estoy concentrado desarrollando o diseñando un proyecto digital.",
    className: "status-office"
  },
  rest: {
    key: "rest",
    label: "Descansando",
    title: "Descansando",
    description: "Estoy fuera de horario. Puedes dejarme tu mensaje.",
    className: "status-rest"
  }
};

exports.handler = async function (event) {
  try {
    const { getStore } = await import("@netlify/blobs");
    const store = getStore("maximiza-status");

    if (event.httpMethod === "GET") {
      const current = await getCurrentStatus(store);
      return json(current, 200);
    }

    if (event.httpMethod !== "POST") {
      return json({ ok: false, message: "Método no permitido" }, 405);
    }

    const body = JSON.parse(event.body || "{}");
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return json({ ok: false, message: "Falta ADMIN_PASSWORD en Netlify" }, 200);
    }

    if (body.password !== adminPassword) {
      return json({ ok: false, message: "Clave incorrecta" }, 401);
    }

    if (body.action === "check") {
      return json({ ok: true }, 200);
    }

    if (body.action === "clear") {
      await store.delete("current");
      return json({ ok: true, manual: false }, 200);
    }

    if (body.action === "set") {
      const selected = ALLOWED_STATUSES[body.statusKey];

      if (!selected) {
        return json({ ok: false, message: "Estado no válido" }, 400);
      }

      const durationHours = Math.max(1, Math.min(Number(body.durationHours || 4), 48));
      const payload = {
        manual: true,
        status: selected,
        updatedAt: Date.now(),
        expiresAt: Date.now() + durationHours * 60 * 60 * 1000
      };

      await store.set("current", JSON.stringify(payload));

      return json({ ok: true, ...payload }, 200);
    }

    return json({ ok: false, message: "Acción no válida" }, 400);

  } catch (error) {
    return json({
      ok: false,
      manual: false,
      message: "Función no configurada",
      error: error?.message || "Error"
    }, 200);
  }
};

async function getCurrentStatus(store) {
  const current = await store.get("current", { type: "json" });

  if (!current || !current.manual) {
    return { ok: true, manual: false };
  }

  if (current.expiresAt && Date.now() > current.expiresAt) {
    await store.delete("current");
    return { ok: true, manual: false };
  }

  return { ok: true, manual: true, status: current.status, expiresAt: current.expiresAt };
}

function json(data, statusCode = 200) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(data)
  };
}
