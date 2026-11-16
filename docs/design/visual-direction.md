# Visual Direction for the Public Site

This document goes with the mockups in this folder. It covers part 2 of the order of work in `docs/site-rebuild-decisions.md`. `CONTEXT.md` defines the terms.

Written on 2026-11-16. Nothing in `site/` changed. Each token change below is a proposal.

## The mockups

| Page | File |
|---|---|
| Home | `home.html` |
| Games list | `games.html` |
| Game page | `game.html` |
| Game page, Sheet Only | `game-sheet-only.html` |
| Player page | `player.html` |
| Stats page | `stats.html` |
| Roster page | `roster.html` |
| Shop page | `shop.html` |

- Open a file in a browser. The Theme switch in the header works.
- Add `?theme=home`, `?theme=away`, or `?theme=third` to the address to set the Theme.
- On the Stats page, add `?view=hs` or `?view=ls` to open the HHG Season view or the League Season view.
- `mock.css` has all styles. Part 1 of that file is a copy of the tokens in `site/src/styles/site.css`. Part 2 has the proposed changes.
- A box with a dashed border and the words "Mockup note" is not part of the design. It tells you what is not real.

### Where the content comes from

- **Old games:** `backups/old-site-2026-11-15.sql`. 141 games, with their goals, penalties, rinks, and opponents.
- **HHG games:** `~/hockey/hockey.db`. 7 games.
- **Video links and images:** the `nightowls_11082026` and `bluedevils_10252026` game folders on the NAS.
- **Roster:** `backups/seed-player-bank.sql`, which comes from the Fee Sheet.
- **Shop products:** the product names in the orders of the Old Site, and two product photos from the NAS.
- The mockups have no emails, no phone numbers, and no Balances.

## 1. Fonts and type scale

### Recommendation

Use two fonts, and host the font files on the site.

- **Inter** for text, tables, and controls.
- **Barlow Condensed** for page titles, section titles, scores, and jersey numbers.

Reasons:

- **Inter is the font of the HHG graphics.** `v3/graphics/public/` in the HHG repo has `Inter.ttf`. With Inter, a score on the site looks like a score in a Recap.
- **System fonts change the numbers.** A phone, a Mac, and a Windows computer each show different digits. The score bug and the stats tables are mostly digits.
- **Barlow Condensed fits the crest.** The crest wordmark is slanted and narrow. The italic weight 800 has the same lean. The narrow digits also keep a stats table inside a phone screen.
- **The cost is small.** The mockups load five font styles: Inter 400, 600, and 700, and Barlow Condensed 700 and italic 800. I did not measure the file sizes.

Do not load the fonts from Google on the real site. Put the `woff2` files in `site/public/fonts/`. Then the site does not depend on another service. The mockups load the fonts from Google Fonts, so they need a network connection.

### Type scale

| Role | Font | Size and weight | Used for |
|---|---|---|---|
| Page title (`h1`) | Barlow Condensed | italic 800, 36 px to 56 px, uppercase | One title on each page |
| Section title (`h2`) | Barlow Condensed | 700, 24 px, uppercase, letter spacing 0.05em | "Shorts", "Scoring", a League Season name |
| Score | Barlow Condensed | 700, 26 px in a card, 44 px on a Game page | Score bug, career totals |
| Jersey number | Barlow Condensed | italic 800, 34 px in a list, 96 px on a Player page | Roster, Player page |
| Navigation | Barlow Condensed | 700, 19 px, uppercase, letter spacing 0.07em | Header links |
| Body | Inter | 400, 16 px, line height 1.5 | Text |
| Strong | Inter | 600, 16 px | Player names, team names |
| Small | Inter | 400, 14 px | Second lines, notes |
| Label (`h3`) | Inter | 600, 12 px, uppercase, letter spacing 0.12em | Table heads, "Final", period names |
| Tag | Inter | 600, 11 px, uppercase, letter spacing 0.1em | Win, Recap, Sheet Only, League |

All numbers in tables and scores use `font-variant-numeric: tabular-nums`.

`site.css` sets `h1` to 28 px and `h2` to 20 px now. The Manager pages have more controls than the public pages. I recommend that the Manager pages keep their smaller titles and use the same two fonts.

## 2. Tokens

Contrast numbers are WCAG contrast ratios. Text needs 4.5. A mark that carries meaning, such as a focus ring, needs 3.

