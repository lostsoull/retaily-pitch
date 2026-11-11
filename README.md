# RetailyAI · Checkmate & Connect deck

Interactive 1920×1080 keynote, 11 scenes, about 5 minutes. Storyboard, visual language and
speaking guide: [STORYBOARD.md](STORYBOARD.md).

## Presenting

`dist/index.html` is the whole deck in one file (fonts and images inlined). Copy it to a USB
stick and double-click it. It needs no internet and no server. Use Chrome or Edge, press **F**.

| Key | Action |
|-----|--------|
| → / Space / PageDown / click | Next step, then next scene |
| PageUp / ↑ | Previous step |
| ← | Previous scene (shows its final state) |
| G or Esc | Scene overview |
| number, then Enter | Jump to a scene (0–10) |
| F | Fullscreen |
| R | Restart |
| M | Reduced motion on/off |
| ? | Controls |
| Move the mouse | Navigation bar: step and slide buttons, a clickable strip of every slide, all slides, fullscreen |

Clickers that send PageUp/PageDown work out of the box. In scene 5 you can also click the
on-stage **Approve** button yourself.

## Developing

```
npm install
npm run dev        # http://localhost:5199, deep links like #5.2 (scene.step)
npm run build      # type-check, then dist/index.html
```

QA scripts (Playwright):

```
node scripts/shoot.mjs http://localhost:5199/ shots            # every step, 1920x1080, with clipping report
node scripts/shoot.mjs http://localhost:5199/ shots 5.2 --from=5.1 --wait=800   # mid-transition frame
node scripts/shoot.mjs http://localhost:5199/ shots --reduced   # reduced-motion pass
node scripts/navtest.mjs http://localhost:5199/                # keyboard and navigation
node scripts/offline-test.mjs                                  # dist over file:// with network blocked
```

Scenes live in `src/scenes/`, one file each, and render purely from `step`.
