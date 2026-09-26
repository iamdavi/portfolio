#!/usr/bin/env python3
"""Actualiza <lastmod> de sitemap.xml con la fecha del último commit de cada página.

Uso: python3 scripts/update-sitemap.py
"""
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://davidotero.es/"
sitemap = ROOT / "sitemap.xml"


def source_file(url: str) -> Path:
    path = url[len(SITE):]
    if path == "" or path.endswith("/"):
        path += "index.html"
    return ROOT / path


def last_commit_date(file: Path) -> str | None:
    out = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "--", str(file)],
        cwd=ROOT, capture_output=True, text=True,
    ).stdout.strip()
    return out or None


def replace(match: re.Match) -> str:
    block = match.group(0)
    url = re.search(r"<loc>([^<]+)</loc>", block).group(1)
    date = last_commit_date(source_file(url))
    if not date:
        return block
    return re.sub(r"<lastmod>[^<]*</lastmod>", f"<lastmod>{date}</lastmod>", block)


text = sitemap.read_text(encoding="utf-8")
new = re.sub(r"<url>.*?</url>", replace, text, flags=re.S)
if new != text:
    sitemap.write_text(new, encoding="utf-8")
    print("sitemap.xml actualizado")
else:
    print("sitemap.xml ya estaba al día")
