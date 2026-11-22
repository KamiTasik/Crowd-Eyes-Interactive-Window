# Crowd Eyes — web interactive

Browser adaptation of the Crowd Eyes installation for Cargo / GitHub Pages.

Desktop: hold **Space** to open the eyes; release to close.  
Phone: **press and hold** on the screen; lift to close.

The A4 drawing PNG is used **as provided** (your eye cutouts are not modified). Eye frames are copied into packs unchanged. `config.json` only stores alignment-window coordinates for placement.

## Local test

```bash
python3 -m http.server 8766 --bind 127.0.0.1
```

Open http://127.0.0.1:8766

- `?debug=1` — show placement windows  
- `?open=1` — force eyes open

## Pack map (left → right)

| Figure | Pack |
|--------|------|
| 1 | `woman` (slot slightly tighter so sides stay inside the face) |
| 2 Man | `man` |
| 3 | `boy` |
| 4 Woman | `woman` |
| 5 Boy | `boy` |
| 6 | `man` |

## Live

https://kamitasik.github.io/Crowd-Eyes-Interactive-Window/

**Important:** the live page is served from the GitHub repo  
`KamiTasik/Crowd-Eyes-Interactive-Window` (branch `main`).  
Editing `config.json` only in Cursor / another clone does nothing on that URL until you **commit and push to that GitHub repo**. Then hard-refresh (`Cmd+Shift+R`) or open with `?open=1&t=1`.

See **DEPLOY.md** for the Cargo embed.
