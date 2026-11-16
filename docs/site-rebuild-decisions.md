# Site Rebuild Decisions

Troy confirmed these decisions on 2026-11-15, after a design interview. `CONTEXT.md` defines the terms.
Each "not verified" item is a fact that nobody checked against a primary source.

## Why the site changes

- **The Old Site is out of date.** Its newest post is from October 2022, and its newest game is from March 2025.
- **The team's work is in the videos.** HHG makes a Recap and Shorts for each game. The Old Site does not show them.
- **The Old Site uses many services.** They are Vercel, Supabase Postgres, Firebase, Sanity, Auth0, Stripe, Printful, Twilio, and a GitHub job.
- **The Old Site was not safe.** No API route checked the login, and the login secret was in this public repo. A patch on 2026-11-15 closed the write routes and removed emails and phone numbers from the public routes.

## Purpose and look

- **Purpose:** the site is the home of the videos, with game history, stats, and a shop link.
- **Themes:** Home (dark blue), Away (white and dark blue), and Third. A new visitor gets Home or Away from the device setting. A switch changes the Theme, and the browser keeps the choice.
- **Third Theme:** the header and the top of each page are the red of the third jersey, and the content below is black. The Theme has black, red, and white only. Troy selected this on 2026-11-16.
- **Third crest:** the real logo of the third jersey is a black crest with white letters, and it has no red or white fill. It needs red behind it. `site/public/crest-third.svg` comes from the art file `IcePak_RedBlk.ai`. The red crest of the videos is not the real logo.
- **Jersey red:** `#c0211c`, taken from a photo of the jersey. Nobody checked it against the fabric.
- **Visual direction:** Troy confirmed the mockups on 2026-11-16. `docs/design/` has them, and `docs/design/visual-direction.md` gives the reasons. `site/src/styles/site.css` is the copy of `mock.css` that the site uses.
- **Look:** a rink with skate marks behind each page, a band at the top of each page, Inter for text and Barlow Condensed for titles and scores, and one accent for each Theme. The site hosts the font files.
- **Pages:** Home, Schedule, Stats, Roster, Shop, a Game page, and a Player page.
- **Schedule:** a Schedule page with a calendar view and a list view shows the past Games and the next games from the Calendar Feed. This replaces the earlier decision of no schedule page. The site has no attendance, because BenchApp has it.
- **Opponent logos:** the site uses the 17 opponent logos, NHL logos included. Troy accepted them on 2026-11-16.
- **Shop page:** the Shop page and its link wait for the Printful Quick Store.
- **Headline of a Game:** the site writes "Ice Pak at Night Owls" or "Ice Pak vs Wild". A headline in the HHG Game File replaces it.
- **Next game:** the Home page shows the next game with the date, opponent, rink, and League.
- **Dropped:** news posts, comments, text alerts, player logins, contact data, and the custom shop checkout.

## Technology

- **Code:** a rebuild in this repo, on the `rebuild` branch.
- **Switch:** the new site replaced the Old Site at icepakhockey.com on 2026-11-15. There is no separate address. Troy accepts a half-built site in the meantime. The Old Site code was deleted from the `rebuild` branch on 2026-11-16, and the git tag `old-site` has it.
- **Domain:** Cloudflare has the DNS of icepakhockey.com. The apex and `www` are custom domains of the Worker `ice-pak-site`. `backups/` has the DNS records from before the switch.
- **Manager login:** the Cloudflare Access application "Ice Pak Managers" protects `/manager` on both hostnames. Its policy lists the Managers' email addresses, which stay out of git.
- **Old data:** `backups/` has a dump of the Old Site database from 2026-11-15. Git ignores it, because it has contact data.
- **Stack:** Astro on Cloudflare Workers, a D1 database (SQLite), and R2 file storage for Scoresheets. The cost is $0 on the free plans.
- **Why not Vercel:** Vercel has no disk for a SQLite file, and its free plan is for non-commercial use only.
- **Why not Supabase:** a free project pauses after 7 days of low activity.
- **Manager login:** Cloudflare Access in front of the manager pages, with a one-time code by email. The app holds no login code.
- **Team Page:** one shared Team Passcode. Players have no accounts.
- **Contact data:** the site stores no emails and no phone numbers. BenchApp has them.

## Shop

- **Decision:** a Printful Quick Store, linked from a Shop page in the new look.
- **Why:** the shop gets about two orders a year. A Quick Store costs $0, needs no code, and needs no work for each order.
- **Limit:** it ships to US addresses only and does not look like the site.

## Game data

