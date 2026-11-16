# Ice Pak Site — Agent Instructions

- **The site:** the Astro app in `site/`, on the `rebuild` branch. It is live at icepakhockey.com on Cloudflare. `site/AGENTS.md` has the Astro guidance.
- **Old Site:** its code is gone from the branch. The git tag `old-site` has it, as the reference for the old stats rules: `git show old-site:pages/api/season-stats/[id].js`.
- **`main`:** it still has the Old Site code, and Vercel builds each push to it. Keep the work on `rebuild` until Troy says to replace `main`.

## Read first

- **`CONTEXT.md`** is the glossary. Read it before you name a thing. Use its terms in code, page text, commits, and replies. Add a term in the same change that settles a new concept.
- **`docs/site-rebuild-decisions.md`** has the confirmed decisions, their reasons, and the order of work. Read it before a design choice. Ask Troy before you go against it.

## Live data and deploys

- **Production deploy:** `pnpm run deploy` in `site/` puts the working tree on icepakhockey.com immediately. There is no staging site. Run the tests and check the change on the local dev server first.
- **Production database:** a `wrangler d1` command with `--remote` reads and writes the live database. The local dev server uses a local database in `site/.wrangler/`.
- **Schema change:** run `pnpm run migrate:remote` before the deploy that needs the new schema.
- **Old Site database:** `.env` and `.env.local` point to the Supabase database of the Old Site. It is the source for the move of the old games. Send read requests only.

## Boundaries

- **Public repo:** keep secrets, emails, phone numbers, and Balances out of git. The Fee Sheet copy is in `.orca/drops/` and the Old Site database dump is in `backups/`; git ignores both.
- **HHG is read-only:** read `~/hockey/hockey.db`, the HHG repo, and the game folders on the NAS. Write to none of them.
- **Contact data:** the site stores names and public profile fields only. BenchApp has the emails and phone numbers.

## Site conventions

- **Money:** whole cents, as integers.
- **Domain rules:** pure functions in `site/src/lib/`, with the tests in a `*.test.ts` file beside them. Take each expected value from the Fee Sheet or from a confirmed decision.
- **Manager pages:** each page in `site/src/pages/manager/` sets `prerender = false`. The middleware lets only a signed-in Manager through, and a page with a prerender would skip that check.
- **Database:** each schema change is a new numbered file in `site/migrations/`. Leave an applied migration as it is.
- **Local database:** an empty local database gives "no such table". Run `pnpm run migrate:local` in `site/`, then load `backups/seed-player-bank.sql` with `wrangler d1 execute ice-pak --local --file`.
- **Local manager pages:** the dev server lets each manager request through, because it has no Cloudflare Access in front of it.
- **Player data:** a script that reads the Fee Sheet or a database dump writes its output to `backups/`.
