import type { CheckIn, HealthLabel, Metric } from "./types";

/**
 * Pure math helpers for the Rate-of-Improvement tracker.
 *
 * Conventions:
 *   - All calcs assume `metric.checkIns` is sorted ascending by date.
 *   - "Improvement" is signed relative to `metric.direction`:
 *       direction = "increase"  -> improvement = value - baseline
 *       direction = "decrease"  -> improvement = baseline - value
 *     A positive improvement always means "moving toward the target".
 *   - Slope is computed in *units per day* across the trailing window so
 *     the classifier doesn't depend on cadence.
 */

const MS_PER_DAY = 86_400_000;

export function dayDiff(aISO: string, bISO: string): number {
  const a = Date.parse(`${aISO}T00:00:00Z`);
  const b = Date.parse(`${bISO}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return (b - a) / MS_PER_DAY;
}

/** Signed improvement relative to baseline given the metric direction. */
export function improvementFromBaseline(metric: Metric, value: number): number {
  return metric.direction === "increase"
    ? value - metric.baseline
    : metric.baseline - value;
}

/** Total signed distance from baseline → target (always positive when valid). */
export function totalDistance(metric: Metric): number {
  const d =
    metric.direction === "increase"
      ? metric.target - metric.baseline
      : metric.baseline - metric.target;
  return d;
}

/** % of the way from baseline to target (0–100, can exceed 100 or go negative). */
export function percentImprovement(metric: Metric): number {
  const last = lastValue(metric);
  if (last === null) return 0;
  const total = totalDistance(metric);
  if (total === 0) return 0;
  return (improvementFromBaseline(metric, last) / total) * 100;
}

export function lastValue(metric: Metric): number | null {
  if (metric.checkIns.length === 0) return null;
  return metric.checkIns[metric.checkIns.length - 1].value;
}

/**
 * Linear regression slope over the trailing `window` check-ins.
 *
 * Returns slope in *signed-improvement units per day*. Positive means improving,
 * negative means regressing, 0 means flat. Returns null when there isn't enough
 * data (need at least 2 points spanning a non-zero time range).
 */
export function trailingSlope(
  metric: Metric,
  window = 4,
): number | null {
  const all = metric.checkIns;
  if (all.length < 2) return null;
  const points = all.slice(-Math.max(2, window));
  if (points.length < 2) return null;

  const x0 = Date.parse(`${points[0].date}T00:00:00Z`) / MS_PER_DAY;
  const xs: number[] = [];
  const ys: number[] = [];
  for (const p of points) {
    const x = Date.parse(`${p.date}T00:00:00Z`) / MS_PER_DAY - x0;
    const y = improvementFromBaseline(metric, p.value);
    xs.push(x);
    ys.push(y);
  }

  const n = xs.length;
  const meanX = xs.reduce((s, v) => s + v, 0) / n;
  const meanY = ys.reduce((s, v) => s + v, 0) / n;

  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    num += dx * (ys[i] - meanY);
    den += dx * dx;
  }
  if (den === 0) return null;
  return num / den;
}

/**
 * Period-over-period rate of change, expressed as the per-period delta in
 * signed-improvement units. Useful for the chart's secondary series.
 */
export function periodRates(metric: Metric): { date: string; rate: number }[] {
  const out: { date: string; rate: number }[] = [];
  for (let i = 1; i < metric.checkIns.length; i++) {
    const prev = metric.checkIns[i - 1];
    const cur = metric.checkIns[i];
    out.push({
      date: cur.date,
      rate:
        improvementFromBaseline(metric, cur.value) -
        improvementFromBaseline(metric, prev.value),
    });
  }
  return out;
}

/**
 * Classify the trajectory of the trailing window.
 *
 * - "insufficient_data": fewer than 3 check-ins.
 * - "stalled": trailing slope is ~0 AND we haven't reached the target.
 * - "tapering": improving overall but the slope is *decelerating* — the
 *    later half of the window has a smaller slope than the earlier half.
 * - "accelerating": improving AND the later half's slope is larger than
 *    the earlier half's slope.
 * - "stable": improving with no meaningful change in slope, or already at/over target.
 *
 * `flatTolerance` is in signed-improvement-units per day.
 */
export function classifyHealth(
  metric: Metric,
  windowSize = 4,
  flatTolerance = 1e-6,
): HealthLabel {
  const all = metric.checkIns;
  if (all.length < 3) return "insufficient_data";

  const overallSlope = trailingSlope(metric, windowSize);
  if (overallSlope === null) return "insufficient_data";

  const lastV = lastValue(metric)!;
  const reachedTarget =
    metric.direction === "increase"
      ? lastV >= metric.target
      : lastV <= metric.target;

  if (Math.abs(overallSlope) <= flatTolerance) {
    return reachedTarget ? "stable" : "stalled";
  }

  if (overallSlope < 0) {
    // Net regression in the trailing window.
    return "tapering";
  }

  // Compare halves to detect acceleration vs deceleration.
  const window = all.slice(-Math.max(3, windowSize));
  const mid = Math.floor(window.length / 2);
  const earlier: Metric = { ...metric, checkIns: window.slice(0, mid + 1) };
  const later: Metric = { ...metric, checkIns: window.slice(mid) };
  const earlySlope = trailingSlope(earlier, earlier.checkIns.length);
  const lateSlope = trailingSlope(later, later.checkIns.length);

  if (earlySlope === null || lateSlope === null) return "stable";

  const delta = lateSlope - earlySlope;
  if (Math.abs(delta) <= flatTolerance) return "stable";
  return delta > 0 ? "accelerating" : "tapering";
}

/**
 * Project the date when the metric is expected to reach `target`, based on the
 * trailing slope. Returns null when there isn't a meaningful positive slope or
 * the target is already met.
 *
 * Returns ISO date (YYYY-MM-DD).
 */
export function projectedCompletionDate(
  metric: Metric,
  windowSize = 4,
): string | null {
  const slope = trailingSlope(metric, windowSize);
  if (slope === null || slope <= 0) return null;
  const lastV = lastValue(metric);
  if (lastV === null) return null;

  const remaining =
    metric.direction === "increase"
      ? metric.target - lastV
      : lastV - metric.target;
  if (remaining <= 0) return null;

  const daysToGo = remaining / slope;
  if (!Number.isFinite(daysToGo) || daysToGo <= 0) return null;

  const lastDate = metric.checkIns[metric.checkIns.length - 1].date;
  const lastMs = Date.parse(`${lastDate}T00:00:00Z`);
  if (Number.isNaN(lastMs)) return null;

  const targetMs = lastMs + daysToGo * MS_PER_DAY;
  const d = new Date(targetMs);
  return d.toISOString().slice(0, 10);
}

/** Build a chart-ready series with cumulative improvement + per-period rate. */
export function buildSeries(metric: Metric): {
  date: string;
  value: number;
  improvement: number;
  rate: number | null;
}[] {
  const series: ReturnType<typeof buildSeries> = [];
  for (let i = 0; i < metric.checkIns.length; i++) {
    const c = metric.checkIns[i];
    const improvement = improvementFromBaseline(metric, c.value);
    const rate =
      i === 0
        ? null
        : improvement -
          improvementFromBaseline(metric, metric.checkIns[i - 1].value);
    series.push({ date: c.date, value: c.value, improvement, rate });
  }
  return series;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function addCheckIn(metric: Metric, c: CheckIn): Metric {
  const next = [...metric.checkIns.filter((x) => x.date !== c.date), c];
  next.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  return { ...metric, checkIns: next, updatedAt: Date.now() };
}

export function healthLabelText(h: HealthLabel): string {
  switch (h) {
    case "accelerating":
      return "Accelerating";
    case "stable":
      return "Stable";
    case "tapering":
      return "Tapering";
    case "stalled":
      return "Stalled";
    case "insufficient_data":
      return "Need more data";
  }
}

export function healthDescription(h: HealthLabel): string {
  switch (h) {
    case "accelerating":
      return "Your rate of improvement is increasing — the curve is bending the right way.";
    case "stable":
      return "Improving at a steady pace. Look for ways to bend the curve up.";
    case "tapering":
      return "Improvement is slowing. Time to inspect the bottleneck or change the approach.";
    case "stalled":
      return "No measurable movement in the trailing window. The intervention may be exhausted.";
    case "insufficient_data":
      return "Log at least three check-ins to see a trajectory classification.";
  }
}
