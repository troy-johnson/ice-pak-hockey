# Visual Direction for the Public Site

This document goes with the mockups in this folder. It covers part 2 of the order of work in `docs/site-rebuild-decisions.md`. `CONTEXT.md` defines the terms.

Second pass, written on 2026-11-16 after Troy's review of the first pass. Nothing in `site/` changed. Each change below is a proposal.

## What changed in the second pass

Troy asked for these changes:

- **Ice texture:** the pages have the skated-ice marks of the Recap thumbnails. The first pass had a flat background.
- **Schedule:** the Games page is now the Schedule page, with a calendar view and a list view. The reference is the schedule page of an NHL team.
- **Home:** the page has the layout of the first draft: the Recap with a headline and the score, then the games of this season, then the Shorts and the points leaders.
- **Stats, Roster, Player:** each page follows the matching NHL team page. The Roster has only the columns that the team has data for.
- **Polish:** cards with a border and a soft shadow, table heads with a fill, a band at the top of each page, and a footer.

**This conflicts with one confirmed decision.** `docs/site-rebuild-decisions.md` says "The site has no full schedule page". The Schedule mockup shows past Games and the next games from the Calendar Feed. It has no attendance. Update the decision if you accept the mockup.

## The mockups

| Page | File |
|---|---|
| Home | `home.html` |
| Schedule | `schedule.html` |
| Game page | `game.html` |
| Game page, Sheet Only | `game-sheet-only.html` |
| Player page | `player.html` |
| Stats page | `stats.html` |
| Roster page | `roster.html` |
| Shop page | `shop.html` |

- Open a file in a browser. The Theme switch in the header works.
- Add `?theme=home`, `?theme=away`, or `?theme=third` to the address to set the Theme.
- On the Schedule page, add `?view=list` to open the list view.
- On the Stats page, add `?view=hs` or `?view=ls` to open the HHG Season view or the League Season view.
- `mock.css` has all styles. Part 1 of that file has the tokens.
- A box with a dashed border and the words "Mockup note" is not part of the design. It tells you what is not real.

### Where the content comes from

- **Old games:** `backups/old-site-2026-11-15.sql`. 141 games, with their goals, penalties, rinks, and opponents.
- **HHG games:** `~/hockey/hockey.db`. 7 games.
- **Video links and images:** the `nightowls_11082026` and `bluedevils_10252026` game folders on the NAS.
- **Roster:** `backups/seed-player-bank.sql`, which comes from the Fee Sheet.
- **Shop products:** the product names in the orders of the Old Site, and two product photos from the NAS.
- **Ice texture:** `img/ice.svg`. A script made it from the rules of the HHG shader `v3/graphics/src/FrostPane.jsx`: long blade arcs, some in pairs, and short scuffs.
- The mockups have no emails, no phone numbers, and no Balances.

## 1. Fonts and type scale

### Recommendation

Use two fonts, and host the font files on the site.

- **Inter** for text, tables, and controls.
- **Barlow Condensed** for page titles, section titles, scores, and jersey numbers.

Reasons:

- **Inter is the font of the HHG graphics.** `v3/graphics/public/` in the HHG repo has `Inter.ttf`. With Inter, a score on the site looks like a score in a Recap.
- **System fonts change the numbers.** A phone, a Mac, and a Windows computer each show different digits. The score bug and the stats tables are mostly digits.
- **Barlow Condensed fits the crest.** The crest wordmark is slanted and narrow. The italic weight 800 has the same lean.
- **The cost is small.** The mockups load five font styles: Inter 400, 600, and 700, and Barlow Condensed 700 and italic 800. I did not measure the file sizes.

Do not load the fonts from Google on the real site. Put the `woff2` files in `site/public/fonts/`. The mockups load the fonts from Google Fonts, so they need a network connection.

### Type scale

| Role | Font | Size and weight | Used for |
|---|---|---|---|
| Page title (`h1`) | Barlow Condensed | italic 800, 40 px to 64 px, uppercase | One title on each page, in the band |
| Player name | Barlow Condensed | italic 800, 48 px to 84 px, uppercase | The last name on a Player page |
| Section title (`h2`) | Barlow Condensed | 700, 26 px, uppercase, letter spacing 0.05em | "Shorts", "Skaters", a League Season name |
| Score | Barlow Condensed | 700, 26 px in a card, 46 px in the large score bug | Score bug |
| Stat number | Barlow Condensed | 700, 26 px to 38 px | Stat strips |
| Jersey number | Barlow Condensed | italic 800, 112 px | Player page |
| Navigation and tabs | Barlow Condensed | 700, 20 px, uppercase, letter spacing 0.07em | Header links, Calendar and List |
| Body | Inter | 400, 16 px, line height 1.5 | Text, table cells |
| Strong | Inter | 600, 16 px | Player names, team names |
| Small | Inter | 400, 13 px to 14 px | Second lines, notes |
| Label (`h3`) and table head | Inter | 600, 12 px, uppercase, letter spacing 0.1em to 0.12em | Table heads, "Final", period names |
| Tag | Inter | 600, 11 px, uppercase, letter spacing 0.1em | Win, Recap, Sheet Only, League |

