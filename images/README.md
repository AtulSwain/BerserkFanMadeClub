# Images

**All pictures for the site go in this one folder.** Nothing else to edit.

## The list

Open **[`IMAGE-LIST.md`](IMAGE-LIST.md)**. It names every picture the site can show, with
⭐ the most visible ones first:

| | Save the picture as | Where it shows on the site | Shape |
|---|---|---|---|
| ⬜ | `guts.jpg` | Guts — portrait (dossier + cast strip) | tall |

## Adding a picture — three steps

1. **Pick a name** from `IMAGE-LIST.md`, e.g. `guts`.
2. **Save the picture here** with that name: `images/guts.jpg`. In VS Code, drag the file
   from your computer onto the `images` folder. `.jpg .png .webp .avif` all work — only the
   name before the dot matters.
3. **Reload the site.** The picture replaces the drawing.

Then run **Terminal → Run Task… → Images: update the list** to tick it off (✅) in
`IMAGE-LIST.md`. If a file name has a typo, the list warns you at the top.

Tip: run the site (**Run Task… → Site: start dev server**) and click the yellow
**Show image names** button — every picture on every page shows the name it wants.

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
- The names come from `frontend/src/data/slots.ts` — new characters or events get new names
  automatically; run the update task to see them.

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
