#!/usr/bin/env python3
"""Flatten drawing onto white and punch elliptical socket cutouts from config + eye seeds."""

from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ORIG = ROOT / "assets" / "drawing-original.png"
OUT = ROOT / "assets" / "drawing.png"
CFG = ROOT / "config.json"

# Per-figure left/right eye centers (normalized) and ellipse size
EYES = {
    "left": {"pair": [(0.1026, 0.1234), (0.1437, 0.1246)], "ew": 0.028, "eh": 0.022},
    "man": {"pair": [(0.3126, 0.0938), (0.3532, 0.0913)], "ew": 0.028, "eh": 0.022},
    "mid": {"pair": [(0.3960, 0.1833), (0.4361, 0.1784)], "ew": 0.027, "eh": 0.021},
    "woman": {"pair": [(0.5691, 0.1839), (0.6050, 0.1790)], "ew": 0.026, "eh": 0.020},
    "boy": {"pair": [(0.7111, 0.2450), (0.7453, 0.2444)], "ew": 0.026, "eh": 0.022},
    "right": {"pair": [(0.8385, 0.1512), (0.8761, 0.1524)], "ew": 0.028, "eh": 0.022},
}


def main() -> None:
    if not ORIG.exists():
        raise SystemExit(f"Missing {ORIG} — keep a copy of the uncut drawing there.")
    cfg = json.loads(CFG.read_text())
    src = Image.open(ORIG).convert("RGBA")
    w, h = src.size
    mask = Image.new("L", (w, h), 255)
    md = ImageDraw.Draw(mask)
    figures = []
    for fig in cfg["figures"]:
        meta = EYES[fig["id"]]
        boxes = []
        for cx, cy in meta["pair"]:
            ew, eh = meta["ew"] * w, meta["eh"] * h
            box = [cx * w - ew / 2, cy * h - eh / 2, cx * w + ew / 2, cy * h + eh / 2]
            md.ellipse(box, fill=0)
            boxes.append(box)
        left = min(b[0] for b in boxes)
        top = min(b[1] for b in boxes)
        right = max(b[2] for b in boxes)
        bot = max(b[3] for b in boxes)
        pad_x = (right - left) * 0.10
        pad_y = (bot - top) * 0.22
        left -= pad_x
        right += pad_x
        top -= pad_y
        bot += pad_y
        figures.append(
            {
                **{k: fig[k] for k in ("id", "pack", "label")},
                "cx": round(((left + right) / 2) / w, 4),
                "cy": round(((top + bot) / 2) / h, 4),
                "width": round((right - left) / w, 4),
                "height": round(max((bot - top) / h, 0.034), 4),
            }
        )
    mask = ImageOps.invert(ImageOps.invert(mask).filter(ImageFilter.GaussianBlur(1.8)))
    white = Image.new("RGBA", (w, h), (255, 255, 255, 255))
    flat = Image.alpha_composite(white, src)
    r, g, b, _ = flat.split()
    Image.merge("RGBA", (r, g, b, mask)).save(OUT, optimize=True)
    cfg["figures"] = figures
    CFG.write_text(json.dumps(cfg, indent=2) + "\n")
    print(f"wrote {OUT} and updated slots in {CFG}")


if __name__ == "__main__":
    main()
