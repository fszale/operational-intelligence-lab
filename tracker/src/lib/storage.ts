import type { AppState, Metric } from "./types";

const STORAGE_KEY = "oi-tracker:v1";

const EMPTY_STATE: AppState = { metrics: [], v: 1 };

function safeParse(raw: string | null): AppState {
  if (!raw) return { ...EMPTY_STATE };
  try {
    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!parsed || !Array.isArray(parsed.metrics)) return { ...EMPTY_STATE };
    return { metrics: parsed.metrics as Metric[], v: 1 };
  } catch {
    return { ...EMPTY_STATE };
  }
}

export function loadState(): AppState {
  if (typeof window === "undefined") return { ...EMPTY_STATE };
  return safeParse(window.localStorage.getItem(STORAGE_KEY));
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearState(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function makeId(): string {
  // Lightweight unique id. crypto.randomUUID isn't on every Node test env.
  return `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function sortCheckIns(metric: Metric): Metric {
  const checkIns = [...metric.checkIns].sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0,
  );
  return { ...metric, checkIns };
}

export function upsertMetric(state: AppState, metric: Metric): AppState {
  const idx = state.metrics.findIndex((m) => m.id === metric.id);
  const next = sortCheckIns({ ...metric, updatedAt: Date.now() });
  const metrics =
    idx >= 0
      ? state.metrics.map((m, i) => (i === idx ? next : m))
      : [...state.metrics, next];
  return { ...state, metrics };
}

export function removeMetric(state: AppState, id: string): AppState {
  return { ...state, metrics: state.metrics.filter((m) => m.id !== id) };
}
