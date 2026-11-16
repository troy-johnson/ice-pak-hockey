# Ice Pak Site — Domain Glossary

The website of the Ice Pak hockey team: the public home of the game videos and stats, and the Managers' tools for rosters, fees, and games.

## People

**Player**: A person in the Player Bank. A Player is one person across Leagues and League Seasons.
_Avoid_: User, Member

**Manager**: A person who logs in to run the team: rosters, fees, and game entry.
_Avoid_: Admin, Staff, Assistant Manager

**Player Bank**: All Players the team can draw on: current players, past players, and Subs.
_Avoid_: Player pool, Player list, Bench

**Priority Tier**: A Manager-only rank of a Player for open roster spots: core, regular sub, or occasional sub. A Manager orders the Players inside a tier.
_Avoid_: Priority list, Depth chart

## Leagues and rosters

**League**: A competition the team plays in, such as MIC (Mammoth Ice Center) or County.
_Avoid_: Division, Rink

**League Season**: One run of one League, such as MIC Winter '26. It is the unit for Rosters, fees, and Games.
_Avoid_: Season (alone), Session

**HHG Season**: The August-to-July year that HHG uses, written 2026-2027. The site uses it only to group stats by year.
_Avoid_: Year, Season (alone)

**Roster**: The Players of one League Season, each with a Roster Status.
_Avoid_: Team list, Lineup

**Roster Status**: A Player's standing in one League Season: Full-Time, Part-Time, Goalie, or Sub. A Manager sets Goalie for each League Season, because a Player can be a goalie in one League and a skater in another. A Sub has a status and is not on the Roster.
_Avoid_: Player type, Half (for Part-Time)

**Sub**: A Player who is not on the Roster and fills in for single games. A Sub pays a Charge for each game, not a Player Fee. HHG uses "Sub" for a rostered part-time player; on the site that is Part-Time.
_Avoid_: Spare, Fill-in

**Roster Builder**: The Manager tool that turns the Player Bank into the Roster of a coming League Season.
_Avoid_: Signup, Registration

**Roster Answer**: A Player's reply for a coming League Season: full-time, part-time, sub only, out, or no answer.
_Avoid_: RSVP, Response, Vote

**Target Count**: The number of Players by position that the Managers want on a Roster. The site shows it and does not enforce it.
_Avoid_: Roster limit, Cap

**Game Players**: The Players who played in one Game.
_Avoid_: Roster (for one game), Lineup

## Money

**League Fee**: The total that the team pays the rink or organizer for one League Season.
_Avoid_: Registration fee, Ice fee

**Player Fee**: A Player's share of a League Fee, set by Roster Status. The Full-Time Fee is the full share, the Part-Time Fee is half of it, and a Goalie pays nothing.
_Avoid_: Dues, League fee (for one player's share)

**Fee Lock**: The Manager's act that makes the Player Fees of a League Season final.
_Avoid_: Freeze, Finalize

**Charge**: An amount a Manager adds to a Player's Balance with a note, such as a Sub fee or a jersey.
_Avoid_: Other fee, Line item

**Payment**: Money received from a Player, recorded with a date, an amount, and a method.
_Avoid_: Transaction, Reimbursement

**Opening Payment**: One Payment that carries a Player's "total paid" from the Fee Sheet to the site.
_Avoid_: Opening balance, Migration payment

**Balance**: What a Player owes: all Player Fees and Charges minus all Payments. A Player has one Balance across all Leagues.
_Avoid_: Amount due, Total owed

**Shortfall**: The part of a League Fee that the Players have not yet paid back. A negative Shortfall is a surplus.
_Avoid_: Deficit, Manager balance

**Team Fund**: The team's shared money, kept as a ledger of income and expenses.
_Avoid_: Communal account, Kitty, Slush fund

**Team Account**: The bank account in the team's name that receives Payments and pays League Fees.
_Avoid_: Ice Pak account, Communal account

**Fee Sheet**: The Google Sheet "Ice Pak Fee Tracker" that the site replaces.
_Avoid_: Spreadsheet, Tracker

## Games

**Game**: One game of the team, in one League Season, against one opponent.
_Avoid_: Match, Event

**Box Score**: The site's record of a Game: the final score, the goals with scorer and assists, and the penalties.
_Avoid_: Game Sheet (HHG's word for its own record), Stats (for one game)

**Scoresheet**: The official sheet of a Game, as a phone photo of the paper or as a GameSheet PDF.
_Avoid_: Game sheet, Score sheet

**GameSheet PDF**: A Scoresheet in PDF form from GameSheet, the scoring service that the MIC League uses. It has readable text.
_Avoid_: Game sheet, Digital sheet

**Sheet Only**: The state of a Game that has a Scoresheet and no Box Score.
_Avoid_: Pending, Draft

**Calendar Feed**: The BenchApp calendar of the team's games. It gives the date, opponent, and rink of each Game.
_Avoid_: Schedule, ICS

**HHG**: The Hockey Highlight Generator, the separate pipeline that makes the videos. Its data is read-only for the site.
_Avoid_: The pipeline, Highlight app

**HHG Game File**: The JSON file that HHG writes for one game, with the teams, score, goals, penalties, players, and video links.
_Avoid_: Export, Game data

**Import**: The command that reads an HHG Game File into the site. It replaces the goals and penalties of that Game.
_Avoid_: Sync, Publish

**Recap**: HHG's main video for one game.
_Avoid_: Highlight video

**Short**: HHG's vertical video of one goal or play.
_Avoid_: Reel, Clip

## Site

**Theme**: One of the three looks of the site: Home, Away, or Third. Each Theme matches a Kit.
_Avoid_: Mode, Skin

**Kit**: One of the team's three jerseys: home (dark blue), away (white), or third (red).
_Avoid_: Uniform, Sweater

**Team Page**: The page for Players, behind the Team Passcode. It shows Balances and takes Roster Answers.
_Avoid_: Player portal, Dashboard

**Team Passcode**: The one shared code that opens the Team Page. Players have no accounts.
_Avoid_: Password, Login

**Old Site**: The Next.js site that ran at icepakhockey.com until the rebuild replaced it on 2026-11-15.
_Avoid_: Legacy app, Current site
