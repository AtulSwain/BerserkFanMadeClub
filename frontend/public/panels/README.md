# Panel images

Drop licensed or self-owned artwork here to replace the site's placeholder drawings.

1. Put the image in this folder, e.g. `guts.jpg` (JPEG/WebP, about 1200px tall is plenty).
2. Register it in `frontend/src/data/panels.json`:

```json
{
  "panels": {
    "guts": {
      "file": "guts.jpg",
      "alt": "Guts standing in the rain",
      "credit": "Art by <artist>",
      "license": "Used with permission"
    }
  }
}
```

The key is the drawing's key:

| Where it appears            | Key                                  |
|-----------------------------|--------------------------------------|
| Character portrait          | character id — `guts`, `casca`, …    |
| Character development strip | `<character id>-<n>` — `guts-0` …    |
| Event sequence panel        | `<event id>-<n>` — `ev-eclipse-0` …  |
| Arc opener in chronology    | arc id — `arc-golden-age`            |
| Faction banner / creature   | entity id — `band-of-the-hawk`       |
| Cover panels                | `cover`, `cover-a`, `cover-b`        |

Images are shown in grayscale with high contrast so they sit in the ink style,
with the credit and license printed on the panel.

**Copyright:** Berserk's manga pages and illustrations belong to Kentaro Miura's
estate and Hakusensha. Don't add scans or screenshots unless you hold the rights
or have permission. Fan art should be credited to its artist with their consent.
