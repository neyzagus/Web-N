// Netlify Function: spotify-now-playing
// Variables requeridas en Netlify:
// SPOTIFY_CLIENT_ID
// SPOTIFY_CLIENT_SECRET
// SPOTIFY_REFRESH_TOKEN

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";

exports.handler = async function () {
  try {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
      return json({
        configured: false,
        isPlaying: false,
        title: "Spotify pendiente",
        artist: "Faltan variables de entorno en Netlify.",
        url: "spotify.html"
      }, 200);
    }

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const tokenResponse = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken
      })
    });

    if (!tokenResponse.ok) {
      return json({
        configured: true,
        isPlaying: false,
        title: "Spotify sin conexión",
        artist: "No se pudo renovar el access token.",
        url: "spotify.html"
      }, 200);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    const nowPlayingResponse = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
    });

    if (nowPlayingResponse.status === 204 || nowPlayingResponse.status === 202) {
      return json({
        configured: true,
        isPlaying: false,
        title: "No estoy escuchando música ahora",
        artist: "Spotify está inactivo en este momento.",
        url: "spotify.html"
      }, 200);
    }

    if (!nowPlayingResponse.ok) {
      return json({
        configured: true,
        isPlaying: false,
        title: "Spotify no disponible",
        artist: "No se pudo obtener la canción actual.",
        url: "spotify.html"
      }, 200);
    }

    const song = await nowPlayingResponse.json();
    const item = song.item;

    if (!item) {
      return json({
        configured: true,
        isPlaying: false,
        title: "Spotify sin canción activa",
        artist: "No hay información disponible.",
        url: "spotify.html"
      }, 200);
    }

    return json({
      configured: true,
      isPlaying: Boolean(song.is_playing),
      title: item.name,
      artist: item.artists?.map((artist) => artist.name).join(", ") || "Artista desconocido",
      album: item.album?.name || "",
      albumImageUrl: item.album?.images?.[0]?.url || "",
      url: item.external_urls?.spotify || "spotify.html",
      progressMs: song.progress_ms || 0,
      durationMs: item.duration_ms || 0
    }, 200);

  } catch (error) {
    return json({
      configured: false,
      isPlaying: false,
      title: "Spotify pendiente",
      artist: "La función aún no está configurada o está en modo local.",
      url: "spotify.html"
    }, 200);
  }
};

function json(data, statusCode = 200) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=25, stale-while-revalidate=60",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(data)
  };
}
