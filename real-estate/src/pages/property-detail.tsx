import { useRoute } from "wouter";
import { useProperty, useSimilarProperties } from "@/hooks/use-properties";
import { useAuth } from "@/hooks/use-auth";
import { useToggleFavorite, useSendMessageHook } from "@/hooks/use-interactions";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import { Bed, Bath, Square, MapPin, Heart, Share2, Phone, Mail, Star, Eye } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export function PropertyDetail() {
  const [, params] = useRoute("/properties/:id");
  const id = Number(params?.id);
  const { data: property, isLoading } = useProperty(id);
  const { data: similar } = useSimilarProperties(id);
  const { user, isAuthenticated } = useAuth();
  const { toggle, isLoading: favLoading } = useToggleFavorite();
  const sendMessage = useSendMessageHook();
  const { toast } = useToast();

  const [activeImage, setActiveImage] = useState(0);
  const [messageContent, setMessageContent] = useState("");

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-primary border-t-accent rounded-full animate-spin"></div></div>;
  }

  if (!property) {
    return <div className="min-h-screen flex items-center justify-center flex-col"><h2 className="text-3xl font-bold">Property Not Found</h2></div>;
  }

  {/* property placeholder house interior modern */}
  const defaultImages = [
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&fit=crop",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&fit=crop",
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&fit=crop"
  ];
  const images = property.images && property.images.length > 0 ? property.images : defaultImages;

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({ title: "Please login", description: "You must be logged in to send a message", variant: "destructive" });
      return;
    }
    try {
      await sendMessage.mutateAsync({
        data: {
          content: messageContent,
          receiverId: property.agentId,
          propertyId: property.id
        }
      });
      toast({ title: "Success", description: "Message sent to agent!" });
      setMessageContent("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to send message", variant: "destructive" });
    }
  };

  return (
    <div className="bg-secondary/10 pb-20">
      {/* Top Gallery Section */}
      <div className="w-full bg-background border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  {property.status.replace('_', ' ')}
                </span>
                <span className="text-accent font-bold uppercase tracking-wider text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {property.city}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-2">{property.title}</h1>
              <p className="text-muted-foreground text-lg">{property.address}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl md:text-5xl font-display font-bold text-primary mb-3">
                {formatPrice(property.price)}
                {property.status === 'for_rent' && <span className="text-2xl text-muted-foreground font-sans font-normal">/mo</span>}
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" size="icon" className="rounded-full shadow-sm">
                  <Share2 className="w-5 h-5 text-muted-foreground" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={`rounded-full shadow-sm transition-colors ${property.isFavorited ? 'border-red-500 text-red-500 bg-red-50' : 'text-muted-foreground'}`}
                  onClick={() => toggle(property.id, property.isFavorited)}
                  disabled={favLoading}
                >
                  <Heart className={`w-5 h-5 ${property.isFavorited ? 'fill-current' : ''}`} />
                </Button>
              </div>
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[50vh] min-h-[400px]">
            <div className="md:col-span-3 rounded-2xl overflow-hidden relative cursor-pointer">
              <img src={images[activeImage]} className="w-full h-full object-cover" alt="Main property view" />
            </div>
            <div className="hidden md:flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
              {images.map((img, idx) => (
                <div 
                  key={idx} 
                  className={`relative rounded-xl overflow-hidden h-32 cursor-pointer border-2 transition-all ${activeImage === idx ? 'border-accent' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  onClick={() => setActiveImage(idx)}
                >
                  <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Quick Stats */}
            <div className="flex flex-wrap gap-4 md:gap-8 p-6 bg-card rounded-2xl shadow-sm border border-border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bed className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-display">{property.bedrooms || '-'}</div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Bedrooms</div>
                </div>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bath className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-display">{property.bathrooms || '-'}</div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Bathrooms</div>
                </div>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Square className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-display">{property.area || '-'}</div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Square Ft</div>
                </div>
              </div>
              <div className="w-px h-12 bg-border hidden sm:block"></div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <Eye className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold font-display">{property.viewCount}</div>
                  <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Views</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
              <h2 className="text-2xl font-display font-bold mb-6 border-b border-border pb-4">About this property</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.description}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-card rounded-2xl p-8 shadow-sm border border-border">
              <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
                <h2 className="text-2xl font-display font-bold">Reviews ({property.reviewCount})</h2>
                {property.averageRating && (
                  <div className="flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-xl text-accent font-bold text-lg">
                    <Star className="w-5 h-5 fill-current" /> {property.averageRating.toFixed(1)}
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                {property.reviews && property.reviews.length > 0 ? (
                  property.reviews.map(review => (
                    <div key={review.id} className="border-b border-border/50 last:border-0 pb-6 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                            {review.user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold">{review.user.name}</div>
                            <div className="text-xs text-muted-foreground">{format(new Date(review.createdAt), 'MMM d, yyyy')}</div>
                          </div>
                        </div>
                        <div className="flex text-accent">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-muted'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground italic">"{review.comment}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No reviews yet for this property.</p>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-card rounded-2xl p-6 shadow-xl border border-primary/10 sticky top-24">
              <h3 className="text-xl font-display font-bold mb-6">Contact Agent</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-secondary overflow-hidden border-2 border-accent">
                  {property.agent.avatar ? (
                    <img src={property.agent.avatar} alt={property.agent.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary bg-primary/10">
                      {property.agent.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="font-bold text-lg">{property.agent.name}</div>
                  <div className="text-accent text-sm font-semibold mb-1">LuxeEstates Agent</div>
                  {property.agent.phone && (
                    <div className="text-muted-foreground text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {property.agent.phone}
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSendMessage} className="space-y-4">
                <textarea 
                  className="w-full rounded-xl border-2 border-border bg-background p-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none h-32"
                  placeholder="I am interested in this property..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  required
                />
                <Button type="submit" className="w-full h-12 text-lg" disabled={sendMessage.isPending}>
                  {sendMessage.isPending ? "Sending..." : "Send Message"} <Mail className="w-5 h-5 ml-2" />
                </Button>
                {!isAuthenticated && (
                  <p className="text-xs text-center text-muted-foreground">You must be logged in to contact the agent.</p>
                )}
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Similar Properties */}
      {similar && similar.length > 0 && (
        <div className="container mx-auto px-4 mt-20">
          <h2 className="text-3xl font-display font-bold mb-8 text-primary">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {similar.slice(0,4).map(prop => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