All numbers in tables and scores use `font-variant-numeric: tabular-nums`.

## 2. Tokens

Contrast numbers are WCAG contrast ratios. Text needs 4.5. A mark that carries meaning, such as a focus ring, needs 3.

### Tokens that `site.css` has now

| Token | Home | Away | Third | Proposal | Reason |
|---|---|---|---|---|---|
| `--ground` | `#0d1930` | `#ffffff` | `#080c11` | Keep | The page background of each Theme is clear and different. |
| `--panel` | `#14244a` | `#f3f6fb` | `#111820` | Keep | The fill of a card. |
| `--panel-2` | `#1d315f` | `#e6ecf6` | `#18212b` | Keep | Table heads, the opponent row, and the score cell of the score bug. |
| `--rule` | `#2b4175` | `#cbd5e6` | `#24303c` | Keep | Lines only. Its contrast on the ground is 1.5 to 1.8, so do not use it alone to show a state. |
| `--ink` | `#f2f6fb` | `#1d315f` | `#eef3f6` | Keep | Main text. |
| `--frost` | `#a9beda` | `#52658c` | `#9fb2c1` | Keep | Second text. Its lowest contrast is 4.9, in Away on `--panel-2`. |
| `--kit-fill` | `#27478a` | `#1d315f` | `#c0211c` | Keep | The Ice Pak row, buttons, the Win tag, and a win in the calendar. White text on it has a contrast of 6.0 or more. |
| `--kit-line` | `#5ba5d1` | `#5ba5d1` | `#e5483f` | Keep the value. Stop its use for the focus ring. | In Away its contrast on white is 2.7. It is too weak as the only sign of focus. |
| `--accent` | `#6db6e0` | `#1f6fa5` | `#f0554c` | Keep | Links, the sorted column, and the record. In Third its contrast is 4.7 or more. |
| `--on-fill` | `#ffffff` | (inherits) | (inherits) | Keep | Text on `--kit-fill`. |

### Tokens to change or add

| Token | Home | Away | Third | Reason |
|---|---|---|---|---|
| `--band` | gradient `#17295a` to `#101f42` | gradient `#213869` to `#17284f` | gradient `#c0211c` to `#a51a16` | **Change.** `site.css` has a transparent band in Home and Away. A band in each Theme gives each page a clear top. In Away, the band is the navy of the jersey trim, with white text. |
| `--head` | `#0a1427` | `#ffffff` | `#c0211c` | **Add.** The header background. In Third the header and the band are one red block, as in `site.css` now. |
| `--ice`, `--ice-invert` | 0.13, 0 | 0.12, 1 | 0.1, 0 | **Add.** The strength of the ice marks on the ground. Invert makes the white marks dark for the white ground. |
| `--band-ice`, `--band-ice-invert` | 0.17, 0 | 0.15, 0 | 0.3, 1 | **Add.** The same for the band. The marks are dark on the red band. |
| `--glow` | navy | light blue | red | **Add.** A soft kit-colour light at the top right of the page, as in the first draft. |
| `--shade` | black 35% | navy 12% | black 50% | **Add.** The shadow colour of a card. |
| `--display`, `--body` | | | | **Add.** The two font lists. |
| `--opp`, `--opp-2` | | | | **Add.** The two colours of an opponent. Default `var(--frost)` and `var(--rule)`. |

`site.css` has `--on-band`, `--on-band-muted`, `--band-rule`, and `--band-button`. The mockups do not use them. Inside the band, `mock.css` sets the usual tokens again (`--ink`, `--frost`, `--accent`, `--rule`, `--panel`, `--panel-2`, `--kit-fill`). Each shared part then works in the band with no special rule. Example: in the Away band, the Ice Pak row of the score bug is white with navy text, as the away jersey.

Rules that go with the tokens:

- **Focus ring:** `:focus-visible` uses `--accent`, not `--kit-line`.
- **No green and no red for results.** A win uses `--kit-fill`. A loss uses an outline. In the Third Theme, red is the colour of Ice Pak, so red must not mean a loss.
- **Shadow and radius:** a card has a soft shadow below it. Only the avatar and the opponent chip are round. All other parts have square corners, as the HHG graphics.

## 3. Shared parts

### Ice texture

- One SVG file of 20 kB with white marks. `body::before` and `.band::before` show it as a background image.
- Each Theme sets the strength. The Away ground and the Third band invert the marks to dark.
- The first try used the SVG as a CSS mask. A mask image does not load when the page opens from a file, so the mockups use a background image.

