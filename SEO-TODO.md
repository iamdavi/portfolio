# Roadmap SEO — davidotero.es

Estado: `[x]` hecho · `[~]` en curso · `[ ]` pendiente. Última revisión: 2026-09-26.
Quién: **David** = paso externo (cuentas, terceros) · **Claude** = cambio de código/contenido en este repo.

## Hecho
- [x] Cambios SEO en `main` y desplegados (H1 con keyword, interlinking servicios↔blog, breadcrumb, sitemap sin `changefreq`/`priority`).
- [x] Google Search Console (dominio, DNS), sitemap enviado e indexación solicitada, incluidos los 3 artículos nuevos.
- [x] Bing Webmaster Tools (importado) + IndexNow (clave en la raíz, `scripts/indexnow.sh`, workflow `.github/workflows/indexnow.yml` que avisa tras cada push con cambios en `.html`/`sitemap.xml`).
- [x] Google Business Profile creada y verificada: descripción, servicios, logo, portada y fotos (paquete en `~/gbp-fotos/`).
- [x] GA4 (`G-H70S4NSV2Y`) tras consentimiento, verificado en Tiempo real. Botones Aceptar/Rechazar con el mismo peso (AEPD).
- [x] LinkedIn: titular, URL `/in/david-otero-mato/`, extracto, 3 destacados.
- [x] GitHub: README de perfil (`iamdavi/iamdavi`), descripción y homepage de `portfolio` y `munttarpe`.
- [x] Archivos internos (`SEO-TODO.md`, `scripts/`, `prompts/`, `.github/`) ocultos con 404 en Netlify.
- [x] 3 artículos nuevos publicados: cuánto cuesta una web a medida, n8n vs Make vs Zapier, desplegar PHP en AWS.
- [x] Reseñas de la ficha de Google pedidas, footers de proyectos y directorios solicitados (David, 2026-09-26; a la espera de respuesta).

## En curso (Claude)
- [x] **Rendimiento de la home** (2026-09-26, Lighthouse en producción): móvil 85→95, escritorio 98→100, CLS 0,237→0,001, peso 353→151 KiB. Fuentes propias en `/fonts` con preload, iconos `lucide` en SVG en línea, sin Google Fonts ni unpkg.
- [ ] **Rendimiento del resto de páginas** (servicios y blog): medir con Lighthouse y decidir si merece la pena cargar `particles.js` solo en escritorio. Móvil: LCP 2,3 s, margen escaso frente al límite de 2,5 s.

## Siguiente (Claude)
- [ ] **Textos de relleno en Proyectos:** las 3 descripciones (TuKomanda, Nika, Munttarpe) siguen con "Añade aquí una descripción algo más larga…" en producción (`index.html`, sección Proyectos). Claude redacta borradores a partir de los repos y capturas; David los revisa antes de publicar.
- [ ] **Datos locales en el JSON-LD:** `telephone`, `hasMap` y `sameAs` de la ficha. Necesita de David: teléfono público y URL de la ficha en Maps.
- [ ] **Más artículos** (1–2 al mes): "automatizar facturas con n8n", "migrar a Symfony"; enlazarlos con su servicio.
- [ ] **Enlaces desde los artículos antiguos** hacia los 3 nuevos (interlinking).
- [ ] **`lastmod` automático** en el sitemap desde el último commit de cada archivo.
- [ ] **Cabeceras de seguridad** en `netlify.toml` (CSP, Permissions-Policy). Prioridad baja para SEO.
- [ ] **Prueba social** (`Review`/`AggregateRating`) cuando haya testimonios o reseñas reales.

## Pendiente de David
- [ ] **Perfil de GitHub:** nombre, bio, web y ubicación (`! gh auth refresh -h github.com -s user` o a mano en github.com/settings/profile); fijar (pin) repos.
- [ ] **GA4:** enlazar Search Console, retención a 14 meses, definir tráfico interno, marcar conversión del formulario (pedírselo a Claude).
- [ ] **Backlinks:** confirmar cuáles han respondido (footers Nika/Munttarpe/TuKomanda con el badge de `/badge/`; Malt, cámaras de comercio y asociaciones de Gipuzkoa); después Sortlist, Clutch, GoodFirms.
- [ ] **Perfiles:** Dev.to, Hashnode, Medium (republicar artículos con enlace canónico a la web; Claude ayuda a adaptarlos).
- [ ] **Foto de perfil profesional** de mayor resolución (la actual mide 400×400) para web y ficha.
- [ ] **Correo profesional** `@davidotero.es` (Workspace o reenvío gratuito) + MX/SPF/DKIM/DMARC en Netlify DNS; después Claude sustituye `itsdavid.otero@gmail.com` en la web.
- [ ] **Analítica (paso 6, aplazado por David):** GA4 ya funciona; los ajustes de GA4 de arriba siguen pendientes.
- [ ] **LinkedIn (aparcado):** Servicios, Proyectos, recomendaciones y publicar contenido; compartir cada artículo nuevo.

## Continuo
- [ ] Revisión mensual en Search Console: consultas con impresiones y pocos clics (mejorar `title`), páginas no indexadas, Core Web Vitals.
- [ ] Revisar reseñas y publicar en la ficha de Google una entrada al mes.
- [ ] Actualizar artículos cuando cambie algo (MCP evoluciona rápido) y actualizar `dateModified` en el JSON-LD.
- [ ] (Opcional) Versión en inglés `/en/` con `hreflang`, solo si se buscan clientes internacionales.

## Expectativas
- Búsquedas de marca ("David Otero Mato"): semanas.
- Servicio + ciudad ("desarrollador fullstack freelance Donostia"): 3–6 meses; dependen sobre todo de reseñas, backlinks y contenido.
- Genéricas ("desarrollador fullstack"): muy competidas, no perseguirlas al principio.
