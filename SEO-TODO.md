# Roadmap SEO — davidotero.es

Estado: `[x]` hecho · `[~]` en curso · `[ ]` pendiente. Última revisión: 2026-09-27 (tarde).
Quién: **David** = paso externo (cuentas, terceros) · **Claude** = cambio de código/contenido en este repo.

## Bloqueo actual
- [ ] **Netlify sin créditos (2026-09-26):** los deploys de producción están pausados (el sitio sigue en línea con el commit `235a588`). Hasta resolverlo, **no hacer push a `main`**: cada push es un deploy. Opciones: esperar al siguiente ciclo de facturación, subir de plan o mover el hosting (p. ej. Cloudflare Pages). Cambios locales pendientes de publicar: regla `ignore` en `netlify.toml`, este roadmap.

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
- [x] **Rendimiento de servicios y blog** medido (2026-09-26): 97–99 en móvil, CLS 0. Contraste del gris secundario corregido (`--text-muted` `#64748b`→`#7a8aa0`) para llegar a accesibilidad 100.

## Siguiente (Claude)
- [x] **Textos de Proyectos** redactados con los datos de David (2026-09-26) y aplicados en local en `index.html`; se publican en el primer deploy del nuevo ciclo. Pendiente de David: cuando la web de Nika tenga la foto real del centro, hacer captura nueva (la actual de `images/projects/nika-*.webp` muestra el hueco "FOTO DEL CENTRO").
- [~] **Datos locales en el JSON-LD:** hecho `telephone` (+34 661 695 846) y `sameAs` con el enlace `share.google` de la ficha (local, sin publicar). `hasMap` opcional: requiere el enlace `maps.app.goo.gl` de la ficha.
- [x] **4º artículo nuevo** (2026-09-27, local sin publicar): "De un servidor a una arquitectura escalable en AWS" (`blog/arquitectura-web-escalable-en-aws.html`), con un stepper interactivo de 10 pasos (`js/infra-stepper.js`, genérico, dirigido por `data-*`) que anima un diagrama de arquitectura al estilo AWS. Primer `prefers-reduced-motion` del sitio y ARIA más completo que los tabs existentes. Lighthouse 99–100/100/100/100, CLS 0. Enlazado desde `servicios/cloud-aws/`, `servicios/consultoria-tech-lead/`, `blog/index.html`, `sitemap.xml` y `llms.txt`.
- [~] **Rediseño del mismo artículo, intento 1** (2026-09-27 tarde, local, ya revertido): 2 columnas + scroll-sync con el stepper interactivo. David lo vio y no le convenció el resultado ("el esquema se ve mal"); ver el intento 2, definitivo.
- [x] **Rediseño del mismo artículo, intento 2** (2026-09-27 noche, local, ya superado por el intento 3): se retira el stepper interactivo por completo (clics, scroll-sync, JS). 8 dibujos estáticos HTML/CSS/SVG (sin JS), acumulativos. David lo vio y siguió sin convencerle el resultado ("Sigue viendose mál los esquemas"); ver el intento 3, definitivo.
- [x] **Rediseño del mismo artículo, intento 3 — definitivo, imágenes reales** (2026-09-27 noche, local sin publicar): a petición de David, los 8 esquemas dejan de ser HTML/CSS en vivo y pasan a ser **imágenes PNG pre-renderizadas** (`images/diagrams/paso-{1,2,4,6,7,8,9,10}.png`), incrustadas con `<img>` (con `width`/`height` y `alt` descriptivo). Generadas con un script Node en el scratchpad (`gen-diagrams-v2.js`, no vive en el repo) que calcula las coordenadas de cada caja a mano (sin flexbox/grid del navegador, eliminando de raíz toda la familia de bugs de ancho ambiguo de los intentos anteriores) y reutiliza el mismo router de líneas ortogonales redondeadas ya probado, rasterizado a PNG con `sharp` + fontconfig (misma técnica de fuentes que las imágenes OG). Renderizadas a 1520px de ancho (2x de los ~760px que ocupa `.prose`) y con `png({palette:true})` para peso mínimo (6–28 KB por imagen). Se retira toda la CSS `.infra-diagram-static`/`.infra-static-*` (muerta) de `css/style.css`, manteniendo `.arch-node` (se sigue usando en `servicios/` y en otro artículo). CSS `?v=27` (bump en los 20 HTML del sitio). Verificado con Playwright (sin overflow horizontal en móvil/escritorio, las 8 imágenes cargan) y Lighthouse (móvil 99/100/100/100, escritorio 100/100/100/100, CLS 0).
  - **Lección real encontrada al generar las imágenes**: un conector entre dos filas no adyacentes (p. ej. App Réplica 1 → BD Réplica de lectura, dos filas más abajo) no debe decidir su salida por el eje dominante (dx vs dy) sin más — si dx domina, sale por el lateral a la altura de su propia fila, y esa altura es exactamente donde viven sus cajas hermanas (Réplica 2, Réplica 3), cruzándolas por el medio. Arreglado forzando salida vertical (arriba/abajo) siempre que la distancia vertical entre cajas supere un umbral de "misma fila" (~40px), sea cual sea dx; así el conector escapa de la fila por el hueco vacío entre filas antes de girar. Documentado también en memoria para reutilizar si se generan más diagramas.
- [x] **Bug real corregido** (2026-09-27, tras aviso de David de que "el esquema se ve mal"): las líneas del diagrama cortaban por encima de las cajas. Causa: `recomputeRects()` medía la geometría al cargar con la mayoría de cajas aún en su `transform: translateY(6px)` de reposo-oculto, dejando coordenadas ~6px desplazadas para siempre. Arreglado quitando ese transform del estado de reposo de `.infra-node` (CSS `?v=23`); verificado con los datos reales de los `<path>` y capturas en los pasos 1/6/9/10.
- [ ] **Más artículos** (1–2 al mes): "automatizar facturas con n8n", "migrar a Symfony"; enlazarlos con su servicio.
- [x] **Enlaces desde los artículos antiguos** hacia los 3 nuevos ("Sigue leyendo" y enlace contextual en el de n8n).
- [x] **`lastmod`:** `python3 scripts/update-sitemap.py` lo actualiza desde el último commit de cada página (ejecutar antes de hacer push si se cambian páginas).
- [~] **Cabeceras de seguridad:** añadida `Permissions-Policy`. Pendiente `Content-Security-Policy` (requiere revisar scripts en línea, GA, Formspree y CDNs; prioridad baja para SEO).
- [ ] **Prueba social** (`Review`/`AggregateRating`) cuando haya testimonios o reseñas reales.

## Pendiente de David
- [x] **Perfil de GitHub** (hecho por David):  nombre, bio, web y ubicación (`! gh auth refresh -h github.com -s user` o a mano en github.com/settings/profile); fijar (pin) repos.
- [x] **GA4** (hecho por David): enlazar Search Console, retención a 14 meses, definir tráfico interno, marcar conversión del formulario (pedírselo a Claude).
- [x] **Backlinks** (David dice haber hecho todo lo indicado; seguir la respuesta de cada uno): confirmar cuáles han respondido (footers Nika/Munttarpe/TuKomanda con el badge de `/badge/`; Malt, cámaras de comercio y asociaciones de Gipuzkoa); después Sortlist, Clutch, GoodFirms.
- [x] **Perfiles** (hecho por David): Dev.to, Hashnode, Medium (republicar artículos con enlace canónico a la web; Claude ayuda a adaptarlos).
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
