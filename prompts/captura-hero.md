# Prompt: capturas de la Hero Section para el portfolio

Pega este prompt en una sesión de Claude Code abierta en el repo del proyecto.
Sustituye `{PROYECTO}` y `{URL_PRODUCCION}` antes de enviarlo:

| Proyecto | `{PROYECTO}` | `{URL_PRODUCCION}` |
|---|---|---|
| Tukomanda | `tukomanda` | https://tukomanda.vercel.app/ |
| Nika Osasun Zentroa | `nika` | https://nika-osasun-zentroa.vercel.app/ |
| Munttarpe K.E. | `munttarpe` | https://munttarpe.vercel.app/ |

---

```
Necesito dos capturas de pantalla de la Hero Section de este proyecto en producción, para usarlas en mi portfolio personal.

URL: {URL_PRODUCCION}
Nombre base de los archivos: {PROYECTO}

## Qué capturar
Solo la Hero Section tal como se ve al cargar la página (above the fold, sin hacer scroll). Captura la URL de producción, no el servidor local.

## Capturas
1. Escritorio → `{PROYECTO}-desktop`
   - Viewport 1100×688 (proporción 16:10), deviceScaleFactor 1.5 (salida 1650×1032). No uses 1440 de ancho: en el portfolio se muestra a ~560 px y el texto no se lee.
2. Móvil → `{PROYECTO}-mobile`
   - Viewport 390×844, deviceScaleFactor 2 (salida 780×1688), isMobile y hasTouch activados, user agent de iPhone.

## Cómo
- Usa Playwright (instálalo en un directorio temporal si no está; no lo añadas como dependencia del proyecto).
- Antes de capturar: espera a `networkidle`, a `document.fonts.ready` y ~1,5 s extra para que terminen las animaciones de entrada de la Hero.
- Cierra banners de cookies (pulsa "Rechazar"), popups o avisos que tapen la Hero. Oculta las barras de scroll.
- Sin marcos, sombras ni mockups de dispositivo: el portfolio los añade con CSS. La imagen debe ser solo el contenido de la página.
- Si la Hero tiene un vídeo o carrusel, captura el primer fotograma/slide estable.

## Salida
- Guarda todo en `./portfolio-captures/` (créala; no la commitees ni la añadas al proyecto).
- Genera PNG y WebP (calidad ~85) de cada captura. Objetivo de peso del WebP: <150 KB escritorio, <120 KB móvil; baja la calidad si te pasas. No dejes imágenes mucho más grandes de lo indicado: el navegador las reduce mal y se ven ásperas.
- Nombres finales: `{PROYECTO}-desktop.webp` y `{PROYECTO}-mobile.webp` (más los `.png`).

## Al terminar
- Muéstrame las dos imágenes para validarlas visualmente.
- Lista ruta, dimensiones y peso de cada archivo.
- Dime la ruta absoluta de la carpeta para copiar los `.webp` a `portfolio/images/projects/`.
- No modifiques código del proyecto ni hagas commits.
```

---

## Dónde van los archivos en el portfolio

Copiar los `.webp` a `images/projects/` con estos nombres (ya referenciados en `index.html`):

- `tukomanda-desktop.webp`, `tukomanda-mobile.webp`
- `nika-desktop.webp`, `nika-mobile.webp`
- `munttarpe-desktop.webp`, `munttarpe-mobile.webp`

Mientras no existan, se muestra el placeholder "Captura pendiente".
