# Visual Direction for the Public Site

This document goes with the mockups in this folder. It covers part 2 of the order of work in `docs/site-rebuild-decisions.md`. `CONTEXT.md` defines the terms.

Third pass, written on 2026-11-16 after two reviews by Troy. Nothing in `site/` changed. Each change below is a proposal.

## What changed in the second pass

Troy asked for these changes:

- **Ice texture:** the pages have the skated-ice marks of the Recap thumbnails. The first pass had a flat background.
- **Schedule:** the Games page is now the Schedule page, with a calendar view and a list view. The reference is the schedule page of an NHL team.
- **Home:** the page has the layout of the first draft: the Recap with a headline and the score, then the games of this season, then the Shorts and the points leaders.
- **Stats, Roster, Player:** each page follows the matching NHL team page. The Roster has only the columns that the team has data for.
- **Polish:** cards with a border and a soft shadow, table heads with a fill, a band at the top of each page, and a footer.

**This conflicts with one confirmed decision.** `docs/site-rebuild-decisions.md` says "The site has no full schedule page". The Schedule mockup shows past Games and the next games from the Calendar Feed. It has no attendance. Update the decision if you accept the mockup.

## What changed in the third pass

- **Rink:** the background is a 3D render of a skated rink with the real Ice Pak crest at centre ice. I made one render for each Theme in Blender, from the example images that Troy supplied. The example images are not in the repo.
- **Accent colour:** each Theme has its own accent. Home has light blue, Away has dark blue, and Third has white.
- **Opponent logos:** 17 opponents have their real logo, from the logo folder on the NAS.
- **Home and away:** the home team is the first row of the score bug, and each row has a "Home" or "Away" label.
- **Roster:** the page is now a set of Player cards with no stats and no Roster Status. Roster Status is for Managers only.
- **Stats:** the page has four leader cards above the table.
- **Roster jerseys:** each Player is a jersey with the number, in rows of three forwards and two defense, as on a line chart. The reference is the line combinations page of Daily Faceoff.
- **Third Theme:** the Theme has black, red, and white only. The dark tones had a blue tint before.
- **From the design review:** a next-game bar on the Home page, a short calendar row for a week with no Game, the record against the opponent on the Game page, and links to the Game before and the Game after.

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
- On the Stats page, add `?view=ls` to open the season view.
- `mock.css` has all styles. Part 1 of that file has the tokens.
- A box with a dashed border and the words "Mockup note" is not part of the design. It tells you what is not real.

### Where the content comes from

- **Old games:** `backups/old-site-2026-11-15.sql`. 141 games, with their goals, penalties, rinks, and opponents.
- **HHG games:** `~/hockey/hockey.db`. 7 games.
- **Video links and images:** the `nightowls_11082026` and `bluedevils_10252026` game folders on the NAS.
- **Roster:** `backups/seed-player-bank.sql`, which comes from the Fee Sheet.
- **Shop products:** the product names in the orders of the Old Site, and two product photos from the NAS.
- **Rink images:** `rink-background.py` in this folder makes them with Blender 5.2. The crest in the Home and Away images is `icepak_logo2.png` from the NAS. The crest in the Third image is `img/crest-third.svg`. The script needs these two crest files beside it.
- **Opponent logos:** `Ext. Images/Ice Pak/Logos/` on the NAS, at 112 px. Buzz Light Beer, Dragon Juice, and the 20 Games with an unknown opponent have no logo.
- **Home and away:** `game_teams` in the HHG database has the side of Ice Pak for 6 Games. The Old Site has no home or away data.
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
| `--kit-line` | `#5ba5d1` | `#1d315f` | `#ffffff` | **Change Away and Third.** | Troy asked for a different accent in each Theme: light blue, dark blue, and white. This token is the mark before a section title, the line below the current link, and the top line of a card. |
| `--accent` | `#6db6e0` | `#2a4a8f` | `#ffffff` | **Change Away and Third.** | Links, the sorted column, the record, and the focus ring. In Away and Third the link colour is near the text colour, so each link keeps its underline. |
| `--on-fill` | `#ffffff` | (inherits) | (inherits) | Keep | Text on `--kit-fill`. |

### Tokens to change or add

