import { useFavorites } from "@/hooks/use-interactions";
import { PropertyCard } from "@/components/property-card";
import { Heart } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export function Favorites() {
  const { data: favorites, isLoading } = useFavorites();

  return (
    <div className="container mx-auto px-4 py-12 min-h-[70vh]">
      <div className="mb-10 flex items-center gap-4 border-b border-border pb-6">
        <div className="bg-red-50 text-red-500 p-3 rounded-2xl">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <div>
          <h1 className="text-4xl font-display font-bold">Saved Properties</h1>
          <p className="text-muted-foreground mt-1">Keep track of the homes you love.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-96 bg-card rounded-2xl animate-pulse" />)}
        </div>
      ) : favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(prop => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card rounded-3xl border border-border mt-10">
          <Heart className="w-16 h-16 mx-auto text-muted-foreground/30 mb-6" />
          <h3 className="text-2xl font-display font-bold mb-2">No saved properties yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">Click the heart icon on any property to save it here for later.</p>
          <Link href="/listings">
            <Button size="lg">Explore Properties</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