- **Source of record:** the site database holds all Games.
- **Old data:** the 141 games and 49 players of the Old Site move one time. Career stats continue across the old and new data.
- **People:** a table on the site matches each old player to an HHG person. Troy reviews it. The site does not modify HHG data.
- **HHG:** HHG gets no Ice Pak step. HHG writes one HHG Game File for each game, and the Import command in this repo reads it.
- **Games with no video:** HHG does not handle them. The Calendar Feed creates the Game, and a Manager enters the Box Score.
- **Leagues:** the team played in three Leagues. Troy confirmed them on 2026-11-16:
  - **MIC:** the adult league of Mammoth Ice Center, https://mammothicecenter.com/adult-league.
  - **County:** the adult ice programs of Salt Lake County Parks and Recreation, https://www.saltlakecounty.gov/parks-recreation/activities/ice-programs/#adult.
  - **UHL:** the Utah Hockey League, the adult hockey league of Cottonwood Heights Parks and Recreation, https://www.chparksandrecut.gov/adult-hockey-league. The 20 UHL Games of summer 2021 move with the old data.
- **League of a Game:** the rink sets it, and a Manager can change it. Mammoth Ice Center gives MIC. County Ice Center, Salt Lake City Sports Complex, and West Valley Acord Ice Center give County. Cottonwood Heights Recreation Center and Maverik Center give UHL, from the old data.
- **Playoffs:** a playoff run is part of its League Season. Each Game has a type: regular, playoff, or preseason. The Old Site kept the playoffs as a separate season.
- **Home and away:** the old Games have no home or away data. A Game with no such data shows Ice Pak as the home team. The database keeps no value for it, so a Manager can set the real side later.
- **Goalies:** some Players play goalie in one Game and skate in another. Each Game Player has a goalie mark. The stats show the position from the Player Bank, and a Manager corrects it there.
- **No Box Score:** a Game with no Scoresheet and no Box Score shows the tag "No Box Score". The site gets this state from the data.
- **Game Players from HHG:** the Import adds the Players that HHG lists. A Manager adds the other Players.
- **BenchApp as a source:** BenchApp has each Game from Winter 2021-22, with the date, opponent, rink, side, type, and score. Troy confirmed on 2026-11-16:
  - The side of Ice Pak comes from BenchApp. Only the Games before Winter 2021-22 have no side.
  - The Games after March 2025 come from BenchApp, with the final score. A BenchApp score of 0–0 means no score, and the Game has No Box Score.
  - The "Tournament" Games of MIC Summer '26 are playoff Games.
  - When a Game has no Game Players from the Old Site or HHG, the Players with "In" in BenchApp are the Game Players.
- **Old data rules, confirmed by Troy on 2026-11-16:**
  - When the Old Site has no goals for a Game, the goals and penalties come from BenchApp.
  - The final score comes from BenchApp when it has one, because some Box Scores miss goals.
  - A shootout goal does not count in the stats. The Game gets a shootout mark.
  - The past League Seasons get their Rosters from BenchApp: regular players as full-time, goalies as goalies, and spares as sub-only. The Fee Sheet League Seasons and County Winter '26-27 keep the Rosters of the Managers.
- **Delete a Player:** a Manager can delete a Player from the Player Bank. A Player with a Game, a goal, an assist, or a penalty stays, because the stats need the Player.
- **League Seasons from BenchApp:** "2026 Summer (MIC)", from March to July 2026, is MIC Spring '26. MIC Winter '26 is the coming League Season, from January 2027. "2026 Summer (Mammoth)" from 2026-07-28 to 2026-11-15 is MIC Summer '26; its earlier events are copies of MIC Spring '26. "2026 Summer (County)" is County Summer '26. "26-27 County (Winter)" is County Winter '26-27.
- **HHG dates:** the HHG game `bluedevils_01252025` is the Game of 2026-01-25. On 2026-11-08 the team played two Games, and only the Night Owls Game has a video.
- **Same game from two sources:** an HHG Import replaces the goals and penalties of that Game. It matches the Game by date and opponent.
- **Grouping:** each Game belongs to one League Season. Stats show all time and each League Season. The header shows the record of each current League Season. Troy confirmed on 2026-11-16 that the site has no year grouping: HHG is only the app that makes the videos and reads the stats.

## Scoresheets

- **GameSheet PDF:** the PDF has readable text. The site fills the Box Score from it, and a Manager confirms it.
- **Photo:** the site stores the photo, and a Manager types the Box Score. A vision model is not used in version 1.
- **No scraper:** GameSheet's box score data needs a login, and its terms forbid scripts.
- **Backlog:** about 200 Scoresheet images are on Imgur, with the links in the BenchApp chat. Troy puts the links in one text file. A command on his Mac downloads each image and attaches it to its Game by date.
- **Chat review, 2026-11-16:** the 13 Ice Pak chat rooms from Winter 2021-22 have 149 images: 143 attachments and 6 Imgur links. 51 of them are Scoresheets or box score images for 48 Games. `backups/benchapp/scoresheets-from-chat.csv` lists them with the matched Game. BenchApp refused access to 3 older rooms, from before Winter 2021-22. The other Imgur links are not in these rooms.
- **Sheet Only:** a Game with a Scoresheet and no Box Score shows this state until a Manager types the Box Score.
- **Storage:** 200 files at 6.4 MB each use 1.3 GB of the free 10 GB.