### Page frame

- **Header:** crest, "Ice Pak", four links, the record of the current HHG Season, and the Theme switch.
- **Band:** the top of each page. It has the page title and the main controls. On the Home page it has the Recap, the headline, and the score. On a Player page it has the jersey number, the name, and a large faint crest.
- **Footer:** crest, three links, and the links to the Team Page and the Manager pages.

### Score bug

Two rows, one for each team. Each row has a team cell and a score cell.

- **Ice Pak row:** filled with `--kit-fill`, with a 2 px line of `--kit-line` at the bottom.
- **Opponent row:** filled with `--panel-2`, with a chip at the left. The chip shows the primary colour over the secondary colour.
- **Score cell:** digits in Barlow Condensed. The score of the team that lost is `--frost`.
- **No score:** a Game with no Box Score shows a dash in each score cell.
- **Order:** Ice Pak is always the first row.
- **Sizes:** small for a game card, large (`.bug.lg`) for the Home page and the Game page. The line score (`.bug.line`) adds one cell for each period.

The HHG graphics fill the opponent row with the opponent colour. The site does not, because a purple or light blue fill cannot hold readable text in all three Themes.

### Game card

One link for one Game, on a card. It has the date and the League Season, the small score bug, and the tags. The Home page has three cards for the games of this season.

### Table

- **Head:** a `--panel-2` fill with 12 px uppercase text.
- **Player cell:** an avatar and the name. The avatar has the initials of the Player, because the site has no photos.
- **Sorted column:** an `--accent` tint down the full column and a small arrow in the head.
- **Totals row:** a `--panel-2` fill and a 2 px line of `--kit-line` above it.
- **Phone:** the columns with the class `wide-only` are hidden at 760 px and less. No table needs a sideways scroll at 390 px.

### Stat strip

One label and a row of large numbers on a card. The Stats page has one strip for the team: record, GP, GF, GA, and difference. The Player page has two strips: the current HHG Season and the career.

### Calendar

- Seven columns, Sunday first. The arrows change the month.
- **A day with a Game:** the opponent chip, the result or the start time, the opponent, the League, and a Recap tag.
- **Win:** the day is filled with `--kit-fill`. A loss, a tie, and a next game have the card fill.
- **Today:** an `--accent` outline.
- **Phone:** each day shows the chip and the result or the time only.
- An NHL calendar fills the home games. Ice Pak plays each game at a shared rink, and HHG has the home team of only one Game. For this reason the fill shows a win.

### Opponent chip

A disc with the two colours of the opponent and its initials. An opponent with no colours gets a grey disc.

### Theme switch

Three buttons in one group: Home, Away, Third. Each button has a Kit chip with the two colours of that jersey. On a phone the buttons show the chips only, and each button keeps its name for a screen reader.

Proposed change to `site/src/layouts/Base.astro`: when the visitor has made no choice, mark the button of the Theme that the device setting selected. `mock.js` shows the change.

### Other parts

- **Tag:** an 11 px uppercase label with a 1 px border. Sheet Only has a dashed border. A Recap tag in the list view is a link.
- **Video link:** a 16:9 image with a "Watch the Recap" label. A Short is a 9:16 image with a "Short" label. The label is black with a red arrow in each Theme, because it is on a photo.
- **Tabs:** Calendar and List on the Schedule page.
- **Segmented control:** the three views of the Stats page.
- **Event list:** the goals and penalties of a Game on a card, with one head row for each period.

## 4. The pages against the NHL reference

| Page | From the NHL page | Left out or changed |
|---|---|---|
| Schedule | Month control, Calendar and List tabs, a legend, a day cell with the opponent and the result. | No Full Season view, no tickets, no TV links. The fill shows a win, not a home game. The list has one table for each League Season. |
| Stats | A "Skaters" table with a rank, a Player cell, and a tint on the sorted column. | The columns are Pos, GP, G, A, P, PIM, and P/GP. No goalie table, because the data has no saves. A team strip is above the table. |
| Roster | One table for each position, and a "Season Stats" button. | No Sh, Ht, Wt, Born, or Birthplace. The columns are #, Pos, Since, GP, G, A, and Pts. |
| Player | A band with the name and the number, a season strip and a career strip, "Last 5 Games", and "Career Stats". | No photo, no Bio tab. A "Goals" table with the links to the Shorts is added. |

## 5. The crest for each Theme

| Theme | Crest | File in the mockups | Source |
|---|---|---|---|
| Home | Navy and light blue | `img/crest-navy.png` | `Ext. Images/Ice Pak/Logos/icepak_logo2.png` on the NAS |
| Away | Navy and light blue | `img/crest-navy.png` | Same |
| Third | Black with white letters | `img/crest-third.svg` | `IcePak_RedBlk.ai`, the art file of the third jersey. The other session made the SVG. |

