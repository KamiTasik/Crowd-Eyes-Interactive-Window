# Deploy Crowd Eyes to GitHub Pages + Cargo

Same workflow as **Gaze-Interactive-Window**.

## Part 1 — Put the project on GitHub

### 1. Create the repo (once)
On github.com as **KamiTasik**:
- **New repository**
- Name: `Crowd-Eyes-Interactive-Window`
- **Public**
- **Do not** add README / .gitignore / license (empty repo)
- Create

### 2. Push this folder (GitHub Desktop or Terminal)

**GitHub Desktop**
1. File → Add Local Repository → this folder  
2. Publish repository → name `Crowd-Eyes-Interactive-Window` → Public  

**Terminal** (from this folder):

```bash
cd /path/to/Crowd-Eyes-Interactive-Window
git init
git add .
git commit -m "Crowd Eyes web adaptation for Cargo"
git branch -M main
git remote add origin https://github.com/KamiTasik/Crowd-Eyes-Interactive-Window.git
git push -u origin main
```

Live code: `https://github.com/KamiTasik/Crowd-Eyes-Interactive-Window`

---

## Part 2 — GitHub Pages

1. Repo → **Settings → Pages**
2. Source: Deploy from a branch
3. Branch: `main` → folder `/ (root)` → Save
4. Wait 1–3 minutes

**Live URL:**  
`https://kamitasik.github.io/Crowd-Eyes-Interactive-Window/`

Test: hold trackpad or a key → three eyes open on the drawing; release → close.

---

## Part 3 — Embed on Cargo

1. Cargo → your site → create/open the **Crowd Eyes** (or thesis) page  
2. **Code View** — paste:

```html
<iframe
  class="crowd-eyes-embed-frame"
  src="https://kamitasik.github.io/Crowd-Eyes-Interactive-Window/"
  title="Crowd Eyes — interactive drawing"
  loading="lazy"
></iframe>
```

3. Page CSS (replace `PAGE_ID` with your Cargo page id, same pattern as Gaze `Y2083321124`):

```css
[id="PAGE_ID"] .crowd-eyes-embed-frame {
  width: 100%;
  height: 100vh;
  height: 100dvh;
  border: 0;
  display: block;
  overflow: hidden;
  background: #000;
}
```

4. Publish Cargo → test on the **live** page (not only the editor).

---

## Part 4 — Later changes

1. Edit files locally  
2. Test: `python3 -m http.server 8080` in this folder  
3. Commit → push  
4. Pages updates in ~1–2 minutes (hard-refresh Cargo)

### Tune eye alignment

Edit `config.json` → each figure’s `cx`, `cy`, `width`, `height` (0–1 of the A4 drawing).  
Open with `?debug=1` to show slot outlines while tuning.

---

## Notes

- Drawing is **A4 landscape** (same aspect as the PNG).  
- Only **Man / Boy / Woman** have animated eyes for now; other figures stay painted shut.  
- No camera on this page — hold interaction only (portfolio-friendly).  
- GitHub Pages gives **HTTPS**, which Cargo iframes need.
