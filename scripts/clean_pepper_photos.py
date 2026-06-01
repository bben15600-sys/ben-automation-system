"""Remove the on-photo Hebrew label from each grandpa pepper photo.

Strategy:
  1) Tesseract image_to_data → word bounding boxes (where it sees text).
  2) Color-based detection of large dark/light text blobs in the top/bottom
     fifth (catches photos OCR misses).
  3) Dilate combined mask, run cv2.inpaint to fill the masked regions.

Output goes to assets/pepper-photos-clean/<original-filename>.

After running this, build_grandpa_stickers.py can be pointed at the
cleaned folder for sticker generation without the duplicate text.
"""
from __future__ import annotations

import sys
from pathlib import Path

import cv2
import numpy as np
import pytesseract

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "assets" / "pepper-photos"
DST = REPO / "assets" / "pepper-photos-clean"

# Hardcoded text-region rectangles per photo, as fractions of image dims:
# (x0, y0, x1, y1) — all in [0, 1]. Values cover the visible Hebrew label
# (and any small margin) without overlapping the pepper subject. Identified
# from a direct visual inspection of each file.
TEXT_REGIONS: dict[str, tuple[float, float, float, float]] = {
    "07cc495a-d456-4f56-8d4e-1b0ac62fd861.jpeg": (0.00, 0.00, 0.45, 0.15),
    "0fc2ba22-d6e8-4d9e-b9b4-53e6967ecb7f.jpeg": (0.60, 0.00, 1.00, 0.25),
    "1a044bea-7b16-42ce-aadb-980ba7ef9f55.jpeg": (0.60, 0.00, 1.00, 0.35),
    "28046bf4-8588-467c-846a-5f2161a07705.jpeg": (0.25, 0.00, 0.85, 0.15),
    "42fbf3e4-ea24-4458-9469-30b1210f3ab5.jpeg": (0.20, 0.00, 0.85, 0.30),
    "450f15a9-15ac-4b3e-8422-86cd8a163345.jpeg": (0.55, 0.00, 1.00, 0.30),
    "48444c0b-83b9-4aba-bedf-4f4049e71216.jpeg": (0.20, 0.00, 0.70, 0.30),
    "4fb120bb-9f56-4505-ab20-8114085aba09.jpeg": (0.20, 0.00, 0.85, 0.13),
    "6620ac26-4195-42b5-b061-95d36373a792.jpeg": (0.60, 0.00, 1.00, 0.20),
    "693253d2-e93c-4f83-b881-2fffddbdf6b7.jpeg": (0.00, 0.00, 0.60, 0.30),
    "69a42848-1e6b-4ac4-93f4-403ec6d95d0d.jpeg": (0.00, 0.00, 0.50, 0.20),
    "6bf108e4-be02-4762-8ef5-994ac0a1efe0.jpeg": (0.20, 0.80, 0.70, 1.00),
    "7aa06236-8d85-42ca-8652-fd85d7860fe8.jpeg": (0.55, 0.00, 1.00, 0.30),
    "7b8e0dd2-f6ab-45a1-82f0-72f35d669928.jpeg": (0.30, 0.00, 0.75, 0.12),
    "9beb8127-e55a-45a0-930b-da296337f4b7.jpeg": (0.50, 0.00, 1.00, 0.30),
    "9cd43c69-0178-41db-b7c9-144542423776.jpeg": (0.40, 0.05, 0.85, 0.25),
    "a0b98327-eea0-47d1-b12c-9ee371520107.jpeg": (0.20, 0.75, 0.80, 1.00),
    # NOTE: a2487a88 is the Facebook screenshot. Facebook UI bars get cropped
    # by build_grandpa_stickers.py before sticker composition (top 21%, bottom
    # 10%). The text "פתאלי גורמה אדום" sits in the right-upper area of the
    # *cropped* photo, so the region here is relative to the cropped frame:
    "a2487a88-015b-4bc6-9fef-6c32e55e4d4e.jpeg": (0.55, 0.00, 1.00, 0.30),
    "a679289e-db2b-4c57-b0b4-80f23e871d56.jpeg": (0.00, 0.00, 0.50, 0.25),
    "baefb719-0245-42b0-93a2-028a4080ed69.jpeg": (0.55, 0.00, 1.00, 0.30),
    "bb3d5354-6a95-47b5-b78f-576cb84cefe5.jpeg": (0.50, 0.70, 1.00, 1.00),
    "d166dc5f-5cd0-4761-819c-d527903652d4.jpeg": (0.00, 0.00, 1.00, 0.25),
    "df813141-8c22-4736-9121-d34477b0c866.jpeg": (0.20, 0.00, 0.85, 0.13),
    "e73896f6-b29a-4648-8741-2a828d52158d.jpeg": (0.40, 0.70, 1.00, 1.00),
    "f6eec934-ac06-47a1-9649-b1c0f0e145a0.jpeg": (0.70, 0.00, 1.00, 0.20),
    "fe3a08ed-9daa-4eea-bcfb-0b3f3438c4d8.jpeg": (0.20, 0.00, 0.65, 0.15),
}

