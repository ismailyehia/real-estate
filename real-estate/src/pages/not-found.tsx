import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-display font-black text-primary/10 mb-4 tracking-tighter">404</h1>
        <h2 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 text-lg">
          The property or page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-full px-8 flex items-center gap-2 mx-auto">
            <Home className="w-4 h-4" /> Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
