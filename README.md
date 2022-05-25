# elections-federal2022-lower-house

This repository contains the source code for the graphical and interactive components of the Story Lab's reporting on the 2022 federal election, as well as tools used to help produce those stories.

The latest release should be accessible via:

[`https://www.abc.net.au/res/sites/news-projects/elections-federal2022-lower-house/latest/`](https://www.abc.net.au/res/sites/news-projects/elections-federal2022-lower-house/latest/)

## Stories

Here's a list of stories based on this code:

| date       | story                                                                                                                                   | elements used                           |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| 2022/05/20 | [The Australian election map has been lying to you](https://www.abc.net.au/news/2022-05-20/federal-election-map-lying/101076016)        | scrollyteller (tilegram)                |
| 2022/05/22 | [How Labor won](https://www.abc.net.au/news/2022-05-22/election-how-labor-anthony-albanese-won/101087904)                               | scrollyteller (tilegram); illustrations |
| 2022/05/25 | [How the election result has changed our cities](https://www.abc.net.au/news/2022-05-25/election-results-maps-capital-cities/101091036) | scrollyteller (geographical); cards     |

## Development & deployment

This project was generated from [aunty](https://github.com/abcnews/aunty)'s `react` project template. Instructions for Story Lab's development & deployment process are documented there.

For those who are unfamiliar with aunty, running `npm install` and `npm start` should get you a development server up and running at [`https://localhost:8000/`](https://localhost:8000/).

Under the hood, webpack is building multiple source entry points into many distributable scripts. Here's a quick mapping of outputs to inputs, and what they're for:

| output             | entry / `import()`      | description                                                                                                                                                                    | example                                                  |
| ------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| `index.js`         | `src/index.tsx`         | Loads standalone graphics / scrollytellers / cards / illustrations into mount points in [Odyssey](https://github.com/abcnews/odyssey) stories                                  | see [Stories](#stories)                                  |
| `editor.js`        | `src/editor.tsx`        | An editor used for building graphics for standalone / scrollyteller usage in stories. Will generate mount points, as well as raster images for syndication                     | [/editor/](https://localhost:8000/editor/)               |
| `graphics.js`      | `src/graphics.tsx`      | Loads graphics into `#lhgraphic` mount points                                                                                                                                  | [/graphics/](https://localhost:8000/graphics/)           |
| `cards.js`         | `src/cards.tsx`         | Loads cards into `#lhcard` mount points                                                                                                                                        | [/cards/](https://localhost:8000/cards/)                 |
| `illustrations.js` | `src/illustrations.tsx` | Loads SVG illustrations into `#lhillustration` mount points (as `<iframe>`s, to universally support SVG animations)                                                            | [/illustrations/](https://localhost:8000/illustrations/) |
| `doc-block.js`     | `src/doc-block.tsx`     | Parses and loads scrollytellers from available Google Docs `*/pub` document URLs (to allow collaborative scrollyteller production outside our CMS) into an `#lhdb` mount point | [/doc-block/](https://localhost:8000/doc-block/)         |
| `fallbacks.js`     | `src/fallbacks.ts`      | Retrieves and downloads `.zip` bundles of `.png`s of graphics at each of the current story's scrollyteller states                                                              | -                                                        |

When releases are made, we also overwrite some documents at a consistent URL (`/elections-federal2022-lower-house/latest/`) to facilitate a simple redicret. This means producers don't need to update their URLs (for accessing the editor). Please ensure the following URL is cached-busted upon new releases:

```
https://www.abc.net.au/res/sites/news-projects/elections-federal2022-lower-house/latest/index.js
```

## Authors

- Colin Gourlay ([gourlay.colin@abc.net.au](mailto:gourlay.colin@abc.net.au))
