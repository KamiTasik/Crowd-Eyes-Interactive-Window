# Crowd Eyes — web interactive (Cargo)

Browser adaptation of Kamila Tasimenova’s AMT thesis crowd installation.

**A4 landscape drawing** (white background) with **six** eye animations behind the figures. Transparent socket cutouts in the drawing let the eye packs show through from underneath. Eyes stay closed until the visitor **holds** the trackpad/mouse or a key; release closes them.

Pack map (left→right): red-tinted pack 2 · pack 2 (green sockets on the tall man) · pack 1 · pack 3 (Lady, scaled/shifted) · pack 1 · blue-tinted pack 3. Hue variants live in `assets/packs/2r` and `assets/packs/3b`. Per-figure `fit` in `config.json` scales/shifts the plate inside each socket.

Same publish path as [Gaze-Interactive-Window](https://github.com/KamiTasik/Gaze-Interactive-Window): **GitHub Pages → iframe on Cargo**.

## Local test

```bash
cd Crowd-Eyes-Interactive-Window
python3 -m http.server 8766 --bind 127.0.0.1
```

Open http://127.0.0.1:8766  
Hold click/trackpad or any key to open eyes.

- Align sockets: `?debug=1`
- Force open (screenshot / check): `?open=1`

Tune positions in `config.json` (`cx` / `cy` / `width` / `height` are normalized 0–1 on the A4).

## Live

After Pages is on:  
https://kamitasik.github.io/Crowd-Eyes-Interactive-Window/

See **DEPLOY.md** for Cargo embed CSS.

## Layout

```text
index.html      Stage + hint
style.css       A4 letterbox; eyes under drawing
main.js         Hold interaction + frame swap
config.json     Six figures · pack mix · socket slots
assets/
  drawing.png   Crowd on white · transparent eye sockets
  packs/1|2|3/  00.jpg closed · 01.jpg open
```