| Token | Home | Away | Third | Reason |
|---|---|---|---|---|
| `--band` | navy gradient, 46% to 84% | navy gradient, 66% to 92% | red gradient, 72% to 93% | **Change.** `site.css` has a transparent band in Home and Away. A band in each Theme gives each page a clear top. In Away, the band is the navy of the jersey trim, with white text. |
| `--head` | `#0a1427` | `#ffffff` | `#c0211c` | **Add.** The header background. In Third the header and the band are one red block, as in `site.css` now. |
| `--veil` | navy, 55% to 88% | white, 50% to 88% | black, 58% to 90% | **Add.** The gradient over the rink photo. |
| `--shade` | black 35% | navy 12% | black 50% | **Add.** The shadow colour of a card. |
| `--display`, `--body` | | | | **Add.** The two font lists. |
| `--opp`, `--opp-2` | | | | **Add.** The two colours of an opponent. Default `var(--frost)` and `var(--rule)`. |

`site.css` has `--on-band`, `--on-band-muted`, `--band-rule`, and `--band-button`. The mockups do not use them. Inside the band, `mock.css` sets the usual tokens again (`--ink`, `--frost`, `--accent`, `--rule`, `--panel`, `--panel-2`, `--kit-fill`). Each shared part then works in the band with no special rule. Example: in the Away band, the Ice Pak row of the score bug is white with navy text, as the away jersey.

**Third Theme, dark tones.** `site.css` has blue-grey values for the Third Theme. The mockups change them to neutral values, so the Theme has black, red, and white only: `--ground: #0a0a0a`, `--panel: #151515`, `--panel-2: #212121`, `--rule: #343434`, `--ink: #f5f5f5`, `--frost: #b4b4b4`. The rink image of this Theme has black ice and no blue.

Rules that go with the tokens:

- **Focus ring:** `:focus-visible` uses `--accent`, not `--kit-line`.
- **Results:** a Win tag is green (`#1b7f46`) and a Loss tag is red (`#b3261e`), the same in each Theme. Troy asked for this on 2026-11-16. Each tag also has the word or the letter, so the colour is not the only sign. In the calendar, a win still has the kit colour.
- **Shadow and radius:** a card has a soft shadow below it. Only the avatar and the opponent chip are round. All other parts have square corners, as the HHG graphics.

## 3. Shared parts

### Rink background

- `body::before` shows one rink image, fixed behind the page: `img/bg-home.jpg` (110 kB), `img/bg-away.jpg` (82 kB), and `img/bg-third.jpg` (121 kB). Each one is 1800 px wide.
- **Camera:** 30 cm above the ice, on the centre line. The images show no boards and no arena.
- **Centre line:** the red line is wide, and it has the peaks of the crest as cutouts in the ice colour.
- **Home:** dark blue ice and the navy crest.
- **Away:** light ice and the navy crest.
- **Third:** black ice and a red centre circle with the real black crest on it. The real crest needs red behind it.
- **Each image:** skate marks and the reflections of the arena lights.
- **Veil:** a gradient of the ground colour is over the image: 50% to 58% at the top of the window and 88% to 90% at the bottom.
- **Away:** the veil is only 30% to 50%, so the page ground is the blue-grey ice of the image. A card is pure white. Text on the ice is navy, and it has no grey text.
- **Text:** most text is on a card with a solid fill. The section titles and a few lines of small text are on the veil.

### Page frame

- **Header:** crest, "Ice Pak", four links, and the Theme switch.
- **Band:** the top of each page. It has the page title and the main controls. On the Home page it has the Recap, the headline, and the score. On a Player page it has the jersey number, the name, and a large faint crest.
- **Footer:** crest, three links, and the links to the Team Page and the Manager pages.

### Score bug

Two rows, one for each team. Each row has a team cell and a score cell.

