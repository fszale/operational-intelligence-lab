import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-24">
      <div className="max-w-md text-center space-y-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          404
        </p>
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">
          That route doesn&apos;t exist in the OI Lab tracker. Head back home or
          jump straight to your dashboard.
        </p>
        <div className="flex gap-3 justify-center pt-2">
          <Button asChild variant="default">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
