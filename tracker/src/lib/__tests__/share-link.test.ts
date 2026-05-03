import { describe, expect, it } from "vitest";
import { decodeState, encodeState, readStateFromQuery } from "../share-link";
import type { AppState } from "../types";

const sample: AppState = {
  v: 1,
  metrics: [
    {
      id: "m1",
      name: "Qualified leads / week",
      unit: "leads",
      direction: "increase",
      baseline: 4,
      target: 25,
      cadence: "weekly",
      startDate: "2025-01-01",
      updatedAt: 0,
      checkIns: [
        { date: "2025-01-08", value: 6 },
        { date: "2025-01-15", value: 9, note: "ran the new playbook" },
        { date: "2025-01-22", value: 14 },
      ],
    },
  ],
};

describe("share-link encoding", () => {
  it("round-trips an AppState through encode/decode", () => {
    const token = encodeState(sample);
    expect(typeof token).toBe("string");
    expect(token.length).toBeGreaterThan(0);
    // base64url alphabet
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
    const decoded = decodeState<AppState>(token);
    expect(decoded).toEqual(sample);
  });

  it("readStateFromQuery extracts and decodes the `s` param", () => {
    const token = encodeState(sample);
    const decoded = readStateFromQuery<AppState>(`?s=${token}`);
    expect(decoded).toEqual(sample);
  });

  it("readStateFromQuery returns null when there is no token", () => {
    expect(readStateFromQuery("")).toBeNull();
    expect(readStateFromQuery("?other=1")).toBeNull();
  });

  it("readStateFromQuery returns null on garbage tokens", () => {
    expect(readStateFromQuery("?s=not_a_real_token_!!!")).toBeNull();
  });

  it("handles deeply nested + special characters in values", () => {
    const weird: AppState = {
      v: 1,
      metrics: [
        {
          id: "m\u00e9",
          name: "✓ done — \"quoted\" & <html>",
          unit: "%",
          direction: "decrease",
          baseline: 100,
          target: 0,
          cadence: "monthly",
          startDate: "2024-12-31",
          updatedAt: 0,
          checkIns: [{ date: "2025-01-31", value: 73.5, note: "newline\nhere" }],
        },
      ],
    };
    const token = encodeState(weird);
    expect(decodeState<AppState>(token)).toEqual(weird);
  });
});