- **Ice Pak row:** filled with `--kit-fill`, with a 2 px line of `--kit-line` at the bottom.
- **Opponent row:** filled with the primary colour of the opponent, with no line. The text is white or dark, from the brightness of that colour. For an opponent with no colours in HHG, a script took the main colour from its logo.
- **Score cell:** digits in Barlow Condensed. The score of the team that lost is `--frost`.
- **No score:** a Game with no Box Score shows a dash in each score cell.
- **Order:** the home team is the first row. Each row has a "Home" or "Away" label. A Game with no home data has Ice Pak in the first row and no labels.
- **Opponent logo:** the opponent row has the logo with no disc behind it.
- **Ice Pak crest:** each Ice Pak row has the crest, in the small size and the large size. One exception: in the band of the Third Theme the Ice Pak row is black, and the black crest is hidden there.
- **Video tag:** a Game with a Recap or Shorts has one "Highlights" tag.
- **Sizes:** small for a game card, large (`.bug.lg`) for the Home page and the Game page. The line score (`.bug.line`) adds one cell for each period.

The HHG graphics fill the opponent row with the opponent colour. The site does not, because a purple or light blue fill cannot hold readable text in all three Themes.

### Game card

One link for one Game, on a card. It has the date and the status (Final, Live, or the start time), the small score bug, and the tags. Each score bug row has the same height. The Home page has three cards for the games of this season.

### Table

- **Head:** a `--panel-2` fill with 12 px uppercase text.
- **Player cell:** an avatar and the name. The avatar is the photo of the Player. With no photo, it is the jersey number. The site has no photos now, so each avatar shows a number.
- **Sorted column:** an `--accent` tint down the full column and a small arrow in the head.
- **Totals row:** a `--panel-2` fill and a 2 px line of `--kit-line` above it.
- **Phone:** the columns with the class `wide-only` are hidden at 760 px and less. No table needs a sideways scroll at 390 px.

### Stat strip

One label and a row of large numbers on a card. The Stats page has one strip for the team: record, GP, GF, GA, and difference. The Player page has two strips: the current HHG Season and the career.

### Calendar

- Seven columns, Sunday first. The arrows change the month. Each day has the same size.
- **A day with a Game:** the opponent logo, the result or the start time, and the opponent. The day is a link to the Game page. It has no tags.
- **Home and away:** a home Game has the primary Kit colour, and an away Game has the secondary Kit colour. A Game with no home data has no colour.
- **Result:** a green label for a win and a red label for a loss.
- **Today:** an `--accent` outline.
- **Phone:** each day shows the logo and the result or the time only.
- **Subscribe:** a button beside the page title adds the Calendar Feed to the calendar app of the visitor.

### Button

Each control has a forward lean: the left and right edges are cut at an angle, the text is Barlow Condensed italic 800, and a line of `--kit-line` is at the bottom. This applies to a button, a list, the Theme switch, the month control, and the Stats control. Troy asked for the look of a menu in a hockey video game.

### Link and mark colours

- `--link`: the colour of a link. It is white in the Home Theme. In Away and Third it is `--accent`.
- `--second`: the second Kit colour for a small mark, for example the arrow of "Watch the Recap". It is light blue in Home and Away, and white in Third.

### Game bar

A bar below the header of each public page, as the scores bar of a league site. It has the last 2 Games with their final scores, then the next games with the date, the time, and the rink. Each tile is a link to its Game. On a phone the bar scrolls sideways. It replaces the next-game bar and the "Next games" section of the Home page. The header and the bar stay at the top during a scroll.

### League names

A visitor sees "SLC County" and "Mammoth". The data keeps the short names County and MIC.


The real logo, with no disc and no border. Troy asked for this on 2026-11-16. A dark logo is less clear on a dark ground. An opponent with no logo gets a disc with its two colours and its initials.

### Leader card

The Stats page has four cards: points, goals, assists, and penalty minutes. Each card has the leader with a large number, and the next three Players.

### Jersey

The Roster page shows each Player as the back of a jersey with the number, and the name below it. The jersey has no nameplate. It is an SVG drawing, and CSS gives it the Kit colours of the Theme: navy for Home, white for Away, and red with black for Third. The number style follows the number art on the NAS (`athletic_shirt_*.png`): a solid number with an outline.

I did not find a jersey mockup of Ice Pak on the NAS. The stripes of the drawing are my assumption. The rows are in order of the number, and they are not line combinations.

### Theme switch

Three buttons in one group: Home, Away, Third. Each button has a Kit chip with the two colours of that jersey. On a phone the buttons show the chips only, and each button keeps its name for a screen reader.

