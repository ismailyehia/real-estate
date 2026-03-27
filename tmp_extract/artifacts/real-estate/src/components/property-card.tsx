import { Link } from "wouter";
import { Property } from "@workspace/api-client-react";
import { Bed, Bath, Square, MapPin, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useToggleFavorite } from "@/hooks/use-interactions";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const { isAuthenticated } = useAuth();
  const { toggle, isLoading } = useToggleFavorite();
  const [isHovered, setIsHovered] = useState(false);

  {/* property placeholder house exterior modern */}
  const defaultImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&fit=crop";
  const displayImage = property.images && property.images.length > 0 ? property.images[0] : defaultImage;

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) return;
    await toggle(property.id, property.isFavorited);
  };

  return (
    <Link href={`/properties/${property.id}`} className="block group">
      <div 
        className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-md hover:shadow-2xl hover:border-accent/30 transition-all duration-500 h-full flex flex-col group-hover:-translate-y-1 relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img 
            src={displayImage} 
            alt={property.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          
          <div className="absolute top-4 left-4 flex gap-2">
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md",
              property.status === 'for_sale' ? "bg-accent/90 text-white" : "bg-primary/90 text-white"
            )}>
              {property.status.replace('_', ' ')}
            </span>
            {property.isFeatured && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-md border border-white/20">
                Featured
              </span>
            )}
          </div>

          <button 
            onClick={handleFavoriteClick}
            disabled={isLoading || !isAuthenticated}
            className={cn(
              "absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border transition-all duration-300 z-10",
              property.isFavorited 
                ? "bg-red-500/10 border-red-500/50 text-red-500" 
                : "bg-white/20 border-white/30 text-white hover:bg-white/40",
              !isAuthenticated && "opacity-50 cursor-not-allowed"
            )}
          >
            <Heart className={cn("w-5 h-5", property.isFavorited && "fill-current")} />
          </button>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="font-display font-bold text-3xl drop-shadow-md">
              {formatPrice(property.price)}
              {property.status === 'for_rent' && <span className="text-lg font-sans font-normal opacity-80">/mo</span>}
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-start gap-1 text-muted-foreground text-sm mb-2 font-medium">
            <MapPin className="w-4 h-4 shrink-0 text-accent" />
            <span className="truncate">{property.city}, {property.address}</span>
          </div>
          
          <h3 className="text-xl font-bold font-display text-foreground leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
            {property.title}
          </h3>

          <div className="mt-auto grid grid-cols-3 gap-2 pt-4 border-t border-border/60 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/5 rounded-md text-primary"><Bed className="w-4 h-4" /></div>
              <span className="font-semibold">{property.bedrooms || '-'} Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/5 rounded-md text-primary"><Bath className="w-4 h-4" /></div>
              <span className="font-semibold">{property.bathrooms || '-'} Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/5 rounded-md text-primary"><Square className="w-4 h-4" /></div>
              <span className="font-semibold">{property.area || '-'} sqft</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