# Only clean photos we have a mapping for (skip 2756fe97 etc.)
TARGET_FILES = [
    "07cc495a-d456-4f56-8d4e-1b0ac62fd861.jpeg",
    "0fc2ba22-d6e8-4d9e-b9b4-53e6967ecb7f.jpeg",
    "1a044bea-7b16-42ce-aadb-980ba7ef9f55.jpeg",
    "28046bf4-8588-467c-846a-5f2161a07705.jpeg",
    "42fbf3e4-ea24-4458-9469-30b1210f3ab5.jpeg",
    "450f15a9-15ac-4b3e-8422-86cd8a163345.jpeg",
    "48444c0b-83b9-4aba-bedf-4f4049e71216.jpeg",
    "4fb120bb-9f56-4505-ab20-8114085aba09.jpeg",
    "6620ac26-4195-42b5-b061-95d36373a792.jpeg",
    "693253d2-e93c-4f83-b881-2fffddbdf6b7.jpeg",
    "69a42848-1e6b-4ac4-93f4-403ec6d95d0d.jpeg",
    "6bf108e4-be02-4762-8ef5-994ac0a1efe0.jpeg",
    "7aa06236-8d85-42ca-8652-fd85d7860fe8.jpeg",
    "7b8e0dd2-f6ab-45a1-82f0-72f35d669928.jpeg",
    "9beb8127-e55a-45a0-930b-da296337f4b7.jpeg",
    "9cd43c69-0178-41db-b7c9-144542423776.jpeg",
    "a0b98327-eea0-47d1-b12c-9ee371520107.jpeg",
    "a2487a88-015b-4bc6-9fef-6c32e55e4d4e.jpeg",
    "a679289e-db2b-4c57-b0b4-80f23e871d56.jpeg",
    "baefb719-0245-42b0-93a2-028a4080ed69.jpeg",
    "bb3d5354-6a95-47b5-b78f-576cb84cefe5.jpeg",
    "d166dc5f-5cd0-4761-819c-d527903652d4.jpeg",
    "df813141-8c22-4736-9121-d34477b0c866.jpeg",
    "e73896f6-b29a-4648-8741-2a828d52158d.jpeg",
    "f6eec934-ac06-47a1-9649-b1c0f0e145a0.jpeg",
    "fe3a08ed-9daa-4eea-bcfb-0b3f3438c4d8.jpeg",
]


def ocr_text_mask(img_bgr: np.ndarray, pad: int = 6) -> np.ndarray:
    """Return a binary mask of word-level Tesseract bboxes only.
    Tesseract's image_to_data returns nested 'levels' 1..5 — page, block,
    paragraph, line, word. Block boxes can span huge empty areas and would
    inpaint half the image; we filter to level==5 (word) only.
    """
    h, w = img_bgr.shape[:2]
    mask = np.zeros((h, w), dtype=np.uint8)
    for psm in (6, 11):
        try:
            data = pytesseract.image_to_data(
                img_bgr, lang="heb+eng",
                config=f"--psm {psm}",
                output_type=pytesseract.Output.DICT,
            )
        except Exception:
            continue
        n = len(data.get("text", []))
        for i in range(n):
            level = int(data.get("level", [0] * n)[i]) if "level" in data else 5
            if level != 5:  # word only
                continue
            txt = (data["text"][i] or "").strip()
            try:
                conf = int(float(data["conf"][i]))
            except (ValueError, TypeError):
                conf = -1
            if not txt or conf < 50:
                continue
            bw, bh = data["width"][i], data["height"][i]
            if bw * bh > 0.10 * w * h:  # reject suspiciously large word boxes
                continue
            x, y = data["left"][i], data["top"][i]
            x0 = max(0, x - pad)
            y0 = max(0, y - pad)
            x1 = min(w, x + bw + pad)
            y1 = min(h, y + bh + pad)
            mask[y0:y1, x0:x1] = 255
    return mask


