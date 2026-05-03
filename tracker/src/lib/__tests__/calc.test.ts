import { describe, expect, it } from "vitest";
import {
  buildSeries,
  classifyHealth,
  improvementFromBaseline,
  lastValue,
  percentImprovement,
  periodRates,
  projectedCompletionDate,
  trailingSlope,
  totalDistance,
} from "../calc";
import type { Metric } from "../types";

function make(
  partial: Partial<Metric> & { checkIns: { date: string; value: number }[] },
): Metric {
  return {
    id: "m1",
    name: "Test",
    unit: "leads/wk",
    direction: "increase",
    baseline: 0,
    target: 100,
    cadence: "weekly",
    startDate: "2025-01-01",
    updatedAt: 0,
    ...partial,
  };
}

describe("improvementFromBaseline", () => {
  it("is positive when increase metric goes up", () => {
    const m = make({ baseline: 10, target: 50, checkIns: [] });
    expect(improvementFromBaseline(m, 25)).toBe(15);
  });

  it("is positive when decrease metric goes down", () => {
    const m = make({
      direction: "decrease",
      baseline: 50,
      target: 10,
      checkIns: [],
    });
    expect(improvementFromBaseline(m, 30)).toBe(20);
  });

  it("is negative when moving the wrong way", () => {
    const m = make({ baseline: 10, target: 50, checkIns: [] });
    expect(improvementFromBaseline(m, 5)).toBe(-5);
  });
});

describe("totalDistance & percentImprovement", () => {
  it("computes total distance for increase + decrease metrics", () => {
    const inc = make({ baseline: 0, target: 100, checkIns: [] });
    expect(totalDistance(inc)).toBe(100);
    const dec = make({
      direction: "decrease",
      baseline: 200,
      target: 50,
      checkIns: [],
    });
    expect(totalDistance(dec)).toBe(150);
  });

  it("returns 0 percent improvement when no check-ins", () => {
    const m = make({ baseline: 0, target: 100, checkIns: [] });
    expect(percentImprovement(m)).toBe(0);
  });

  it("returns 0 when baseline equals target (degenerate)", () => {
    const m = make({
      baseline: 50,
      target: 50,
      checkIns: [{ date: "2025-01-08", value: 60 }],
    });
    expect(percentImprovement(m)).toBe(0);
  });

  it("returns 50 when halfway to target", () => {
    const m = make({
      baseline: 0,
      target: 100,
      checkIns: [{ date: "2025-01-08", value: 50 }],
    });
    expect(percentImprovement(m)).toBe(50);
  });
});

describe("lastValue", () => {
  it("returns null for empty", () => {
    expect(lastValue(make({ checkIns: [] }))).toBeNull();
  });
  it("returns the last reading", () => {
    expect(
      lastValue(
        make({
          checkIns: [
            { date: "2025-01-01", value: 10 },
            { date: "2025-01-08", value: 20 },
          ],
        }),
      ),
    ).toBe(20);
  });
});

describe("trailingSlope", () => {
  it("returns null for fewer than 2 points", () => {
    expect(trailingSlope(make({ checkIns: [] }))).toBeNull();
    expect(
      trailingSlope(make({ checkIns: [{ date: "2025-01-01", value: 5 }] })),
    ).toBeNull();
  });

  it("returns null when all points share a date (zero variance in x)", () => {
    const m = make({
      checkIns: [
        { date: "2025-01-01", value: 1 },
        { date: "2025-01-01", value: 9 },
      ],
    });
    expect(trailingSlope(m)).toBeNull();
  });

  it("computes a positive slope for an improving series", () => {
    // baseline=0, +5 per week (7 days) -> slope ≈ 5/7 per day
    const m = make({
      checkIns: [
        { date: "2025-01-01", value: 0 },
        { date: "2025-01-08", value: 5 },
        { date: "2025-01-15", value: 10 },
        { date: "2025-01-22", value: 15 },
      ],
    });
    const s = trailingSlope(m, 4)!;
    expect(s).toBeGreaterThan(0);
    expect(s).toBeCloseTo(5 / 7, 4);
  });

  it("computes a negative slope for a regressing series", () => {
    const m = make({
      checkIns: [
        { date: "2025-01-01", value: 20 },
        { date: "2025-01-08", value: 15 },
        { date: "2025-01-15", value: 10 },
        { date: "2025-01-22", value: 5 },
      ],
    });
    const s = trailingSlope(m, 4)!;
    expect(s).toBeLessThan(0);
  });

  it("returns ~0 slope for a perfectly flat series", () => {
    const m = make({
      checkIns: [
        { date: "2025-01-01", value: 7 },
        { date: "2025-01-08", value: 7 },
        { date: "2025-01-15", value: 7 },
        { date: "2025-01-22", value: 7 },
      ],
    });
    const s = trailingSlope(m, 4)!;
    expect(Math.abs(s)).toBeLessThan(1e-9);
  });

  it("only considers the trailing window", () => {
    const m = make({
      checkIns: [
        { date: "2025-01-01", value: 0 },
        { date: "2025-01-08", value: 100 },
        { date: "2025-01-15", value: 100 },
        { date: "2025-01-22", value: 100 },
        { date: "2025-01-29", value: 100 },
      ],
    });
    expect(trailingSlope(m, 4)!).toBeCloseTo(0, 9);
  });
});