## Manager tools

- **Player Bank:** each person the team can draw on, with a position, the last League Season played, and a Manager note.
- **Priority Tiers:** core, regular sub, and occasional sub. Only Managers see them. A Manager orders the players inside a tier. One list serves both Leagues.
- **Roster Builder:** the Roster Answers are full-time, part-time, sub only, and out. A Manager sets answers on a board; this is the main path. Players can also answer on the Team Page. The builder shows the count against a Target Count by position, the fee at that count, and a chase message to paste into BenchApp. The site sends no messages.
- **Jerseys:** for each player, the number, the size, and "has it" and "paid" for each Kit.
- **Team Fund:** a ledger of income and expenses. The Team Page shows the balance, and only Managers see the lines.

## Fees

- **Formula, from the Fee Sheet:** the Full-Time Fee is the League Fee divided by (full-time count + half of the part-time count). The full-time count has a minimum of 12. The Part-Time Fee is half of the Full-Time Fee. A Goalie pays $0.
- **Rounding:** each fee rounds up to the nearest cent.
- **Fee Lock:** the site proposes the fee, and a Manager locks it at the start of the League Season. A later surplus goes to the Team Fund.
- **Balance:** each player has one Balance across all Leagues. A credit in one League reduces a debt in another.
- **Charges:** a Manager adds a Charge to a player's Balance with an amount and a note, for example a Sub fee or a jersey. The form has a default Sub amount. The site does not calculate fees from games played.
- **Payments for now:** a Manager records each Payment as a line with a date, an amount, and a method.
- **Opening Payments:** the open balances of the Fee Sheet move to the site. Each "total paid" becomes one Opening Payment.
- **Why not BenchApp:** the team never used BenchApp for payments, and BenchApp splits a team into separate seasons.

## Player payments

This part is last. It starts after the team agrees.

- **Team Account:** a bank account for the team as an association with an EIN. Troy and Christiaan are the signers.
- **Method:** bank payment only. A card costs about four times more, and Cloudflare's free terms forbid the collection of credit card data.
- **First candidate:** Stripe bank transfer (ACH). The fee is 0.8%, which is $28 on a $3,500 League Fee. The site adds the fee to each Player Fee.
- **Second candidate:** Zelle to the Team Account, with a transaction feed that the site reads. The fee is $0. A feed is tested on the real account before the selection.
- **Rejected:** Venmo and Cash App with email reading. It costs $0, but it is not an official interface and the money stays in a personal account.
- **Risks of Stripe:** a payer can dispute a bank transfer for 60 days. Stripe restricts payments for services "you did not provide", and the team passes the money to the rink.
- **Yearly duty:** a club can declare itself a 501(c)(7) social club and file Form 990-N each year.

## Order of work

1. **First part, before early January 2027:** the Manager login, the Player Bank, the Roster Builder, and the fee formula. The next Mammoth League Season starts in early January. The first deploy of this part replaces the Old Site.
2. **Public site:** Themes, the old games, stats, the HHG Import, the shop link, and the next games.
3. **Game entry:** the Game form, Scoresheet upload, and the GameSheet PDF reader.
4. **The rest of the Fee Sheet:** Balances, the Team Page, Payment lines, and the Team Fund.
5. **Jerseys.**
6. **Player payments.**

## Not verified

- The Utah registration, sales tax, and income tax rules for an association.
- The yearly Form 1120 duty when a team claims no tax exemption.
- The user limit of the Cloudflare Access free plan. The plan page says "teams under 50 users".
- That a redirect to a hosted checkout is allowed by Cloudflare's free terms.
- That a bank transaction feed shows the sender's name for a Zelle payment.
- A real staff login on the Old Site after the patch.

## Tasks for Troy

- Change or delete the Stripe webhook secret. The old value is in the git history.
- Send the pitch to Christiaan.
- Create the Printful Quick Store.
- Add the HHG Game File output to HHG, from the field list.
- Put the Imgur links in one text file.
- Check the Utah rules before the EIN application.
- Ask Christiaan to test the Manager login at `https://icepakhockey.com/manager`. Troy's login worked on 2026-11-16.
- Enable R2 in the Cloudflare dashboard. Scoresheet upload needs it.
- Disconnect or delete the Vercel project. It still builds each push to `main`.
