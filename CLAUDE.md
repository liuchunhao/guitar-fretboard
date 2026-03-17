# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build (output: dist/)
npm run lint      # ESLint (0 warnings allowed)
npm run preview   # Preview production build locally
npm run deploy    # Build + publish to GitHub Pages (gh-pages branch)
```

No test suite is configured.

## Architecture

Single-page React app with no routing. Two components, no state management library.

### Data flow

`App.jsx` owns all state and data. `Fretboard.jsx` is a pure presentational component — it receives props and renders, never modifies state itself.

```
App.jsx  →  Fretboard.jsx
```

### Key state in App.jsx

| State | Purpose |
|---|---|
| `scale` | Array of note names in the active scale (e.g. `['C','D','E',…]`) |
| `activePatternNotes` | Array of `[stringIndex, fretNumber]` pairs for the selected pattern; empty = All Notes |
| `noteDisplayMode` | `'all'` / `'scale'` / `'phonetic-scale-degree'` / `'none'` |
| `showAllNotes` | Boolean — when `true`, forces pattern note labels visible without hover |
| `tuning` | Reversed tuning array (index 0 = high E, index 5 = low E) |

### Pattern data

All scale patterns (3NPS modes and CAGED shapes) are hard-coded in `scalePatterns` inside `App.jsx`. Currently only `'C Major'` has full 3NPS + CAGED data; other scales have `'All Notes'` only.

`stringIndex` convention: **0 = High E, 5 = Low E** (reversed from physical order).

### Note highlighting logic (Fretboard.jsx)

1. A fret is highlighted if it's a scale note AND (`activePatternNotes` is empty OR the fret is in the pattern).
2. CSS classes applied: `scale-note` (green circle), `root-note` (red circle), `pattern-note` (circle visible, text hidden by default), `show-all` (forces text visible).

### Styling approach

Vanilla CSS, no CSS-in-JS. Layout uses CSS Grid — 25 columns × 6 rows. String thickness is controlled via nth-child selectors on `.fret::before`. Fret lines are the `2px` `gap` of the grid (background color shows through).

### Deployment

`homepage` in `package.json` is set to `https://liuchunhao.github.io/guitar-fretboard`. The Vite `base` config is currently commented out — the `gh-pages` package handles routing to the correct subdirectory.