describe("classifyHealth", () => {
  it("returns insufficient_data for fewer than 3 check-ins", () => {
    expect(classifyHealth(make({ checkIns: [] }))).toBe("insufficient_data");
    expect(
      classifyHealth(
        make({
          checkIns: [
            { date: "2025-01-01", value: 1 },
            { date: "2025-01-08", value: 2 },
          ],
        }),
      ),
    ).toBe("insufficient_data");
  });

  it("classifies as accelerating when the curve bends up", () => {
    // gains: 1, 2, 4, 8 — accelerating
    const m = make({
      checkIns: [
        { date: "2025-01-01", value: 0 },
        { date: "2025-01-08", value: 1 },
        { date: "2025-01-15", value: 3 },
        { date: "2025-01-22", value: 7 },
        { date: "2025-01-29", value: 15 },
      ],
    });
    expect(classifyHealth(m, 4)).toBe("accelerating");
  });

  it("classifies as tapering when the curve bends down", () => {
    // gains: 8, 4, 2, 1 — decelerating but still positive
    const m = make({
      checkIns: [
        { date: "2025-01-01", value: 0 },
        { date: "2025-01-08", value: 8 },
        { date: "2025-01-15", value: 12 },
        { date: "2025-01-22", value: 14 },
        { date: "2025-01-29", value: 15 },
      ],
    });
    expect(classifyHealth(m, 4)).toBe("tapering");
  });

  it("classifies as stable when slope is steady and positive", () => {
    const m = make({
      checkIns: [
        { date: "2025-01-01", value: 0 },
        { date: "2025-01-08", value: 5 },
        { date: "2025-01-15", value: 10 },
        { date: "2025-01-22", value: 15 },
        { date: "2025-01-29", value: 20 },
      ],
    });
    expect(classifyHealth(m, 4)).toBe("stable");
  });

  it("classifies as stalled when flat and target not reached", () => {
    const m = make({
      target: 100,
      checkIns: [
        { date: "2025-01-01", value: 7 },
        { date: "2025-01-08", value: 7 },
        { date: "2025-01-15", value: 7 },
        { date: "2025-01-22", value: 7 },
      ],
    });
    expect(classifyHealth(m, 4)).toBe("stalled");
  });

  it("classifies as stable when flat AND target met", () => {
    const m = make({
      target: 7,
      checkIns: [
        { date: "2025-01-01", value: 7 },
        { date: "2025-01-08", value: 7 },
        { date: "2025-01-15", value: 7 },
      ],
    });
    expect(classifyHealth(m, 4)).toBe("stable");
  });

  it("classifies a net-regressing window as tapering", () => {
    const m = make({
      checkIns: [
        { date: "2025-01-01", value: 30 },
        { date: "2025-01-08", value: 25 },
        { date: "2025-01-15", value: 20 },
        { date: "2025-01-22", value: 15 },
      ],
    });
    expect(classifyHealth(m, 4)).toBe("tapering");
  });
});

describe("projectedCompletionDate", () => {
  it("returns null without enough data", () => {
    expect(projectedCompletionDate(make({ checkIns: [] }))).toBeNull();
  });

  it("returns null when slope is non-positive", () => {
    const m = make({
      checkIns: [
        { date: "2025-01-01", value: 5 },
        { date: "2025-01-08", value: 5 },
        { date: "2025-01-15", value: 5 },
      ],
    });
    expect(projectedCompletionDate(m, 4)).toBeNull();
  });

  it("returns null when target already reached", () => {
    const m = make({
      target: 10,
      checkIns: [
        { date: "2025-01-01", value: 0 },
        { date: "2025-01-08", value: 5 },
        { date: "2025-01-15", value: 12 },
      ],
    });
    expect(projectedCompletionDate(m, 4)).toBeNull();
  });

  it("projects a future date for a steady-improving series", () => {
    // baseline 0 -> +5 per 7 days. Last value 15, target 50, remaining 35.
    // slope = 5/7 per day -> 49 days -> 2025-01-22 + 49 = 2025-03-12
    const m = make({
      target: 50,
      checkIns: [
        { date: "2025-01-01", value: 0 },
        { date: "2025-01-08", value: 5 },
        { date: "2025-01-15", value: 10 },
        { date: "2025-01-22", value: 15 },
      ],
    });
    expect(projectedCompletionDate(m, 4)).toBe("2025-03-12");
  });

  it("respects direction=decrease (lower-is-better)", () => {
    // baseline 100, target 60. Linear -5 per 7 days -> last 85, remaining 25.
    // slope 5/7 per day -> 35 days -> 2025-01-22 + 35 = 2025-02-26
    const m = make({
      direction: "decrease",
      baseline: 100,
      target: 60,
      checkIns: [
        { date: "2025-01-01", value: 100 },
        { date: "2025-01-08", value: 95 },
        { date: "2025-01-15", value: 90 },
        { date: "2025-01-22", value: 85 },
      ],
    });
    expect(projectedCompletionDate(m, 4)).toBe("2025-02-26");
  });
});

describe("buildSeries & periodRates", () => {
  it("builds chart series with rate=null for the first point", () => {
    const m = make({
      checkIns: [
        { date: "2025-01-01", value: 0 },
        { date: "2025-01-08", value: 5 },
        { date: "2025-01-15", value: 8 },
      ],
    });
    const s = buildSeries(m);
    expect(s).toHaveLength(3);
    expect(s[0].rate).toBeNull();
    expect(s[1].rate).toBe(5);
    expect(s[2].rate).toBe(3);
  });

  it("periodRates skips the first point", () => {
    const m = make({
      checkIns: [
        { date: "2025-01-01", value: 0 },
        { date: "2025-01-08", value: 5 },
        { date: "2025-01-15", value: 8 },
      ],
    });
    expect(periodRates(m)).toEqual([
      { date: "2025-01-08", rate: 5 },
      { date: "2025-01-15", rate: 3 },
    ]);
  });
});
