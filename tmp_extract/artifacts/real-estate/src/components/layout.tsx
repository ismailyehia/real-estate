import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Building2, User, Menu, X, Heart, MessageSquare, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Listings", path: "/listings" },
  ];

  if (isAuthenticated) {
    navLinks.push({ name: "Favorites", path: "/favorites" });
    navLinks.push({ name: "Messages", path: "/messages" });
    if (user?.role === "admin" || user?.role === "agent") {
      navLinks.push({ name: "Dashboard", path: "/dashboard" });
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl group-hover:bg-accent transition-colors">
              <Building2 className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-primary">LuxeEstates</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-accent relative",
                  location === link.path ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.name}
                {location === link.path && (
                  <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-accent rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 px-4 py-2 bg-secondary/50 rounded-full border border-border">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold">{user?.name}</span>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} title="Log out">
                  <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
                  Log in
                </Link>
                <Link href="/register">
                  <Button variant="default" className="rounded-full px-6">Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background p-4 flex flex-col gap-4 absolute w-full shadow-xl">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "p-3 rounded-xl font-medium",
                  location === link.path ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-secondary"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            {isAuthenticated ? (
              <Button variant="outline" onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full justify-center">
                <LogOut className="w-4 h-4 mr-2" /> Log out
              </Button>
            ) : (
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 w-full relative">
        {children}
      </main>

      <footer className="bg-primary text-primary-foreground py-16 mt-20 border-t-4 border-accent">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="bg-accent text-accent-foreground p-2 rounded-xl">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="font-display font-bold text-3xl tracking-tight">LuxeEstates</span>
            </Link>
            <p className="text-primary-foreground/70 max-w-sm leading-relaxed text-lg">
              Experience the pinnacle of luxury real estate. Discover exceptional properties in the world's most desirable locations.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold text-xl mb-6 text-white">Quick Links</h4>
            <ul className="space-y-4 text-primary-foreground/70">
              <li><Link href="/listings" className="hover:text-accent transition-colors">Search Properties</Link></li>
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/agents" className="hover:text-accent transition-colors">Our Agents</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-xl mb-6 text-white">Contact</h4>
            <ul className="space-y-4 text-primary-foreground/70">
              <li>1-800-LUXE-EST</li>
              <li>contact@luxeestates.com</li>
              <li>123 Luxury Ave, Beverly Hills, CA</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-16 pt-8 border-t border-primary-foreground/10 text-center text-primary-foreground/50">
          <p>© {new Date().getFullYear()} LuxeEstates. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
