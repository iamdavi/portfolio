# SEO — lista de tareas

Estado: `[x]` hecho · `[~]` parcial · `[ ]` pendiente. Última revisión: 2026-09-26.

## 0. Antes de nada
- [x] Cambios SEO llevados a `main` y desplegados en Netlify (2026-09-26).

## Esta semana (mayor impacto, poco esfuerzo)
- [~] 1. Alta en **Google Search Console** (propiedad de dominio, DNS) y sitemap enviado: hecho (2026-09-26; el sitemap debería pasar a "Correcto" con 13 páginas en 1–2 días). **Bing Webmaster Tools** importado (alimenta a ChatGPT y Copilot). IndexNow: clave, `scripts/indexnow.sh` y workflow `.github/workflows/indexnow.yml` creados; pendiente desplegar y comprobar.
- [x] 2. Solicitar indexación (Inspección de URL) de la home, los 6 servicios, `/servicios/`, `/blog/` y los 4 artículos.
- [~] 3. **Google Business Profile** creada y verificada (2026-09-26). Pendiente completar: descripción, servicios, categorías secundarias, horario real, área de servicio ampliada, logo/fotos, primeras reseñas. Original: crear **Google Business Profile** ("negocio de servicios", Donostia; área: Gipuzkoa/País Vasco/España; categoría, descripción, enlace a `/servicios/`, fotos).
- [ ] 4. Completar **LinkedIn**: enlace a la web, mismo titular y palabras clave, publicar contenido.
- [x] 5. H1 de la home con keyword (oculto visualmente con `.sr-only`; opcional: hacerlo visible como subtítulo).
- [ ] 6. **Analítica** respetuosa (Plausible/Umami) o GA4 tras el consentimiento de cookies existente.

## Este mes
- [ ] 7. **Enlaces de calidad**
  - [ ] GitHub: README del perfil y repos enlazando a la web
  - [ ] Nika, Munttarpe, TuKomanda: enlace "Desarrollado por David Otero" en sus footers (usar `/badge/`)
  - [ ] Directorios: Malt, Workana, Sortlist, Clutch, GoodFirms, cámaras de comercio y asociaciones de Gipuzkoa
  - [ ] Perfiles: Dev.to, Hashnode, Medium, Stack Overflow
- [ ] 8. **1–2 artículos al mes** con intención de búsqueda real: "cuánto cuesta una web a medida", "n8n vs Make vs Zapier", "automatizar facturas con n8n", "desplegar PHP en AWS", "migrar a Symfony". Enlazarlos entre sí y con su servicio. (Un artículo sobre AWS también rellenaría el hueco de `cloud-aws`.)
- [~] 9. **Interlinking**: hecho — cada artículo tiene "Sigue leyendo" y 5 servicios tienen "Artículos relacionados". Pendiente: `cloud-aws` (no hay artículo) y texto ancla descriptivo dentro del cuerpo de los artículos.
- [ ] 10. **Rendimiento**
  - [ ] Auditar/quitar pesos de fuentes que no se usen (Fraunces y Karla sí se usan, en logos SVG inline de la home)
  - [ ] Alojar fuentes en local con `font-display: swap`
  - [ ] `particles.js` y `lucide`: `defer`, solo en desktop, o sustituir por SVG
  - [ ] Medir con PageSpeed Insights (objetivo LCP < 2,5 s) — la home pesa ~82 KB de HTML
- [~] 11. **`lastmod` real**: quitados `changefreq`/`priority`; `lastmod` coincide hoy con git. Pendiente: automatizarlo desde el último commit de cada archivo.
- [x] 12. `BreadcrumbList` y `FAQPage` en servicios (ya estaban; añadido el breadcrumb que faltaba en el artículo de vibe coding).
- [ ] 13. **Prueba social**: testimonios con nombre, casos de estudio con resultados; `Review`/`AggregateRating` solo con reseñas reales.
- [ ] 14b. **`ProfessionalService`/`LocalBusiness`**: añadir `telephone`, `priceRange`, `hasMap` (URL de la ficha de Google) y `sameAs` al perfil de negocio cuando existan. Requiere datos tuyos.
- [ ] 14d. **Correo profesional** `@davidotero.es` (Workspace, o reenvío gratis con Cloudflare/ImprovMX) + MX/SPF/DKIM/DMARC en Netlify DNS; luego sustituir `itsdavid.otero@gmail.com` en la web, JSON-LD y políticas.
- [ ] 14c. **Cabeceras** en `netlify.toml`: `Content-Security-Policy` y `Permissions-Policy` (prioridad baja para SEO).

## Continuo
- [ ] 14. Revisión mensual de Search Console: consultas con impresiones y pocos clics (mejorar `title`), páginas no indexadas, Core Web Vitals.
- [ ] 15. Actualizar artículos cuando cambie algo (MCP evoluciona rápido) y actualizar `dateModified` en el JSON-LD.
- [ ] 16. Compartir cada artículo en LinkedIn y comunidades técnicas.
- [ ] 17. (Opcional) Versión en inglés `/en/` con `hreflang`, solo si buscas clientes internacionales.

## Expectativas
- Búsquedas de marca ("David Otero Mato"): semanas.
- Servicio + ciudad ("desarrollador fullstack freelance Donostia"): 3–6 meses; dependen sobre todo de 3, 7 y 8.
- Genéricas ("desarrollador fullstack"): muy competidas, no perseguirlas al principio.
