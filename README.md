# Crowd Eyes — web interactive

Browser adaptation of the Crowd Eyes installation for Cargo / GitHub Pages.

Hold the trackpad, mouse, or a key to open the eyes; release to close.

## Local test

```bash
python3 -m http.server 8766 --bind 127.0.0.1
```

Open http://127.0.0.1:8766

- `?debug=1` — show eye-window outlines  
- `?open=1` — force eyes open (for screenshots)

## Eye packs

Left → right figures:

| Figure | Pack | Source |
|--------|------|--------|
| 1 | `fig1` | Woman sequence, tighter side crop |
| 2 | `fig2` | Man sequence |
| 3 | `fig3` | Boy sequence (`eyesboy_02`…`09`) |
| 4 | `fig4` | Woman sequence |
| 5 | `fig5` | Boy sequence |
| 6 | `fig6` | Man sequence |

Each pack is a full-A4 frame sequence (`00.jpg` closed → last open). Eyes are placed in the alignment windows under `assets/drawing.png` (transparent sockets).

## Live

https://kamitasik.github.io/Crowd-Eyes-Interactive-Window/

See **DEPLOY.md** for the Cargo embed.

## Layout

```text
index.html
style.css
main.js
config.json
assets/
  drawing.png
  packs/fig1…fig6/   00.jpg … NN.jpg
```
