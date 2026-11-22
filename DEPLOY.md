# Deploy Crowd Eyes to GitHub Pages + Cargo

Same workflow as **Gaze-Interactive-Window**.

## Part 1 — GitHub

1. Create a **public** repository named `Crowd-Eyes-Interactive-Window` (empty, no README).
2. Push this project’s files to `main` (GitHub Desktop or `git push`).

Repo: `https://github.com/KamiTasik/Crowd-Eyes-Interactive-Window`

## Part 2 — GitHub Pages

1. Repo → **Settings → Pages**
2. Source: Deploy from a branch
3. Branch: `main` → folder `/ (root)` → Save
4. Wait 1–3 minutes

**Live URL:**  
`https://kamitasik.github.io/Crowd-Eyes-Interactive-Window/`

Test:
- Desktop: hold Space → eyes open; release → close.
- Phone: press & hold on the drawing → eyes open; lift finger → close.

## Part 3 — Embed on Cargo

1. Open the Crowd Eyes page in Cargo  
2. **Code View** — paste:

```html
<iframe
  class="crowd-eyes-embed-frame"
  src="https://kamitasik.github.io/Crowd-Eyes-Interactive-Window/"
  title="Crowd Eyes — interactive drawing"
  loading="lazy"
></iframe>
```

3. Page CSS (your page id is `Q0080224726`):

```css
[id="Q0080224726"] bodycopy {
	
}

[id="Q0080224726"] .crowd-eyes-embed-frame {
  width: 100%;
  height: min(100dvh, calc(100vw / 1.41421356237 + 2.75rem));
  border: 0;
  display: block;
  overflow: hidden;
  background: #fff;
}

@media (max-width: 700px) {
  [id="Q0080224726"] .crowd-eyes-embed-frame {
    /* Fit the A4 drawing + short hint — no tall empty gap under page text */
    height: calc(100vw / 1.41421356237 + 2rem);
    max-height: 58vw;
  }
}
```

4. Publish Cargo and test on the live page. On a phone, tap inside the iframe, then press and hold.

## Part 4 — Later changes

1. Replace `assets/drawing.png` and `assets/packs/*/00.jpg` + `01.jpg`  
2. Tune slots in `config.json` (`?debug=1` helps)  
3. Commit → push → Pages updates in a minute or two  

## Notes

- Drawing is **A4 landscape**.  
- No camera — Space on desktop, finger-hold on phone.  
- GitHub Pages provides **HTTPS** for Cargo iframes.
