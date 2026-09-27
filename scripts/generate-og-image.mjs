#!/usr/bin/env node
/**
 * Genera una imagen Open Graph (1200x630) con el estilo del sitio, a partir de
 * un título, una etiqueta y un slug de salida.
 *
 * Uso:
 *   node scripts/generate-og-image.mjs \
 *     --slug arquitectura-web-escalable-en-aws \
 *     --tag "Cloud y AWS" \
 *     --title "De un servidor a una arquitectura escalable en AWS" \
 *     [--subtitle "10 pasos, de un servidor a un sistema maduro"]
 *
 * Requiere `sharp` instalado (no se añade a package.json del sitio: instálalo
 * puntualmente con `npm i sharp` en un directorio de trabajo, nunca en el
 * propio repo publicado).
 *
 * Nota sobre las fuentes: las TTF de Google Fonts se descargan a un directorio
 * temporal en cada ejecución (no se commitean). No sirve pedirlas con curl y
 * un user-agent normal: la API css2 devuelve WOFF2 variable, y algunos
 * decodificadores de WOFF2 (p. ej. wawoff2) generan un `cmap` que fontconfig
 * no sabe leer, así que el texto sale como glifos ".notdef" (cajas con el
 * código hex). La solución que funciona de verdad es pedir la fuente con un
 * user-agent de Android antiguo (Android 4.1 / WebKit): la API legacy
 * `css?family=` responde entonces con un TTF estático real, sin variable
 * font y sin EOT. Fontconfig, además, puede reportar el `family` real de
 * ese TTF con un nombre inesperado (p. ej. "Space Grotesk Light" en vez de
 * "Space Grotesk" para el peso 700): usa siempre el nombre que devuelva
 * `fc-scan`, no el nombre comercial de la fuente.
 */
import { execSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, arr) => {
    if (a.startsWith('--')) acc.push([a.slice(2), arr[i + 1]]);
    return acc;
  }, [])
);

const { slug, tag, title, subtitle = 'davidotero.es' } = args;
if (!slug || !tag || !title) {
  console.error('Uso: --slug <slug> --tag "<Etiqueta>" --title "<Título>" [--subtitle "<pie>"]');
  process.exit(1);
}

const ANDROID_UA = 'Mozilla/5.0 (Linux; U; Android 4.1; en-us) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Safari/534.30';

const work = mkdtempSync(join(tmpdir(), 'og-fonts-'));

function fetchTtf(cssFamilyQuery, outFile) {
  const css = execSync(
    `curl -s -A "${ANDROID_UA}" "https://fonts.googleapis.com/css?family=${encodeURIComponent(cssFamilyQuery)}"`
  ).toString();
  const m = css.match(/https:\/\/fonts\.gstatic\.com\/[^)]*\.ttf/);
  if (!m) throw new Error(`No se encontró TTF para "${cssFamilyQuery}". Respuesta: ${css.slice(0, 200)}`);
  execSync(`curl -s -A "${ANDROID_UA}" -o "${outFile}" "${m[0]}"`);
}

fetchTtf('Space Grotesk:700', join(work, 'sg700.ttf'));
fetchTtf('Inter:400', join(work, 'inter.ttf'));

writeFileSync(
  join(work, 'fonts.conf'),
  `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><dir>${work}</dir><cachedir>${work}/cache</cachedir></fontconfig>`
);

const headFamily = execSync(
  `FONTCONFIG_FILE="${join(work, 'fonts.conf')}" fc-scan --format '%{family[0]}' "${join(work, 'sg700.ttf')}"`
).toString().trim();
const bodyFamily = execSync(
  `FONTCONFIG_FILE="${join(work, 'fonts.conf')}" fc-scan --format '%{family[0]}' "${join(work, 'inter.ttf')}"`
).toString().trim();

function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
function wrap(t, max) {
  const words = t.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) { lines.push(cur); cur = w; }
    else cur = (cur + ' ' + w).trim();
  }
  lines.push(cur);
  return lines;
}

const lines = wrap(title, 28);
const titleY0 = 300 - (lines.length - 1) * 34;
const tspans = lines.map((l, i) =>
  `<text x="80" y="${titleY0 + i * 68}" font-family="${headFamily}" font-weight="700" font-size="58" fill="#e2e8f0">${esc(l)}</text>`
).join('');
const tagUpper = tag.toUpperCase();
const tw = tagUpper.length * 15 + 48;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0c0c0f"/>
  <rect width="14" height="630" fill="#3a7a58"/>
  <text x="80" y="98" font-family="${headFamily}" font-weight="700" font-size="28" fill="#6ec4a0">David Otero</text>
  <rect x="${1120 - tw}" y="64" width="${tw}" height="48" rx="24" fill="none" stroke="#3a7a58" stroke-width="2"/>
  <text x="${1120 - tw / 2}" y="96" text-anchor="middle" font-family="${headFamily}" font-weight="700" font-size="22" fill="#6ec4a0" letter-spacing="1">${esc(tagUpper)}</text>
  ${tspans}
  <text x="80" y="560" font-family="${headFamily}" font-weight="700" font-size="26" fill="#e2e8f0">davidotero.es</text>
  <text x="1120" y="560" text-anchor="end" font-family="${bodyFamily}" font-size="24" fill="#94a3b8">${esc(subtitle)}</text>
</svg>`;

const { default: sharp } = await import('sharp');
const outPath = new URL(`../images/og/${slug}.png`, import.meta.url).pathname;
process.env.FONTCONFIG_FILE = join(work, 'fonts.conf');
await sharp(Buffer.from(svg)).png().toFile(outPath);
rmSync(work, { recursive: true, force: true });
console.log('Imagen OG generada en', outPath);
