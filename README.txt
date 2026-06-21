MAXIMIZA TU EMPRESA - PORTAFOLIO FUTURISTA V2

Cómo abrir:
1. Descomprime el ZIP.
2. Abre index.html con doble clic.
3. Cada rectángulo abre una página diferente.

Cambios de esta versión:
- Página principal menos amontonada.
- Inicio conservado.
- Rectángulos futuristas conservados.
- Acerca de mí, portafolio, servicios, pagos, donaciones, Spotify, Facebook y contacto separados en páginas propias.
- Textos corregidos para sonar como una web real.
- Logo con N.
- WhatsApp configurado: 989562313.
- Correo configurado: zamirrojas1990@gmail.com.

Para cambiar la foto:
- Reemplaza assets/perfil-oscuro.svg por tu imagen.
- O coloca tu foto como assets/mi-foto.jpg y cambia el src en index.html.

Para Spotify/Facebook:
- En script.js cambia spotify y facebook por tus links reales.
- También puedes editar spotify.html y facebook.html.


=========================================
V3 - FASE 2.1 + FASE 2.2 + FASE 3 PREPARADA
=========================================

NUEVO:
- Estado dinámico en el panel de la N.
- Página estado.html para cambiar estado manualmente en el navegador.
- Horario automático:
  09:00 - 18:30: En oficina.
  19:30 - 21:30: En gimnasio.
  22:30 - 07:30: Descansando.
- Widget Spotify integrado junto al panel de la N.
- Página spotify.html mejorada.
- Netlify Function preparada:
  netlify/functions/spotify-now-playing.js
- Configuración Netlify:
  netlify.toml

IMPORTANTE:
- La web funciona sin Spotify configurado.
- Para Spotify real, configura variables de entorno en Netlify.
- No publiques tokens dentro de archivos HTML/CSS/JS.

PRÓXIMO PASO:
Configurar Spotify Developer y guardar las variables en Netlify.


=========================================
V4 - ADMIN PRIVADO
=========================================

NUEVO:
- admin.html con login breve.
- Se quitó el botón público para cambiar estado.
- estado.html redirige a admin.html.
- netlify/functions/status.js guarda estado global.
- Variable necesaria en Netlify: ADMIN_PASSWORD.
- Dependencia: @netlify/blobs.

Siguiente fase:
- Configurar variables reales en Netlify.
- Probar función status.
- Configurar Spotify Developer.
- Añadir variables de Spotify.
- Conectar dominio final.


V6 FIREBASE:
- Login admin con Firebase Authentication.
- Panel editable para datos principales, contacto, redes, imagen, estado, servicios y pagos.
- Firestore guarda el contenido editable.
- Storage permite subir imagen principal.
- Correo público actualizado a maximizatuempresas@gmail.com.
- No requiere ADMIN_PASSWORD de Netlify para el login.
