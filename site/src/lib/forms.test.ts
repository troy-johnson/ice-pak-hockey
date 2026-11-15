import { describe, expect, it } from "vitest";
import { cents, count, date, dollars, text } from "./forms";

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [name, value] of Object.entries(fields)) data.set(name, value);
  return data;
};

describe("form readers", () => {
  it("trims text and gives an empty string for a missing field", () => {
    expect(text(form({ name: "  Ann " }), "name")).toBe("Ann");
    expect(text(form({}), "name")).toBe("");
  });

  it("reads a count, and gives 0 for wrong input", () => {
    expect(count(form({ n: "9" }), "n")).toBe(9);
    expect(count(form({ n: "-2" }), "n")).toBe(0);
    expect(count(form({ n: "many" }), "n")).toBe(0);
  });

  it("reads dollars as whole cents", () => {
    expect(cents(form({ fee: "3,500" }), "fee")).toBe(350000);
    expect(cents(form({ fee: "$255.18" }), "fee")).toBe(25518);
    expect(cents(form({ fee: "19.99" }), "fee")).toBe(1999);
    expect(cents(form({ fee: "" }), "fee")).toBe(0);
  });

  it("reads a date, and gives null for wrong input", () => {
    expect(date(form({ d: "2027-01-04" }), "d")).toBe("2027-01-04");
    expect(date(form({ d: "January" }), "d")).toBeNull();
  });
});

describe("dollars", () => {
  it("shows cents as a dollar amount", () => {
    expect(dollars(25518)).toBe("$255.18");
    expect(dollars(350000)).toBe("$3,500.00");
  });
});
