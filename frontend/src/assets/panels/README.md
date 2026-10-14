# Adding pictures

Every picture on the site is a drawing until you drop a real image into **this folder**.

## In VS Code — three steps

1. **Find the name.** Open [`SLOTS.md`](SLOTS.md) — it lists every picture slot (⬜ empty, ✅ filled),
   grouped by page, with the exact file name to use and the shape to crop to.
   *Or* run the site (`Terminal → Run Task… → Site: start dev server`), click the yellow
   **Show image names** button, and every picture shows the file name it wants.
2. **Drop the image here** with that name, e.g. `guts.jpg`, `ev-eclipse-panel-1.jpg`.
   `.jpg .jpeg .png .webp .avif` all work. Drag the file from your computer onto this folder
   in the VS Code Explorer.
3. **Reload the site.** The picture replaces the drawing, shown in black-and-white ink style.

Then run `Terminal → Run Task… → Panels: update image checklist` (or `npm run panels` in
`frontend/`) to tick it off in `SLOTS.md`. The checklist also warns you about any file whose
name doesn't match a slot (usually a typo).

## Credits (recommended)

Open [`credits.json`](credits.json), type `credit` and press <kbd>Tab</kbd> for a ready-made entry.
VS Code autocompletes the slot names. Without an entry the picture shows “Credit needed”.

```jsonc
"credits": {
  "guts": {
    "alt": "Guts standing in the rain",
    "credit": "Fan art by @artist",
    "license": "Used with permission"
  }
}
```

## Tips

- About 1200–1600 px on the long side is plenty. Larger files only slow the site down.
- Install the recommended **Image Preview** extension (VS Code will offer it) to see thumbnails
  next to file names.
- The slot names come from `src/data/slots.ts` — new characters or events get new slots
  automatically; run the checklist task to see them.

## Reference shelf (look, don't copy)

Places to study composition, costume and lighting while drawing your own art. Their images
belong to their owners — use them as reference only, never drop them into this folder.

- Official anime site — characters, world, specials: <https://berserk-anime.com/>
- Official portal dictionary: <https://berserk-project.jp/dictionary/character.html>
- Memorial Edition site: <https://berserk-me.com/>
- Berserk Wiki character images: <https://berserk.fandom.com/wiki/Category:Character_Images>
- JoJo Wiki — Berserk manga art: <https://jojowiki.com/Berserk_manga_art>
- The Art of Mitsuhiro Arita (licensed card art): <https://theartofmitsuhiroarita.com/berserk>
- 1997 anime screencaps: <https://animehistory.org/>
- *Berserk Official Guidebook* (Dark Horse, 2019) — digital.darkhorse.com and Google Books

Do not upload or republish manga chapters or scans. For a public site, use licensed or
promotional assets with permission, commissioned art with permission, or your own original artwork.

## Copyright

Berserk's manga pages and illustrations belong to Kentaro Miura's estate and Hakusensha.
Only add images you own, made yourself, or have the artist's permission to publish, and
credit them. This repository is public.
