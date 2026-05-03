import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowRight, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { loadState, saveState, upsertMetric } from "@/lib/storage";
import { addCheckIn, todayISO } from "@/lib/calc";
import type { Metric } from "@/lib/types";

export default function CheckInPage() {
  const [, params] = useRoute<{ id: string }>("/checkin/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [metric, setMetric] = useState<Metric | null>(null);
  const [date, setDate] = useState(todayISO());
  const [valueStr, setValueStr] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!params?.id) return;
    const m = loadState().metrics.find((x) => x.id === params.id) ?? null;
    setMetric(m);
  }, [params?.id]);

  const recent = useMemo(() => {
    if (!metric) return [];
    return [...metric.checkIns].slice(-5).reverse();
  }, [metric]);

  if (!metric) {
    return (
      <div className="container mx-auto max-w-xl px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Metric not found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              The metric you&apos;re trying to check in on doesn&apos;t exist
              in this browser. Add one to get started.
            </p>
            <Button asChild>
              <Link href="/setup">Add a metric</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(valueStr);
    if (Number.isNaN(value) || valueStr.trim() === "") {
      toast({ title: "Numeric value required" });
      return;
    }
    const updated = addCheckIn(metric, {
      date,
      value,
      ...(note.trim() ? { note: note.trim() } : {}),
    });
    saveState(upsertMetric(loadState(), updated));
    setMetric(updated);
    setValueStr("");
    setNote("");
    toast({
      title: "Check-in logged",
      description: `${metric.name} — ${value}${metric.unit ? ` ${metric.unit}` : ""}`,
    });
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          Check in
        </p>
        <h1 className="text-3xl font-semibold">{metric.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {metric.direction === "increase" ? "Higher is better" : "Lower is better"} ·
          baseline {metric.baseline}
          {metric.unit ? ` ${metric.unit}` : ""} · target {metric.target}
          {metric.unit ? ` ${metric.unit}` : ""} · {metric.cadence}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Log a value</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  data-testid="input-checkin-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value">
                  Value{metric.unit ? ` (${metric.unit})` : ""}
                </Label>
                <Input
                  id="value"
                  data-testid="input-checkin-value"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  placeholder="Current reading"
                  value={valueStr}
                  onChange={(e) => setValueStr(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Note (optional)</Label>
              <Textarea
                id="note"
                data-testid="input-checkin-note"
                placeholder="What changed this period? Intervention, anomaly, context…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" data-testid="button-checkin-save">
                Save check-in
              </Button>
              <Button asChild type="button" variant="outline">
                <Link href={`/dashboard/${metric.id}`} data-testid="link-to-dashboard">
                  View dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-4 w-4" />
              Recent check-ins
            </CardTitle>
            <span className="text-xs text-muted-foreground font-mono">
              {metric.checkIns.length} total
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No check-ins yet. The first one starts your curve.
            </p>
          ) : (
            <ul className="divide-y divide-border" data-testid="list-recent-checkins">
              {recent.map((c) => (
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
    </div>
  );
}
