import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Methodology() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
        OI Lab methodology
      </p>
      <h1 className="text-3xl font-semibold">Why rate of improvement is everything</h1>
      <p className="text-muted-foreground mt-3 leading-relaxed">
        Most AI work fails at the same step: the team ships a clever model, the
        dashboard looks busy, but no one can show the curve actually bending.
        The Operational Intelligence Lab is built around one operating belief —
        the only honest measure of AI value is whether the operator&apos;s
        chosen metric is improving, and at what rate.
      </p>

      <div className="grid gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Pick one operator-owned metric</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>
              Not a model metric (precision, BLEU, latency). A business metric
              that the operator was already responsible for: revenue, cycle time,
              error rate, NPS, conversion, retention.
            </p>
            <p>
              Pick something where a weekly cadence makes sense — fast enough to
              see the curve, slow enough that you&apos;re not chasing noise.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Set a baseline and a target</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            The baseline anchors the math; the target is the change you&apos;re
            committing to. Either is fine — higher-is-better or lower-is-better —
            as long as the direction matches the operator&apos;s intent.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">3. Log the metric on the cadence</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            Discipline beats sophistication. A weekly check-in for 8 weeks beats
            a real-time dashboard nobody reads. The tracker accepts out-of-order
            entries, so a missed week doesn&apos;t corrupt the curve.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">4. Read the trajectory, not the snapshot</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p>
              The dashboard fits a linear regression to the trailing 4 check-ins
              and assigns one of four labels:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><span className="font-mono text-foreground">Accelerating</span> — the curve is bending up.</li>
              <li><span className="font-mono text-foreground">Stable</span> — improving at a steady pace.</li>
              <li><span className="font-mono text-foreground">Tapering</span> — improving, but slowing down.</li>
              <li><span className="font-mono text-foreground">Stalled</span> — flat, target not yet reached.</li>
            </ul>
            <p>
              Each label has a clear next move. Accelerating? Find what changed
              and double down. Tapering? Inspect the bottleneck. Stalled? The
              intervention is exhausted — try a new lever.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">5. Share the snapshot</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground leading-relaxed">
            The dashboard&apos;s &quot;Copy shareable link&quot; encodes the
            full state into the URL — perfect for a weekly Loom comment or a
            board update. No backend, no login.
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 text-center space-y-3">
        <h2 className="text-2xl font-semibold">Ready to start?</h2>
        <p className="text-muted-foreground">
          Track your first metric today. Talk to Filip when you want help bending the curve.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild size="lg">
            <Link href="/setup" data-testid="button-methodology-cta">
              Track a metric
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a
              href="https://solidcage.com"
              target="_blank"
              rel="noreferrer"
              data-testid="button-methodology-solidcage"
            >
              Start your AI improvement journey
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