| Token | Home | Away | Third | Proposal | Reason |
|---|---|---|---|---|---|
| `--ground` | `#0d1930` | `#ffffff` | `#080c11` | Keep | The page background of each Theme is clear and different. |
| `--panel` | `#14244a` | `#f3f6fb` | `#111820` | Keep | Used for table highlights and stat tiles. |
| `--panel-2` | `#1d315f` | `#e6ecf6` | `#18212b` | Keep | Used for the opponent row and the score cell of the score bug. |
| `--rule` | `#2b4175` | `#cbd5e6` | `#24303c` | Keep | Lines only. Its contrast on the ground is 1.5 to 1.8, so do not use it alone to show a state. |
| `--ink` | `#f2f6fb` | `#1d315f` | `#eef3f6` | Keep | Main text. |
| `--frost` | `#a9beda` | `#52658c` | `#9fb2c1` | Keep | Second text. Its lowest contrast is 4.9, in Away on `--panel-2`. |
| `--kit-fill` | `#27478a` | `#1d315f` | `#a60735` | Keep | The Ice Pak row, buttons, and the Win tag. White text on it has a contrast of 7.8 or more. |
| `--kit-line` | `#5ba5d1` | `#5ba5d1` | `#e8354f` | Keep the value. Stop its use for the focus ring. | In Away its contrast on white is 2.7. It is good as a kit colour under a filled row. It is too weak as the only sign of focus. |
| `--accent` | `#6db6e0` | `#1f6fa5` | `#e8354f` | Change Third to `#f0566c` | Link text in Third has a contrast of 4.3 on `--panel` and 3.9 on `--panel-2`. `#f0566c` gives 5.3 and 4.8. `--kit-line` keeps the red of the videos. |
| `--on-fill` | `#ffffff` | (inherits) | (inherits) | Keep | Text on `--kit-fill`. One value is correct for all three Themes. |
| `--display` | new | new | new | Add: `"Barlow Condensed", "Arial Narrow", "Helvetica Neue", Arial, sans-serif` | One place for the display font. |
| `--body` | new | new | new | Add: `Inter, system-ui, -apple-system, "Segoe UI", sans-serif` | One place for the text font. `site.css` has this list inside the `body` rule now. |
| `--opp`, `--opp-2` | new | new | new | Add. Default `var(--frost)` and `var(--rule)`. One score bug row sets them inline. | The two colours of an opponent. A team with no colours gets a grey chip. |

Two rule changes go with the tokens:

- **Focus ring:** `:focus-visible` uses `--accent`, not `--kit-line`.
- **No green and no red for results.** A win uses `--kit-fill`. A loss uses an outline. In the Third Theme, red is the colour of Ice Pak, so red must not mean a loss.

The mockups use no corner radius and no shadow. This agrees with `site.css` and with the HHG graphics.

## 3. Shared parts

### Score bug

Two rows, one for each team. Each row has a team cell and a score cell.

- **Ice Pak row:** filled with `--kit-fill`, with a 2 px line of `--kit-line` at the bottom. The text is `--on-fill`.
- **Opponent row:** filled with `--panel-2`, with a chip at the left. The chip shows the primary colour over the secondary colour.
- **Score cell:** `--panel-2`, digits in Barlow Condensed. The score of the team that lost is `--frost`.
- **No score:** a Game with no Box Score shows a dash in each score cell.
- **Order:** Ice Pak is always the first row.
- **Sizes:** the small size is for a game card. The large size (`.bug.lg`) is for the Home page and the Game page. The line score (`.bug.line`) adds one cell for each period.

The HHG graphics fill the opponent row with the opponent colour. The site does not. A purple or light blue fill cannot hold readable text in all three Themes. The chip keeps the colour and the text stays readable.

### Game card

One link for one Game. It has three parts:

1. **Top line:** the date at the left. At the right, the League Season on the Home page, or the rink on the Games list.
2. **Score bug:** the small size.
3. **Tags:** Win, Loss, or Tie; then Playoffs or Preseason; then Recap and the number of Shorts; then Sheet Only or No Box Score.

Cards are in a grid with a minimum width of 260 px. The cards of a row align at the bottom, so the score bugs stay level when a rink name uses two lines.

### Stats table

- The name column is at the left, in weight 600. Each number column is at the right and uses only the width it needs.
- The sorted column has a `--panel` background, a small arrow in its head, and digits in Barlow Condensed.
- A row gets a `--panel` background when the pointer is on it.
- A totals row has a 2 px line of `--kit-line` above it.
- At 420 px and less, the Pos and Pts/GP columns are hidden. The table then fits a phone with no sideways scroll.
- Above a team table, five tiles show the record, the Games, the goals for, the goals against, and the difference.

### Theme switch

Three buttons in one group: Home, Away, Third. Each button has a Kit chip with the two colours of that jersey. The chip colours do not change with the Theme.

Proposed change to `site/src/layouts/Base.astro`: when the visitor has made no choice, mark the button of the Theme that the device setting selected. The current script marks no button in that case. `mock.js` shows the change.

On a phone, the switch stays in the first row of the header, and the navigation goes to a second row. At 420 px and less, the text "Ice Pak" beside the crest is hidden.

### Other parts in the mockups

- **Tag:** an 11 px uppercase label with a 1 px border. Sheet Only has a dashed border.
- **Video link:** a 16:9 image with a "Watch the Recap" label. A Short is a 9:16 image with a "Short" label. Each one is a link to YouTube.
- **Segmented control:** the same look as the Theme switch. The League filter and the stats views use it.
- **Event list:** the goals and penalties of a Game, grouped by period. Each row has the clock, a team chip, the Player, and a tag.

## 4. The crest for each Theme

