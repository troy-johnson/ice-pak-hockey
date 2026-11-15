# Ice Pak Site — Agent Instructions

This repo holds two codebases while the site is rebuilt.

- **Old Site:** the Next.js app at the repo root, live at icepakhockey.com from the `main` branch. Change it only for a security fix.
- **New site:** the Astro app in `site/`, on the `rebuild` branch. All new work goes here. `site/AGENTS.md` has the Astro guidance.

## Read first

- **`CONTEXT.md`** is the glossary. Read it before you name a thing. Use its terms in code, page text, commits, and replies. Add a term in the same change that settles a new concept.
- **`docs/site-rebuild-decisions.md`** has the confirmed decisions, their reasons, and the order of work. Read it before a design choice. Ask Troy before you go against it.

## Live data and deploys

- **Production database:** `.env` and `.env.local` point to the live database of the Old Site. A local run of the Old Site reads and writes live data, so send read requests only.
- **Production deploy:** a push to `main` deploys the Old Site on Vercel. Test an Old Site change first: push it to another branch and check the preview deployment.

## Boundaries

- **Public repo:** keep secrets, emails, phone numbers, and Balances out of git. The Fee Sheet copy is in `.orca/drops/`, which git ignores.
- **HHG is read-only:** read `~/hockey/hockey.db`, the HHG repo, and the game folders on the NAS. Write to none of them.
- **Contact data:** the new site stores names and public profile fields only. BenchApp has the emails and phone numbers.

## New site conventions

- **Money:** whole cents, as integers.
- **Domain rules:** pure functions in `site/src/lib/`, with the tests in a `*.test.ts` file beside them. Take each expected value from the Fee Sheet or from a confirmed decision.
