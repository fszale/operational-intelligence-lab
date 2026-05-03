import { useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  loadState,
  makeId,
  removeMetric,
  saveState,
  upsertMetric,
} from "@/lib/storage";
import { todayISO } from "@/lib/calc";
import type { Cadence, Direction, Metric } from "@/lib/types";

const EMPTY: Omit<Metric, "id" | "updatedAt"> = {
  name: "",
  unit: "",
  direction: "increase",
  baseline: 0,
  target: 0,
  cadence: "weekly",
  startDate: todayISO(),
  checkIns: [],
};

export default function Setup() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute<{ id: string }>("/setup/:id");
  const editingId = params?.id;
  const { toast } = useToast();

  const [form, setForm] = useState<Omit<Metric, "id" | "updatedAt">>(EMPTY);
  const [baselineStr, setBaselineStr] = useState("0");
  const [targetStr, setTargetStr] = useState("0");

  useEffect(() => {
    if (!editingId) return;
    const existing = loadState().metrics.find((m) => m.id === editingId);
    if (!existing) return;
    setForm({
      name: existing.name,
      unit: existing.unit,
      direction: existing.direction,
      baseline: existing.baseline,
      target: existing.target,
      cadence: existing.cadence,
      startDate: existing.startDate,
      checkIns: existing.checkIns,
    });
    setBaselineStr(String(existing.baseline));
    setTargetStr(String(existing.target));
  }, [editingId]);

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const baseline = Number(baselineStr);
    const target = Number(targetStr);

    if (!form.name.trim()) {
      toast({ title: "Name your metric", description: "Pick something specific." });
      return;
    }
    if (Number.isNaN(baseline) || Number.isNaN(target)) {
      toast({ title: "Numbers required", description: "Baseline and target must be numbers." });
      return;
    }
    if (baseline === target) {
      toast({
        title: "Baseline equals target",
        description: "Pick a target that represents the change you want.",
      });
      return;
    }
    if (form.direction === "increase" && target < baseline) {
      toast({
        title: "Direction mismatch",
        description: "For an 'increase' metric, the target should be higher than the baseline.",
      });
      return;
    }
    if (form.direction === "decrease" && target > baseline) {
      toast({
        title: "Direction mismatch",
        description: "For a 'decrease' metric, the target should be lower than the baseline.",
      });
      return;
    }

    const id = editingId ?? makeId();
    const metric: Metric = {
      id,
      name: form.name.trim(),
      unit: form.unit.trim(),
      direction: form.direction,
      baseline,
      target,
      cadence: form.cadence,
      startDate: form.startDate,
      checkIns: form.checkIns,
      updatedAt: Date.now(),
    };
    saveState(upsertMetric(loadState(), metric));
    toast({
      title: editingId ? "Metric updated" : "Metric created",
      description: editingId ? form.name : `Now log your first check-in for "${form.name}".`,
    });
    setLocation(editingId ? `/dashboard/${id}` : `/checkin/${id}`);
  };

  const onDelete = () => {
    if (!editingId) return;
    if (typeof window !== "undefined" && !window.confirm("Delete this metric and its check-ins?"))
      return;
    saveState(removeMetric(loadState(), editingId));
    toast({ title: "Metric deleted" });
    setLocation("/dashboard");
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
        {editingId ? "Edit metric" : "New metric"}
      </p>
      <h1 className="text-3xl font-semibold mb-6">
        {editingId ? "Update your metric" : "Define what you're improving"}
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Metric definition</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Metric name</Label>
              <Input
                id="name"
                data-testid="input-name"
                placeholder="e.g. Qualified leads per week"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  data-testid="input-unit"
                  placeholder="leads, %, hours…"
                  value={form.unit}
                  onChange={(e) => update("unit", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="direction">Direction</Label>
                <Select
                  value={form.direction}
                  onValueChange={(v) => update("direction", v as Direction)}
                >
                  <SelectTrigger id="direction" data-testid="select-direction">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase">Higher is better</SelectItem>
                    <SelectItem value="decrease">Lower is better</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="baseline">Baseline</Label>
                <Input
                  id="baseline"
                  data-testid="input-baseline"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={baselineStr}
                  onChange={(e) => setBaselineStr(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Target</Label>
                <Input
                  id="target"
                  data-testid="input-target"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  value={targetStr}
                  onChange={(e) => setTargetStr(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cadence">Cadence</Label>
                <Select
                  value={form.cadence}
                  onValueChange={(v) => update("cadence", v as Cadence)}
                >
                  <SelectTrigger id="cadence" data-testid="select-cadence">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="start">Start date</Label>
                <Input
                  id="start"
                  data-testid="input-start"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => update("startDate", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" data-testid="button-save">
                {editingId ? "Save changes" : "Create + add first check-in"}
                <ArrowRight className="h-4 w-4" />
              </Button>
              {editingId ? (
                <Button
                  type="button"
                  variant="outline"
                  data-testid="button-delete"
                  onClick={onDelete}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              ) : (
                <Button asChild type="button" variant="ghost">
                  <Link href="/dashboard">Cancel</Link>
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground font-mono mt-6">
        Tip: pick metrics where the AI intervention is supposed to move the
        needle within 8–12 weeks. If the cadence is too slow, you&apos;ll never
        see the curve.
      </p>
    </div>
  );
}