Proposed change to `site/src/layouts/Base.astro`: when the visitor has made no choice, mark the button of the Theme that the device setting selected. `mock.js` shows the change.

### Other parts

- **Tag:** an 11 px uppercase label with a 1 px border. Sheet Only has a dashed border. A Recap tag in the list view is a link.
- **Video:** a 16:9 image with a "Watch the Recap" label, and a 9:16 image for a Short. A click opens a pop-out player over the page, so the visitor stays on the site. Escape, Close, or a click outside closes it. In the artifact viewer the YouTube player cannot load, so the mockup shows a fake player bar.
- **Opponent page:** `opponent.html`. Each opponent name opens it. It has the record, the game history, and the top scorers against that team. The label is black with a red arrow in each Theme, because it is on a photo.
- **Tabs:** Calendar and List on the Schedule page.
- **Stats control:** an "All time" button and one list of the League Seasons. Troy removed the HHG Season view on 2026-11-16.
- **Event list:** the goals and penalties of a Game on a card, with one head row for each period. Each row has the logo of the team.
- **Player highlights:** the Player page lists only the goals with a video that the Player scored or assisted.

## 4. The pages against the NHL reference

| Page | From the NHL page | Left out or changed |
|---|---|---|
| Schedule | Month control, Calendar and List tabs, a legend, a day cell with the opponent and the result. | No Full Season view, no tickets, no TV links. The fill shows a win, not a home game. The list has one table for each League Season. |
| Stats | A "Skaters" table with a rank, a Player cell, and a tint on the sorted column. | The columns are Pos, GP, G, A, P, PIM, and P/GP. A team strip and four leader cards are above the table. A goalie table is below it, with GP, W, L, T, GA, GAA, and SO. It has no save percentage, because the data has no saves. |
| Roster | One group for each position, and a link to the stats. | Jerseys in rows, as on the Daily Faceoff line chart, in place of a table. The Roster answers "who is on the team", and the Stats page has all numbers. |
| Player | A band with the name and the number, a season strip and a career strip, "Last 5 Games", and "Career Stats". | No photo, no Bio tab. A "Goals" table with the links to the Shorts is added. |

## 5. Stats and Roster

The second pass had the same Players and the same numbers on both pages. Recommendation: keep both pages, and give each one job.

- **Roster:** who is on the team in one League Season. Jerseys with the number and the name, and no stats.
- **Stats:** how the Players and the team did. Leaders, the table, and the three views.

The other option is one "Team" page with a Roster view and a Stats view. It removes one header link. I did not select it, because a visitor looks for "Roster" and "Stats" by those names on a team site.

## 6. Design review: what is missing

I did this review myself, as a UX designer would. The first four items are in the mockups now.

1. **Next game above the fold.** The first question of a Player is "when and where is the next game". The Home page now has a next-game bar below the header.
2. **Home and away.** Done, as Troy asked.
3. **Context on a Game page.** The page now has the record against the opponent, and links to the Game before and the Game after.
4. **Empty calendar.** The team has about one Game for each week. A week with no Game now has a short row.
5. **A Videos page.** The site is the home of the videos, and no page lists all Recaps and Shorts. A visitor finds a Short only through a Game or a Player.
6. **Link preview.** A link in the BenchApp chat needs a title and an image. Each Game page needs the Recap thumbnail and the score as its preview.
7. **Opponent page.** Each opponent name can open a page with all Games against that team and the record.
8. **Milestones.** Ned White has 100 career points. The site can show a milestone on the Player page and the Home page.
9. **Search.** The team has 59 Players in the data. A Player search in the header finds a Player faster than the Roster of an old League Season.
10. **Table sort and filter.** The column titles look like controls and do nothing in the mockup. The site needs the sort, and a League filter on the Stats page.
11. **Empty and error states.** No mockup shows a League Season with no Games, a Player with no goals, or a page that is not found.
12. **Phone header.** The switch buttons are 38 px high on a phone. The usual minimum for a touch target is 44 px.
13. **Motion.** The header of an NHL site stays at the top during a scroll. The mockup header does not.
14. **Recap thumbnail order.** The thumbnail from HHG shows Ice Pak in the first row. The score bug of the site shows the home team first. The two can disagree on one screen.