def color_text_mask(img_bgr: np.ndarray) -> np.ndarray:
    """Find very dark or very light blobs concentrated in the corners /
    edges — typical placement of on-photo labels."""
    h, w = img_bgr.shape[:2]
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (3, 3), 0)

    dark = (blur < 60).astype(np.uint8) * 255
    light = (blur > 235).astype(np.uint8) * 255

    # Restrict to image margins (top 30%, bottom 25%, left/right 30%)
    margin = np.zeros((h, w), dtype=np.uint8)
    margin[0:int(h * 0.30), :] = 1
    margin[int(h * 0.75):, :] = 1
    margin[:, 0:int(w * 0.30)] = np.maximum(margin[:, 0:int(w * 0.30)], 1)
    margin[:, int(w * 0.70):] = np.maximum(margin[:, int(w * 0.70):], 1)
    dark *= margin
    light *= margin

    candidate = cv2.bitwise_or(dark, light)

    # Morphological cleanup — keep only connected text-like blobs
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (7, 7))
    closed = cv2.morphologyEx(candidate, cv2.MORPH_CLOSE, kernel, iterations=2)

    # Drop tiny noise and oversized blobs (pepper silhouettes etc.)
    num, labels, stats, _ = cv2.connectedComponentsWithStats(closed, connectivity=8)
    mask = np.zeros((h, w), dtype=np.uint8)
    img_area = h * w
    for i in range(1, num):
        x, y, bw, bh, area = stats[i]
        if area < 200:
            continue
        if area > img_area * 0.12:
            continue  # too big — likely background, not text
        aspect = bw / max(bh, 1)
        if aspect > 12 or aspect < 0.05:
            continue
        mask[labels == i] = 255

    # Group nearby blobs into rectangular text bands
    kernel2 = cv2.getStructuringElement(cv2.MORPH_RECT, (45, 25))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel2, iterations=1)
    return mask


def clean_photo(img_bgr: np.ndarray, region: tuple[float, float, float, float] | None) -> np.ndarray:
    """Inpaint the hardcoded text region for this photo. OCR-based detection
    was unreliable here (Hebrew labels on busy backgrounds), so we rely on
    region rectangles curated from a direct visual review of each file.
    """
    if region is None:
        return img_bgr
    h, w = img_bgr.shape[:2]
    x0, y0, x1, y1 = region
    x0i = max(0, int(w * x0))
    y0i = max(0, int(h * y0))
    x1i = min(w, int(w * x1))
    y1i = min(h, int(h * y1))
    mask = np.zeros((h, w), dtype=np.uint8)
    mask[y0i:y1i, x0i:x1i] = 255
    return cv2.inpaint(img_bgr, mask, 5, cv2.INPAINT_TELEA)


def main() -> int:
    DST.mkdir(parents=True, exist_ok=True)
    for fname in TARGET_FILES:
        src = SRC / fname
        if not src.exists():
            print(f"  MISSING: {fname}", file=sys.stderr)
            continue
        img = cv2.imread(str(src))
        if img is None:
            print(f"  UNREADABLE: {fname}", file=sys.stderr)
            continue
        region = TEXT_REGIONS.get(fname)
        cleaned = clean_photo(img, region)
        dst = DST / fname
        cv2.imwrite(str(dst), cleaned, [cv2.IMWRITE_JPEG_QUALITY, 92])
        print(f"  cleaned -> {dst.name}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
