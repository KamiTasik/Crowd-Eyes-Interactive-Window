# Crowd Eyes — web interactive (Cargo)

Browser adaptation of Kamila Tasimenova’s AMT thesis crowd installation.

**A4 landscape drawing** with three eye animations (Man, Boy, Woman) aligned to the painted sockets. Eyes stay closed until the visitor **holds** the trackpad/mouse or a key; release closes them.

Same publish path as [Gaze-Interactive-Window](https://github.com/KamiTasik/Gaze-Interactive-Window): **GitHub Pages → iframe on Cargo**.

## Local test

```bash
cd Crowd-Eyes-Interactive-Window
python3 -m http.server 8080
```

Open http://127.0.0.1:8080  
Hold click/trackpad or any key to open eyes.

Tune sockets: http://127.0.0.1:8080/?debug=1 and edit `config.json`.

## Live

After Pages is on:  
https://kamitasik.github.io/Crowd-Eyes-Interactive-Window/

See **DEPLOY.md** for Cargo embed CSS.

## Layout

```text
index.html      Stage + hint
style.css       A4 letterbox layout
main.js         Hold interaction + frame swap
config.json     Per-figure cx/cy/width/height (normalized)
assets/
  drawing.png   Full crowd drawing (A4 landscape)
  packs/1|2|3/  00.jpg closed · 01.jpg open
```
