export type Cadence = "daily" | "weekly" | "biweekly" | "monthly";

export type HealthLabel =
  | "accelerating"
  | "stable"
  | "tapering"
  | "stalled"
  | "insufficient_data";

export type Direction = "increase" | "decrease";

export interface CheckIn {
  /** ISO date string, YYYY-MM-DD. */
  date: string;
  /** Numeric reading. */
  value: number;
  /** Optional free-form note. */
  note?: string;
}

export interface Metric {
  id: string;
  name: string;
  unit: string;
  /** "increase" means higher is better, "decrease" means lower is better. */
  direction: Direction;
  baseline: number;
  target: number;
  cadence: Cadence;
  /** ISO date string, YYYY-MM-DD. */
  startDate: string;
  /** Sorted ascending by date when stored. */
  checkIns: CheckIn[];
  /** ms epoch — last time this metric was edited. */
  updatedAt: number;
}

export interface AppState {
  metrics: Metric[];
  /** schema version for forwards-compat on the share-link payload. */
  v: 1;
}
