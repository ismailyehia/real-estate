import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Login() {
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await login({ email, password });
      toast({ title: "Welcome back!", description: "Successfully logged in." });
    } catch (err: any) {
      toast({ title: "Login Failed", description: err.message || "Invalid credentials", variant: "destructive" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 relative">
      <div className="absolute inset-0 z-0">
        <img src={`${import.meta.env.BASE_URL}images/hero-bg.png`} className="w-full h-full object-cover blur-sm opacity-20" alt="" />
      </div>
      
      <div className="bg-card w-full max-w-md p-8 md:p-12 rounded-3xl shadow-2xl border border-border z-10 mx-4">
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="bg-primary text-white p-3 rounded-2xl mb-4 shadow-lg">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to access your saved properties and messages.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Email</label>
            <Input 
              type="email" 
              placeholder="name@example.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-foreground">Password</label>
              <a href="#" className="text-xs font-semibold text-accent hover:underline">Forgot password?</a>
            </div>
            <Input 
              type="password" 
              placeholder="••••••••" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-secondary/50"
            />
          </div>
          
          <Button type="submit" className="w-full h-14 text-lg mt-4" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Create one</Link>
        </div>
      </div>
    </div>
  );
}
