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
- **Themes:** Home (dark blue), Away (white and dark blue), and Third (red on black). A new visitor gets Home or Away from the device setting. A switch changes the Theme, and the browser keeps the choice.
- **Next games:** a short list with the date, opponent, rink, and League, from the Calendar Feed. The site has no full schedule page and no attendance, because BenchApp has those.
- **Dropped:** news posts, comments, text alerts, player logins, contact data, and the custom shop checkout.

## Technology

- **Code:** a rebuild in this repo, on the `rebuild` branch.
- **Switch:** the new site replaces the Old Site at icepakhockey.com with its first deploy. There is no separate address. Troy accepts a half-built site in the meantime. The Old Site code is deleted at that deploy.
- **Domain:** Cloudflare has the DNS of icepakhockey.com. The apex and `www` point to Vercel now, and the switch points them to the Worker.
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
- **League of a Game:** the rink sets it, and a Manager can change it. Mammoth Ice Center gives MIC. County Ice Center and Salt Lake City Sports Complex give County.
- **Same game from two sources:** an HHG Import replaces the goals and penalties of that Game. It matches the Game by date and opponent.
- **Grouping:** each Game belongs to one League Season. Stats show all time, each HHG Season, and each League Season.

## Scoresheets

- **GameSheet PDF:** the PDF has readable text. The site fills the Box Score from it, and a Manager confirms it.
- **Photo:** the site stores the photo, and a Manager types the Box Score. A vision model is not used in version 1.
- **No scraper:** GameSheet's box score data needs a login, and its terms forbid scripts.
- **Backlog:** about 200 Scoresheet images are on Imgur, with the links in the BenchApp chat. Troy puts the links in one text file. A command on his Mac downloads each image and attaches it to its Game by date.
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
