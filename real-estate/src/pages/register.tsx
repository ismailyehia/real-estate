import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RegisterRequestRole } from "@workspace/api-client-react";

export function Register() {
  const { register } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user" as RegisterRequestRole
  });
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      await register(formData);
      toast({ title: "Account created!", description: "Welcome to LuxeEstates." });
    } catch (err: any) {
      toast({ title: "Registration Failed", description: err.message || "Please check your inputs", variant: "destructive" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 py-12 relative">
      <div className="absolute inset-0 z-0">
        <img src={`${import.meta.env.BASE_URL}images/pattern.png`} className="w-full h-full object-cover opacity-10 mix-blend-multiply" alt="" />
      </div>

      <div className="bg-card w-full max-w-lg p-8 md:p-12 rounded-3xl shadow-2xl border border-border z-10 mx-4">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-primary text-white p-3 rounded-2xl mb-4 shadow-lg">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground">Create Account</h1>
          <p className="text-muted-foreground mt-2">Join LuxeEstates to find your dream property.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Full Name</label>
            <Input 
              required 
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Email Address</label>
            <Input 
              type="email" 
              required 
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Phone Number (Optional)</label>
            <Input 
              type="tel" 
              placeholder="+1 (555) 000-0000"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Password</label>
            <Input 
              type="password" 
              required 
              placeholder="••••••••"
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <p className="text-xs text-muted-foreground">Must be at least 6 characters.</p>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-bold text-foreground">I am a...</label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`border-2 rounded-xl p-4 flex flex-col items-center cursor-pointer transition-all ${formData.role === 'user' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                <input type="radio" name="role" value="user" className="hidden" checked={formData.role === 'user'} onChange={() => setFormData({...formData, role: 'user'})} />
                <span className="font-bold">Buyer/Renter</span>
              </label>
              <label className={`border-2 rounded-xl p-4 flex flex-col items-center cursor-pointer transition-all ${formData.role === 'agent' ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
                <input type="radio" name="role" value="agent" className="hidden" checked={formData.role === 'agent'} onChange={() => setFormData({...formData, role: 'agent'})} />
                <span className="font-bold">Real Estate Agent</span>
              </label>
            </div>
          </div>
          
          <Button type="submit" className="w-full h-14 text-lg mt-6" disabled={isPending}>
            {isPending ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
