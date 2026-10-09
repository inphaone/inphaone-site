# inphaone.com

The website of Inpha One, a band from Sydney. Plain static files served by GitHub Pages, with no build step.

## Where things live

| What | File |
|---|---|
| Shows, featured release, tape index, video, social links, Kit form id | `content.js` |
| Page structure and About text | `index.html` |
| Look and effects | `css/style.css` |
| Behaviour (shows sorting, click to play, robot, sign-up) | `js/site.js` |
| Photos (WebP, two sizes each) | `img/` |
| Custom domain | `CNAME` |

## Everyday updates

- **Add a show:** add an entry to `shows` in `content.js`. Shows dated today or later list as upcoming, older ones move to "past transmissions" by themselves.
- **New photo:** add `name-800.webp` and `name-1600.webp` to `img/` and point the `<img>` at them.
- **Email list:** set `kitFormId` in `content.js`. Until it is set, the form opens an email to the band instead.

Every push to `main` goes live within a minute or two.

**Cache:** after changing `css/style.css`, `js/site.js` or `content.js`, bump the `?v=` number on their links in `index.html` so browsers fetch the new version straight away.
