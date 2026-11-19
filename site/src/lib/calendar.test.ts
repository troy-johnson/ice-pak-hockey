import { describe, expect, it } from "vitest";
import { feedGames, opponentKey, parseFeed, rinkName, teams } from "./calendar";

// Two events in the form of the BenchApp feed, with the folded lines and the escapes.
const FEED = [
  "BEGIN:VCALENDAR",
  "X-WR-TIMEZONE:America/Boise",
  "BEGIN:VEVENT",
  "UID:3486924@benchapp.com",
  "DTSTART;TZID=America/Boise:20260825T231500",
  "SUMMARY:Ice Pak vs. Blue Devils",
  "DESCRIPTION:Home: Blue Devils\\nVisitor: Ice Pak\\n\\nGame Link:\\nhttps://team",
  " s.gamesheet.app/teams/x/schedule",
  "LOCATION:Mammoth Ice Center - South Rink\\nUtah Mammoth Ice Center\\, 9",
  " 000 S State Street\\, Sandy\\, UT\\, USA",
  "END:VEVENT",
  "BEGIN:VEVENT",
  "UID:3747391@benchapp.com",
  "DTSTART;TZID=America/Boise:20261122T153000",
  "SUMMARY:Ice Pak vs. Ghost Pirates",
  "LOCATION:Salt Lake City Sports Complex-East Sheet\\nSalt Lake City Sports Co",
  " mplex\\, Guardsman Way\\, Salt Lake City\\, UT\\, USA",
  "END:VEVENT",
  "BEGIN:VTIMEZONE",
  "DTSTART:20261101T020000",
  "END:VTIMEZONE",
  "END:VCALENDAR",
].join("\r\n");

describe("parseFeed", () => {
  it("reads the events, with the folded lines and the escapes", () => {
    const events = parseFeed(FEED);

    expect(events).toHaveLength(2);
    expect(events[0]).toMatchObject({ benchappEventId: 3486924, startsAt: "2026-08-25 23:15" });
    expect(events[0].location).toBe("Mammoth Ice Center - South Rink\nUtah Mammoth Ice Center, 9000 S State Street, Sandy, UT, USA");
    expect(events[0].description.startsWith("Home: Blue Devils\nVisitor: Ice Pak")).toBe(true);
  });

  it("changes a UTC time to Utah time", () => {
    const [event] = parseFeed("BEGIN:VEVENT\nUID:1@benchapp.com\nDTSTART:20261123T013000Z\nEND:VEVENT");
    expect(event.startsAt).toBe("2026-11-22 18:30");
  });
});

describe("teams", () => {
  it("uses Home and Visitor in the description first", () => {
    expect(teams({ summary: "Ice Pak vs. Blue Devils", description: "Home: Blue Devils\nVisitor: Ice Pak" })).toEqual({
      opponent: "Blue Devils",
      side: "away",
    });
  });

  it("reads the summary as visitor vs. home", () => {
    // BenchApp has Ice Pak at home against Rat Pack on 2026-10-04, and away at Ghost Pirates on 2026-11-22.
    expect(teams({ summary: "Rat Pack vs. Ice Pak", description: "" })).toEqual({ opponent: "Rat Pack", side: "home" });
    expect(teams({ summary: "Ice Pak vs. Ghost Pirates", description: "" })).toEqual({ opponent: "Ghost Pirates", side: "away" });
  });

  it("gives no opponent for an event that is not a Game", () => {
    expect(teams({ summary: "Team party", description: "" })).toEqual({ opponent: null, side: null });
  });
});

describe("rinkName", () => {
  it("knows the rinks of the feed", () => {
    expect(rinkName("Salt Lake City Sports Complex-West Sheet")).toBe("SLC Sports Complex");
    expect(rinkName("County Ice Center\nCounty Ice Center, Murray Park Lane, Murray, UT, USA")).toBe("County Ice Center");
    expect(rinkName("Acord Ice Center")).toBe("West Valley Acord Ice Center");
    expect(rinkName("North Rink")).toBe("Mammoth Ice Center");
    expect(rinkName("Somewhere else")).toBeNull();
  });
});

describe("feedGames", () => {
  it("gives the Games of the feed", () => {
    expect(feedGames(FEED)[1]).toEqual({
      uid: "3747391@benchapp.com",
      benchappEventId: 3747391,
      startsAt: "2026-11-22 15:30",
      opponent: "Ghost Pirates",
      side: "away",
      rink: "SLC Sports Complex",
    });
  });
});

describe("opponentKey", () => {
  it("matches the names of one team", () => {
    expect(opponentKey("Puck off")).toBe(opponentKey("Puck Off"));
    expect(opponentKey("The Yetis")).toBe(opponentKey("Yetis"));
    expect(opponentKey("Flyers (Orange or White)")).toBe("flyers");
  });
});