- **Header:** the crest is 52 px high, and 44 px on a phone.
- **Score bug:** the large size shows the crest at 30 px in the Ice Pak row.
- **Third Theme:** the black crest needs red behind it. It is on the red header and on the red Ice Pak row. In the Third band, the Ice Pak row is black, so the crest is hidden there. The footer of the Third Theme is dark and has no crest.
- **Player page:** a large crest at 10% strength is at the right of the band.
- **File type:** the navy crest is a PNG, 399 px by 420 px, 84 kB. The NAS has the vector file `Logo_IcePak.ai`. I did not make an SVG of the navy crest.

## 6. Open questions for Troy

### Data and terms

1. **Schedule page.** The decisions document says that the site has no full schedule page. Do you want to change that decision?
2. **League Season of the newest games.** I put the Night Owls game (2026-11-08) in "MIC Summer '26". I put the two October 2026 games in "County Winter '26-27". That name is not in the site database. Which League Season is correct for each game?
3. **Home and away.** HHG has the home team of one Game. All other Games show "vs". Does the site need home and away for each Game?
4. **A Game with no Scoresheet and no Box Score.** 15 UHL games and 1 County game of 2021 are in this state. The mockup shows the tag "No Box Score". `CONTEXT.md` has no term for it. Which word do you want?
5. **UHL.** The Old Site has a third League, UHL, with 20 games in summer 2021. Does it become a League on the new site?
6. **Names that differ.** The Fee Sheet has Rob Kramer and Jonny Holmes. HHG has Robert Kramer and Johnny Holmes. The Old Site has Henry Levy and HHG has Hank Levy. The mockups join players by name, so check the totals after the people table exists.
7. **Game Players from HHG.** For the Night Owls game, HHG has only the 8 players with a goal, an assist, or a penalty. The games played of a Player will be too low until HHG or a Manager gives the full list.
8. **Positions.** The Old Site gives the position Goalie to some Players who have many goals. The Stats table shows the position from that data. Who corrects the positions?
9. **Goalie stats.** The data has no saves and no goals against. The Stats page has no goalie table. Is that acceptable for version 1?

### Design

10. **Fonts.** Do you accept Inter and Barlow Condensed, hosted on the site?
11. **Band in Home and Away.** `site.css` has a band only in the Third Theme. The mockups have a band in each Theme. Do you accept it?
12. **Headline.** The Home page has the headline "Ice Pak edge the Night Owls", from the first draft. Who writes the headline of a Game? HHG can write it to the HHG Game File, or the site can use "Ice Pak at Night Owls".
13. **Ice Pak first.** The score bug always shows Ice Pak in the first row. Is that correct for the site?
14. **Recap images.** A Recap thumbnail has the red kit graphics of HHG. It looks the same in the Home and Away Themes. Is that acceptable?
15. **Opponent colours.** HHG has colours for 5 opponents. All other opponents get a grey chip. Who adds colours for the old opponents, and where?
16. **Photos.** A Player has initials in place of a photo. Do you want Player photos later?

### Privacy

17. **Scoresheet photo.** Is the full photo public on a Sheet Only page? A Scoresheet has the names of the opponent players.
18. **Roster Status.** The Roster mockup shows a "Part-Time" tag. Is Roster Status public, or only for Managers?

### Shop

19. **Store address.** The Printful Quick Store does not exist yet, so the button has no address.
20. **Product photos.** I found two tee photos on the NAS. Do you want photos of the hoodie, the hats, and the stickers on the Shop page?

## 7. What the mockups do not show

- **Next games:** the four next games are examples. The Calendar Feed is not connected. The opponents and rinks are real names, and the dates and times are not real.
- **Calendar months:** the calendar has October, November, and December 2026 only.
- **Today:** the calendar marks 2026-11-16 as today.
- **Sheet Only games:** the 20 old games of County Winter '24-25 with no goals show as Sheet Only. This assumes that the Scoresheet backlog gives each of them a photo.
- **Scoresheet photo:** the photo on the Sheet Only page is from a different game and has a blur.
- **Controls:** the League list, the League Season lists, the HHG Season list, the table sort, and "Add to your calendar" do not change the page. The Theme switch, the month arrows, the Calendar and List tabs, and the three stats views work.
- **Links:** each Player name opens the one Player page (Ned White). Each Game opens the one Game page or the one Sheet Only page.
- **Video:** a Recap or a Short is a link to YouTube. The mockups have no player in the page.
- **Old goal videos:** 40 goals of the Old Site have a YouTube link. The Player page shows such a link as "Video", because it is not an HHG Short.
- **Pages not in this part:** the Team Page and the Manager pages.
