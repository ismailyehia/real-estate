import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useFeaturedProperties } from "@/hooks/use-properties";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Building, Key, Map, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Home() {
  const { data: featuredProperties, isLoading } = useFeaturedProperties();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>('buy');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLocation(`/listings?search=${encodeURIComponent(search)}&status=${activeTab === 'buy' ? 'for_sale' : 'for_rent'}`);
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Luxury Mansion" 
            className="w-full h-full object-cover grayscale-[0.2]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/80 to-primary" />
        </div>

        <div className="container mx-auto px-4 z-10 relative mt-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl md:text-8xl font-display font-bold text-white leading-[1.1] mb-6 tracking-tighter uppercase">
              <span className="block">Find Your</span>
              <span className="text-accent underline decoration-white/20 underline-offset-8">Dream</span> Home.
            </h1>
            <p className="text-xl text-white/80 mb-10 max-w-xl font-light">
              Explore the most premium real estate properties in the world's most desirable locations.
            </p>

            {/* Search Box */}
            <div className="bg-white p-4 rounded-2xl shadow-2xl max-w-2xl">
              <div className="flex gap-4 mb-4 border-b border-border/50 pb-4">
                <button 
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'buy' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'}`}
                  onClick={() => setActiveTab('buy')}
                >
                  Buy
                </button>
                <button 
                  className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${activeTab === 'rent' ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary'}`}
                  onClick={() => setActiveTab('rent')}
                >
                  Rent
                </button>
              </div>
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input 
                    placeholder="City, neighborhood, or address..." 
                    className="pl-12 h-14 bg-secondary/50 border-transparent focus-visible:border-primary text-lg"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Button type="submit" size="lg" className="h-14 px-10 text-lg w-full md:w-auto bg-accent text-primary hover:bg-accent/90 border-none font-bold rounded-xl shadow-[0_0_20px_rgba(197,163,104,0.3)]">
                  Search
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats / Features Section */}
      <section className="py-20 bg-background relative">
        <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/pattern.png)`, backgroundSize: 'cover' }}></div>
        <div className="container mx-auto px-4 z-10 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} className="flex flex-col items-center text-center p-8 rounded-3xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Building className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Premium Listings</h3>
              <p className="text-muted-foreground">Access an exclusive collection of luxury apartments, villas, and penthouses.</p>
            </motion.div>
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: 0.1 }} className="flex flex-col items-center text-center p-8 rounded-3xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6">
                <Key className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Top Agents</h3>
              <p className="text-muted-foreground">Work with the industry's most successful and experienced real estate professionals.</p>
            </motion.div>
            <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay: 0.2 }} className="flex flex-col items-center text-center p-8 rounded-3xl bg-card border border-border/50 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                <Map className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-3">Prime Locations</h3>
              <p className="text-muted-foreground">Discover properties in the most sought-after neighborhoods globally.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold text-primary mb-4">Featured Properties</h2>
              <p className="text-muted-foreground text-lg max-w-2xl">Hand-picked properties that represent the finest in luxury living.</p>
            </div>
            <Link href="/listings">
              <Button variant="outline" className="hidden md:flex items-center gap-2 rounded-full border-primary text-primary hover:bg-primary hover:text-white">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[450px] bg-card rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : featuredProperties && featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.slice(0, 6).map((property, idx) => (
                <motion.div 
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <p className="text-xl text-muted-foreground">No featured properties available right now.</p>
            </div>
          )}
          
          <div className="mt-10 flex justify-center md:hidden">
            <Link href="/listings">
              <Button variant="outline" size="lg" className="rounded-full w-full max-w-sm">View All Properties</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
