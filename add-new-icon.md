# How to Add a New Icon

This guide walks you through adding a new skill icon to the service from scratch.

---

## 1. Decide the icon type

Icons come in two types:

| Type | When to use | File(s) needed |
|---|---|---|
| **Themed** | The icon looks different on dark vs light backgrounds | `Name-Dark.svg` + `Name-Light.svg` |
| **Unthemed** | A single version works for both themes | `Name.svg` |

Most brand logos with a coloured background benefit from themed variants. Monochrome logos usually don't need them.

---

## 2. Create the SVG file(s)

Requirements for your SVG:

- **Canvas size:** 256 × 256 px (viewBox="0 0 256 256")
- **Self-contained:** no external images, fonts, or `<use>` references to other files
- **Clean markup:** remove editor metadata (Inkscape/Illustrator namespaces, `<sodipodi>`, `<metadata>` tags)
- **Naming convention:**
  - Themed icons: `Name-Dark.svg` and `Name-Light.svg`
  - Unthemed icons: `Name.svg`
  - Use PascalCase — e.g. `MyTool-Dark.svg`, not `mytool_dark.svg`

> The build step lowercases all filenames automatically, so `Python-Dark.svg` is stored
> and queried as `python-dark`. Keep your source files in PascalCase to stay consistent
> with the rest of the `icons/` directory.

---

## 3. Drop the file(s) into `icons/`

```bash
cp MyTool-Dark.svg  ./icons/
cp MyTool-Light.svg ./icons/
```

For an unthemed icon:

```bash
cp MyTool.svg ./icons/
```

---

## 4. (Optional) Add a short-name alias

If you want users to request the icon with a shorter or alternative name
(e.g. `mt` instead of `mytool`), open `index.js` and add an entry to the
`shortNames` object near the top of the file:

```js
const shortNames = {
  // existing entries …
  "mt": "MyTool",
};
```

The value must match the base name of your SVG file (without the `-Dark`/`-Light` suffix
and without the `.svg` extension), in the exact casing you used for the filename.

---

## 5. Rebuild `dist/icons.json`

This step reads every `.svg` in `icons/`, lowercases the names, and writes
the key→SVG-string map that the worker uses at runtime.

```bash
node build.js
```

You should see no errors. If the script exits cleanly, `dist/icons.json` now contains
your new icon.

---

## 6. Rebundle the worker

The worker is bundled with esbuild. Re-run this whenever you change `index.js` or
after rebuilding `icons.json`:

```bash
npx esbuild index.js --bundle --outfile=dist/worker.js --platform=browser --format=iife
```

---

## 7. Start (or restart) the local dev server

```bash
./node_modules/.bin/miniflare dist/worker.js \
  --wrangler-config wrangler.dev.toml \
  --no-update-check \
  --port 8787 \
  --upstream https://skillicons.dev
```

If Miniflare was already running, stop it first (`Ctrl+C`) and run the command again.

The app is now available at **http://localhost:8787**.

---

## 8. Verify the icon works

Test in your browser or with curl:

```bash
# Themed icon – dark variant (default)
curl "http://localhost:8787/icons?i=mytool"

# Themed icon – light variant
curl "http://localhost:8787/icons?i=mytool&t=light"

# Unthemed icon
curl "http://localhost:8787/icons?i=mytool"

# Multiple icons at once
curl "http://localhost:8787/icons?i=mytool,js,python"

# Confirm it appears in the full icon list
curl "http://localhost:8787/api/icons" | grep mytool
```

The `/icons` endpoint returns an SVG sheet. If you get an empty sheet or a broken
SVG, check that:

- The filename in `icons/` matches exactly what you typed in the URL (after lowercasing)
- `node build.js` completed without errors
- You rebundled and restarted Miniflare after the build

---

## Quick checklist

```
[ ] SVG file(s) placed in icons/  (Name-Dark.svg + Name-Light.svg, or Name.svg)
[ ] viewBox="0 0 256 256", no external references
[ ] Short-name alias added to index.js  (if needed)
[ ] node build.js  — regenerates dist/icons.json
[ ] npx esbuild …  — rebundles dist/worker.js
[ ] Miniflare restarted
[ ] Verified via http://localhost:8787/icons?i=<yourname>
```
