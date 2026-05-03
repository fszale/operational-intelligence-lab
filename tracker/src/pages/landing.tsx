import { Link } from "wouter";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Activity,
  TrendingUp,
  Gauge,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { loadState } from "@/lib/storage";
import type { AppState } from "@/lib/types";

export default function Landing() {
  const [state, setState] = useState<AppState>({ metrics: [], v: 1 });

  useEffect(() => {
    setState(loadState());
  }, []);

  const hasData = state.metrics.length > 0;

  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="px-4 py-20 md:py-28 border-b border-border/40">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <Badge
            variant="secondary"
            className="font-mono text-xs"
            data-testid="badge-thesis"
          >
            Operational Intelligence Lab thesis
          </Badge>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
            Rate of Improvement{" "}
            <span className="text-primary">is everything.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Most AI projects fail not because the model is wrong, but because
            nobody is tracking whether the underlying business metric is
            actually getting better, and at what rate. Pick a metric. Log it
            weekly. See whether your curve is bending the right way.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button asChild size="lg" className="font-mono">
              <Link href={hasData ? "/dashboard" : "/setup"} data-testid="button-primary-cta">
                {hasData ? "Open dashboard" : "Track your first metric"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="font-mono">
              <a
                href="https://solidcage.com"
                target="_blank"
                rel="noreferrer"
                data-testid="button-solidcage-cta"
              >
                Start your AI improvement journey
              </a>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground font-mono pt-2">
            No login. Data lives in your browser. Share via URL when you want to.
          </p>
        </div>
      </section>

      {/* Three pillars */}
      <section className="px-4 py-16">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6">
            <Card data-testid="card-pillar-track">
              <CardHeader>
                <Activity className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Track the metric that matters</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                Name a metric (revenue, cycle time, NPS, error rate), set a
                baseline and target, choose a cadence. Track several in
                parallel.
              </CardContent>
            </Card>
            <Card data-testid="card-pillar-curve">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">See the curve, not the snapshot</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                The dashboard plots the metric and its period-over-period rate
                of change, with an acceleration band that distinguishes a
                bending-up curve from a tapering one.
              </CardContent>
            </Card>
            <Card data-testid="card-pillar-classify">
              <CardHeader>
                <Gauge className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">Classify the trajectory</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground leading-relaxed">
                A trailing 4-period slope assigns a health label —
                Accelerating, Stable, Tapering, or Stalled — and projects when
                you&apos;ll hit your target.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Workflow
              </p>
              <CardTitle className="text-2xl">From metric to mandate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <Step n={1} title="Set up the metric">
                Name it, set baseline + target, pick a cadence. Decide whether
                higher is better or lower is better.
              </Step>
              <Step n={2} title="Check in on schedule">
                Log the current value with an optional note. Out-of-order
                entries are accepted — late check-ins won&apos;t corrupt the curve.
              </Step>
              <Step n={3} title="Read the curve">
                The dashboard tells you whether your AI intervention is
                actually changing the rate, or if you&apos;re just busy.
              </Step>
              <Step n={4} title="Share the snapshot">
                <span className="inline-flex items-center gap-1">
                  <Share2 className="h-3.5 w-3.5" />
                </span>{" "}
                Every dashboard has a copy-able URL that encodes the full
                state — perfect for a Loom comment or a board update.
              </Step>
            </CardContent>
          </Card>

          <div className="mt-10 text-center space-y-3">
            <h2 className="text-2xl font-semibold">
              Ready to see whether your curve is accelerating?
            </h2>
            <p className="text-muted-foreground">
              The OI Lab works with operators who treat improvement as a
              measurable craft. Start logging today, talk to Filip when
              you&apos;re ready to bend the curve faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild size="lg" className="font-mono">
                <Link href="/setup" data-testid="button-cta-bottom">
                  Track a metric
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-mono">
                <a
                  href="https://solidcage.com"
                  target="_blank"
                  rel="noreferrer"
                  data-testid="button-solidcage-bottom"
                >
                  Start your AI improvement journey
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="font-mono text-sm text-primary border border-primary/30 bg-primary/5 rounded-md w-9 h-9 flex items-center justify-center shrink-0">
        {n}
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {children}
        </p>
      </div>
    </div>
  );
}
