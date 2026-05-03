import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import {
  Area,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  ArrowRight,
  Pencil,
  Plus,
  Share2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  PauseCircle,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { loadState, saveState } from "@/lib/storage";
import { buildShareUrl, readStateFromQuery } from "@/lib/share-link";
import {
  buildSeries,
  classifyHealth,
  healthDescription,
  healthLabelText,
  lastValue,
  percentImprovement,
  projectedCompletionDate,
  trailingSlope,
} from "@/lib/calc";
import type { AppState, HealthLabel, Metric } from "@/lib/types";

export default function DashboardPage() {
  const [, params] = useRoute<{ id: string }>("/dashboard/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [state, setState] = useState<AppState>({ metrics: [], v: 1 });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [importedFromUrl, setImportedFromUrl] = useState(false);

  // Load state. If a `?s=` token is present, hydrate from it (read-only preview).
  useEffect(() => {
    const search = typeof window !== "undefined" ? window.location.search : "";
    const fromUrl = readStateFromQuery<AppState>(search);
    if (fromUrl && Array.isArray(fromUrl.metrics)) {
      setState(fromUrl);
      setImportedFromUrl(true);
      setActiveId(params?.id ?? fromUrl.metrics[0]?.id ?? null);
      return;
    }
    const local = loadState();
    setState(local);
    setActiveId(params?.id ?? local.metrics[0]?.id ?? null);
  }, [params?.id]);

  const active = useMemo<Metric | null>(() => {
    if (!activeId) return null;
    return state.metrics.find((m) => m.id === activeId) ?? null;
  }, [state, activeId]);

  const onCopyLink = async () => {
    const url = buildShareUrl(`dashboard/${active?.id ?? ""}`, state);
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Shareable link copied",
        description: "Anyone with this URL sees a snapshot of your tracker.",
      });
    } catch {
      window.prompt("Copy this URL:", url);
    }
  };

  const onSaveImport = () => {
    saveState(state);
    setImportedFromUrl(false);
    toast({ title: "Snapshot saved", description: "This data now lives in your browser." });
    setLocation(`/dashboard/${active?.id ?? ""}`);
  };

  if (state.metrics.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-1">
            Dashboard
          </p>
          <h1 className="text-3xl font-semibold">
            {active ? active.name : "Pick a metric"}
          </h1>
          {active ? (
            <p className="text-sm text-muted-foreground mt-1">
              {active.direction === "increase" ? "Higher is better" : "Lower is better"} ·
              baseline {active.baseline}
              {active.unit ? ` ${active.unit}` : ""} · target {active.target}
              {active.unit ? ` ${active.unit}` : ""}
            </p>
          ) : null}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={onCopyLink} data-testid="button-copy-link">
            <Share2 className="h-4 w-4" /> Copy shareable link
          </Button>
          {active ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href={`/setup/${active.id}`} data-testid="button-edit-metric">
                  <Pencil className="h-4 w-4" /> Edit
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/checkin/${active.id}`} data-testid="button-add-checkin">
                  <Plus className="h-4 w-4" /> Add check-in
                </Link>
              </Button>
            </>
          ) : null}
        </div>
      </div>

      {importedFromUrl ? (
        <Card className="border-primary/40 bg-primary/5">
          <CardContent className="py-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-sm">
              You&apos;re viewing a shared snapshot. Save it to your browser to keep editing.
            </div>
            <Button size="sm" onClick={onSaveImport} data-testid="button-save-snapshot">
              Save to my browser
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <MetricSwitcher
        metrics={state.metrics}
        activeId={activeId}
        onPick={setActiveId}
      />

      {active ? <MetricDashboard metric={active} /> : null}

      <Card>
        <CardContent className="py-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="font-medium">Curve not bending the way you want?</p>
            <p className="text-sm text-muted-foreground">
              The OI Lab works with operators on rate-of-improvement, not vanity dashboards.
            </p>
          </div>
          <Button asChild data-testid="button-cta-dashboard">
            <a href="https://solidcage.com" target="_blank" rel="noreferrer">
              Start your AI improvement journey
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricSwitcher({
  metrics,
  activeId,
  onPick,
}: {
  metrics: Metric[];
  activeId: string | null;
  onPick: (id: string) => void;
}) {
  if (metrics.length <= 1) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {metrics.map((m) => {
        const health = classifyHealth(m);
        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onPick(m.id)}
            data-testid={`tab-metric-${m.id}`}
            className={`group rounded-md border px-3 py-2 text-left text-sm transition-colors hover-elevate ${
              m.id === activeId
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border bg-card"
            }`}
          >
            <div className="font-medium">{m.name}</div>
            <div className="font-mono text-xs text-muted-foreground">
              {m.checkIns.length} check-ins · {healthLabelText(health)}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function MetricDashboard({ metric }: { metric: Metric }) {
  const series = buildSeries(metric);
  const last = lastValue(metric);
  const slope = trailingSlope(metric);
  const projected = projectedCompletionDate(metric);
  const pct = percentImprovement(metric);
  const health = classifyHealth(metric);

  const chartData = useMemo(() => {
    if (series.length === 0) return [];
    return series.map((p) => ({
      ...p,
      // For the area, we keep raw value; for the rate line, use the per-period rate.
      rateAbs: p.rate ?? null,
    }));
  }, [series]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          label="% to target"
          value={`${pct.toFixed(1)}%`}
          hint={
            last !== null
              ? `Last reading: ${last}${metric.unit ? ` ${metric.unit}` : ""}`
              : "No check-ins yet"
          }
        />
        <SummaryCard
          label="Trailing slope"
          value={
            slope === null
              ? "—"
              : `${slope >= 0 ? "+" : ""}${slope.toFixed(3)}/day`
          }
          hint="Linear fit, last 4 check-ins"
        />
        <SummaryCard
          label="Projected to hit target"
          value={projected ?? "—"}
          hint={projected ? "Based on current rate" : "Need a positive trend first"}
        />
        <HealthCard health={health} />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Rate-of-Improvement curve</CardTitle>
            <span className="text-xs font-mono text-muted-foreground">
              area = value · line = period rate
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              No data yet.
            </div>
          ) : (
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={chartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 8 }}
                >
                  <defs>
                    <linearGradient id="valueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="accelBand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    tickMargin={8}
                  />
                  <YAxis
                    yAxisId="left"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={11}
                    width={60}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="hsl(var(--accent))"
                    fontSize={11}
                    width={60}
                  />
                  <ChartTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      fontSize: 12,
                      fontFamily: "var(--app-font-mono)",
                    }}
                  />
                  {/* Acceleration band: shaded behind the rate line */}
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="rateAbs"
                    fill="url(#accelBand)"
                    stroke="none"
                    isAnimationActive={false}
                    name="Period rate"
                  />
                  {/* Main metric value */}
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#valueFill)"
                    isAnimationActive={false}
                    name={metric.unit || "Value"}
                  />
                  {/* Rate of change line */}
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="rateAbs"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{ r: 2 }}
                    isAnimationActive={false}
                    name="Period rate"
                  />
                  {/* Target reference */}
                  <ReferenceLine
                    yAxisId="left"
                    y={metric.target}
                    stroke="hsl(var(--primary))"
                    strokeDasharray="4 4"
                    label={{
                      value: `target ${metric.target}`,
                      position: "insideTopRight",
                      fill: "hsl(var(--primary))",
                      fontSize: 11,
                      fontFamily: "var(--app-font-mono)",
                    }}
                  />
                  <ReferenceLine
                    yAxisId="left"
                    y={metric.baseline}
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="2 6"
                    label={{
                      value: `baseline ${metric.baseline}`,
                      position: "insideBottomRight",
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 11,
                      fontFamily: "var(--app-font-mono)",
                    }}
                  />
                  <ReferenceLine
                    yAxisId="right"
                    y={0}
                    stroke="hsl(var(--accent))"
                    strokeDasharray="2 4"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          {metric.checkIns.length === 0 ? (
            <p className="text-sm text-muted-foreground">No check-ins yet.</p>
          ) : (
            <ul
              className="divide-y divide-border"
              data-testid="list-dashboard-checkins"
            >
              {[...metric.checkIns]
                .slice(-8)
                .reverse()
                .map((c) => (
                  <li
                    key={`${c.date}-${c.value}`}
                    className="py-3 flex items-start justify-between gap-4"
                  >
                    <div>
                      <p className="font-mono text-sm">{c.date}</p>
                      {c.note ? (
                        <p className="text-xs text-muted-foreground mt-1">
                          {c.note}
                        </p>
                      ) : null}
                    </div>
                    <p className="font-mono text-sm tabular-nums">
                      {c.value}
                      {metric.unit ? ` ${metric.unit}` : ""}
                    </p>
                  </li>
                ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function SummaryCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card>
      <CardContent className="py-5">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl font-semibold mt-1 tabular-nums">{value}</p>
        {hint ? (
          <p className="text-xs text-muted-foreground mt-1">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

function HealthCard({ health }: { health: HealthLabel }) {
  const meta: Record<HealthLabel, { icon: React.ReactNode; tone: string }> = {
    accelerating: {
      icon: <TrendingUp className="h-4 w-4" />,
      tone: "border-primary/40 bg-primary/5 text-primary",
    },
    stable: {
      icon: <Sparkles className="h-4 w-4" />,
      tone: "border-accent/40 bg-accent/5 text-accent",
    },
    tapering: {
      icon: <TrendingDown className="h-4 w-4" />,
      tone: "border-destructive/40 bg-destructive/5 text-destructive",
    },
    stalled: {
      icon: <PauseCircle className="h-4 w-4" />,
      tone: "border-destructive/40 bg-destructive/5 text-destructive",
    },
    insufficient_data: {
      icon: <HelpCircle className="h-4 w-4" />,
      tone: "border-muted bg-muted/30 text-muted-foreground",
    },
  };
  const m = meta[health];
  return (
    <Card className={`${m.tone} border`}>
      <CardContent className="py-5">
        <p className="font-mono text-xs uppercase tracking-widest opacity-80">
          Trajectory
        </p>
        <Badge variant="outline" className="mt-1 font-mono">
          <span className="inline-flex items-center gap-1">
            {m.icon}
            {healthLabelText(health)}
          </span>
        </Badge>
        <p className="text-xs mt-2 opacity-90">{healthDescription(health)}</p>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="container mx-auto max-w-xl px-4 py-20">
      <Card>
        <CardHeader>
          <CardTitle>No metrics yet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Pick the metric your AI initiative is supposed to move. The OI Lab
            recommends starting with one or two — pick something where weekly
            change is meaningful.
          </p>
          <div className="flex gap-3">
            <Button asChild data-testid="button-empty-cta">
              <Link href="/setup">
                Add your first metric
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <a href="https://solidcage.com" target="_blank" rel="noreferrer">
                Talk to Filip
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