| Theme | Crest | File in the mockups | Source on the NAS |
|---|---|---|---|
| Home | Navy and light blue | `img/crest-navy.png` | `Ext. Images/Ice Pak/Logos/icepak_logo2.png` |
| Away | Navy and light blue | `img/crest-navy.png` | Same |
| Third | Red and black | `img/crest-red.png` | `Ext. Projects/Ice Pak/Black Ice Graphics/crest/icepak_crest_red_2400.png` |

- This agrees with the rule in `site.css`: the red crest shows only in the Third Theme.
- **Header:** the crest is 44 px high, with "Ice Pak" in Barlow Condensed beside it. The wordmark inside the crest is too small to read at that size.
- **Score bug:** the large size shows the crest at 28 px in the Ice Pak row. The small size shows no crest.
- **Home Theme:** the dark blue outline of the lower half of the crest is close to the dark blue ground. The white part keeps the shape readable. A crest with a light blue outline for the lower half would be better on this ground.
- **Third Theme:** commit `d2f883d` (from the other session) removed the white fill from the red crest. The mockups use that file. At 44 px on the black ground, the black lower half of the crest is not visible and the crest is hard to read. The crest with the white fill was clear at this size.
- **File type:** both files are PNG, 399 px by 420 px, about 80 kB each. The NAS has the vector files `IcePak_RedBlk.ai` and `Logo_IcePak.ai`. An SVG export would be smaller and sharp at each size. I did not make one.

## 5. Open questions for Troy

### Data and terms

1. **League Season of the newest games.** I put the Night Owls game (2026-11-08) in "MIC Summer '26", because the GameSheet season is "summer 2026". I put the two October 2026 games in "County Winter '26-27". That name is not in the site database. Which League Season is correct for each game?
2. **A Game with no Scoresheet and no Box Score.** 15 UHL games and 1 County game of 2021 are in this state. The mockup shows the tag "No Box Score". `CONTEXT.md` has no term for it. Which word do you want?
3. **UHL.** The Old Site has a third League, UHL, with 20 games in summer 2021. Does it become a League on the new site?
4. **Names that differ.** The Fee Sheet has Rob Kramer and Jonny Holmes. HHG has Robert Kramer and Johnny Holmes. The Old Site has Henry Levy and HHG has Hank Levy. The mockups join players by name, so check the totals after the people table exists.
5. **Game Players from HHG.** For the Night Owls game, HHG has only the 8 players with a goal, an assist, or a penalty. The games played of a Player will be too low until HHG or a Manager gives the full list.
6. **Goalie stats.** The data has no saves and no goals against for a goalie. The Stats page shows skater stats only. Is that acceptable for version 1?

### Design

7. **Fonts.** Do you accept Inter and Barlow Condensed, hosted on the site?
8. **Third Theme links.** Do you accept `#f0566c` for link text in Third?
9. **Ice Pak first.** The score bug always shows Ice Pak in the first row. The page title says "at" or "vs". The HHG graphics show the home team first in some places. Is "Ice Pak first" correct for the site?
10. **Recap images.** A Recap thumbnail has the red kit graphics of HHG. It looks the same in the Home and Away Themes. Is that acceptable?
11. **Opponent colours.** HHG has colours for 5 opponents. All other opponents get a grey chip. Who adds colours for the old opponents, and where?
12. **Home page content.** The brief asked for the Recap, the score, the next games, and the Shorts. I added a "Latest games" row with four game cards. Keep it or remove it?

13. **Red crest.** The red crest has no white fill now, and it is weak in the Third Theme header. Do you want the white fill back for small sizes, or a red crest with a light outline?

### Privacy

14. **Scoresheet photo.** Is the full photo public on a Sheet Only page? A Scoresheet has the names of the opponent players.
15. **Roster Status.** The Roster mockup shows a "Part-Time" tag. Is Roster Status public, or only for Managers?

### Shop

16. **Store address.** The Printful Quick Store does not exist yet, so the button has no address.
17. **Product photos.** I found two tee photos on the NAS. Do you want photos of the hoodie, the hats, and the stickers on the Shop page?

## 6. What the mockups do not show

- **Next games:** the four rows on the Home page are examples. The Calendar Feed is not connected. The opponents and rinks are real names, and the dates and times are not real.
- **Sheet Only games:** the 20 old games of County Winter '24-25 with no goals show as Sheet Only. This assumes that the Scoresheet backlog gives each of them a photo.
- **Scoresheet photo:** the photo on the Sheet Only page is from a different game and has a blur.
- **Controls:** the League filter, the League Season lists, and the HHG Season list do not change the page. The Theme switch and the three stats views work.
- **Links:** each Player name opens the one Player page (Ned White). Each game card opens the one Game page or the one Sheet Only page.
- **Video:** a Recap or a Short is a link to YouTube. The mockups have no player in the page.
- **Old goal videos:** 40 goals of the Old Site have a YouTube link. The Player page shows such a link as "Video", because it is not an HHG Short.
- **Pages not in this part:** the Team Page and the Manager pages.
