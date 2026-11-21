# Crowd Eyes — web interactive

Browser adaptation of the Crowd Eyes installation for Cargo / GitHub Pages.

Hold the trackpad, mouse, or a key to open the eyes; release to close.

## Local test

```bash
python3 -m http.server 8766 --bind 127.0.0.1
```

Open http://127.0.0.1:8766

- `?debug=1` — show socket outlines  
- `?open=1` — force eyes open (for screenshots)

Artwork and eye frames are placeholders until final assets are added under `assets/`.

## Live

https://kamitasik.github.io/Crowd-Eyes-Interactive-Window/

See **DEPLOY.md** for the Cargo embed.

## Layout

```text
index.html
style.css
main.js
config.json     figure slots (cx, cy, width, height)
assets/
  drawing.png   base drawing (transparent eye sockets)
  packs/1|2|3/  00.jpg closed · 01.jpg open
```