## 7. The crest for each Theme

Troy named the art file for each Theme on 2026-11-16. Each crest is made for the colour of its jersey.

| Theme | Art file | File in the mockups | Made for |
|---|---|---|---|
| Home | `Jesey_Logos.ai` | `img/crest-home.png` | A navy ground. The lower outline is white. |
| Away | `Logo_IcePak.ai` | `img/crest-away.png` | A white ground. The lower outline is navy. |
| Third | `IcePak_RedBlk.ai` | `img/crest-third.svg` | A red ground. The crest is black with white letters. |

- **Extraction:** `sips` rendered the art files. The Home crest is on a navy artboard with sponsor logos, so a script cropped it and removed the artboard colour. The navy parts of the Home wordmark are now clear, and they show the ground. On a navy ground this looks the same. For the real site, export each crest as SVG from the art file.
- **Score bug, Away:** the Ice Pak row is white with navy text, as the away jersey, so the navy crest shows.
- **Score bug, Third band:** the Ice Pak row is black, so the black crest sits on a small red square.
- **Rink renders:** they still use `icepak_logo2.png` from the NAS at centre ice. I did not render them again.

## 7a. Manager pages

Three pages behind the Manager login, from part 1 of the order of work. Each one has the same header style, with "Ice Pak Manager" and its own links.

| Page | File | What it does |
|---|---|---|
| Players | `manager.html` | The Player Bank in three Priority Tiers. Drag a row to change the order in a tier. A list changes the tier. "Add a Player" opens a form. |
| Seasons | `manager-season.html` | The Leagues and their League Seasons at the left. For one League Season: the League Fee and the Target Counts, the proposed fees, the Roster Builder, the chase message, and the Payments. |
| Jerseys | `manager-jerseys.html` | For each Player: the number, the size, and "has it" and "paid" for each Kit. The free numbers are below. |

- **Roster Builder:** one column for each Roster Answer: Full-time, Part-time, Sub only, Out, and No answer. Drag a Player card to a column. The counts, the Target Counts, and the fees change at once.
- **Fee:** the formula of the Fee Sheet. A goalie pays $0. "Lock the fee" fixes it.
- **Payments:** the fee, the paid amount, the Balance, and a status for each Player with a fee.
- **Data:** the names, tiers, answers, and amounts are invented. This repository is public, and this data is for Managers only.

## 8. Open questions for Troy

### Data and terms

1. **Schedule page.** The decisions document says that the site has no full schedule page. Do you want to change that decision?
2. **League Season of the newest games.** I put the Night Owls game (2026-11-08) in "MIC Summer '26". I put the two October 2026 games in "County Winter '26-27". That name is not in the site database. Which League Season is correct for each game?
3. **Home and away.** HHG has the side of Ice Pak for 6 Games. The 141 old Games have no home data. Does a Manager enter it, or do the old Games stay without it?
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
13. **Opponent logos.** Some logos are the logos of NHL teams (Wild, Flyers). This repo is public. Do you accept these files in the repo and on the site?
14. **Recap images.** A Recap thumbnail has the red kit graphics of HHG. It looks the same in the Home and Away Themes. Is that acceptable?
15. **Opponents with no logo.** Buzz Light Beer and Dragon Juice have no logo file. Do you have these logos?
16. **Photos.** A Player has initials in place of a photo. Do you want Player photos later?
17b. **Rink images.** At 30 cm above the ice, the crest at centre ice is a thin shape and is not readable. Is that acceptable, or do you want the camera higher or the crest nearer?
17a. **Jersey design.** I did not find the jersey mockups on the NAS. Which file or folder has them? The drawing needs the real stripes and the real number colours of each Kit.

### Privacy

17. **Scoresheet photo.** Is the full photo public on a Sheet Only page? A Scoresheet has the names of the opponent players.
18. **Roster Status.** Answered: it is for Managers only. The mockups do not show it.

### Shop

19. **Store address.** The Printful Quick Store does not exist yet, so the button has no address.
20. **Product photos.** I found two tee photos on the NAS. Do you want photos of the hoodie, the hats, and the stickers on the Shop page?

## 9. What the mockups do not show

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
