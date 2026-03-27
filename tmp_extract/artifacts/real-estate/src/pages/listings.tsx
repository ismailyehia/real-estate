import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useProperties } from "@/hooks/use-properties";
import { PropertyCard } from "@/components/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ListPropertiesParams, ListPropertiesStatus, ListPropertiesType, ListPropertiesSortBy } from "@workspace/api-client-react";
import { Search, SlidersHorizontal, ChevronDown, MapPin } from "lucide-react";

export function Listings() {
  const [params, setParams] = useState<ListPropertiesParams>({
    page: 1,
    limit: 12,
    sortBy: 'newest'
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  // Parse URL params on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('search');
    const status = urlParams.get('status') as ListPropertiesStatus;
    
    if (search || status) {
      setParams(prev => ({ 
        ...prev, 
        search: search || undefined, 
        status: status || undefined 
      }));
      if (search) setSearchInput(search);
    }
  }, []);

  const { data, isLoading } = useProperties(params);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setParams(prev => ({ ...prev, search: searchInput || undefined, page: 1 }));
  };

  const updateFilter = (key: keyof ListPropertiesParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value || undefined, page: 1 }));
  };

  return (
    <div className="bg-secondary/20 min-h-screen pb-20">
      {/* Header / Search Bar */}
      <div className="bg-primary pt-12 pb-24 px-4 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: `url(${import.meta.env.BASE_URL}images/pattern.png)`}}></div>
        <div className="container mx-auto relative z-10">
          <h1 className="text-4xl font-display font-bold mb-8">Search Properties</h1>
          <form onSubmit={handleSearchSubmit} className="flex gap-4 max-w-4xl bg-white p-2 rounded-2xl shadow-xl">
            <div className="relative flex-1 flex items-center px-4">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <input 
                type="text" 
                placeholder="Search by city, title, or address..."
                className="w-full h-12 bg-transparent text-foreground focus:outline-none text-lg placeholder:text-muted-foreground/60"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="button" variant="outline" className="h-12 px-4 border-border text-foreground hover:bg-secondary md:hidden" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
            <Button type="submit" size="lg" variant="accent" className="h-12 px-8 text-base rounded-xl hidden md:flex">
              Search
            </Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-card rounded-2xl p-6 shadow-xl border border-border sticky top-28">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <h2 className="text-xl font-bold font-display">Filters</h2>
                <Button variant="ghost" size="sm" onClick={() => setParams({ page: 1, limit: 12, sortBy: 'newest' })} className="text-accent hover:text-accent/80 p-0 h-auto">
                  Reset All
                </Button>
              </div>

              <div className="space-y-6">
                {/* Status */}
                <div>
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => updateFilter('status', params.status === 'for_sale' ? undefined : 'for_sale')}
                      className={`py-2 rounded-xl border text-sm font-semibold transition-all ${params.status === 'for_sale' ? 'bg-primary border-primary text-white' : 'border-border hover:border-primary/50 text-foreground'}`}
                    >
                      For Sale
                    </button>
                    <button 
                      onClick={() => updateFilter('status', params.status === 'for_rent' ? undefined : 'for_rent')}
                      className={`py-2 rounded-xl border text-sm font-semibold transition-all ${params.status === 'for_rent' ? 'bg-primary border-primary text-white' : 'border-border hover:border-primary/50 text-foreground'}`}
                    >
                      For Rent
                    </button>
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Property Type</label>
                  <div className="space-y-2">
                    {['apartment', 'villa', 'studio', 'land'].map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${params.type === type ? 'bg-accent border-accent' : 'border-input group-hover:border-accent'}`}>
                          {params.type === type && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                        </div>
                        <span className="text-foreground capitalize font-medium">{type}</span>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={params.type === type}
                          onChange={() => updateFilter('type', params.type === type ? undefined : type)}
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Price Range</label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      placeholder="Min" 
                      className="h-10"
                      value={params.minPrice || ''}
                      onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input 
                      type="number" 
                      placeholder="Max" 
                      className="h-10"
                      value={params.maxPrice || ''}
                      onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 block">Min Bedrooms</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        onClick={() => updateFilter('minBedrooms', params.minBedrooms === num ? undefined : num)}
                        className={`w-10 h-10 rounded-lg border font-semibold flex items-center justify-center transition-all ${params.minBedrooms === num ? 'bg-primary border-primary text-white' : 'border-border text-foreground hover:border-primary/50'}`}
                      >
                        {num}{num === 5 && '+'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button className="w-full mt-8 lg:hidden" onClick={() => setShowFilters(false)}>Apply Filters</Button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="bg-card p-4 rounded-2xl shadow-sm border border-border/50 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-muted-foreground font-medium">
                {isLoading ? "Searching..." : `Found ${data?.total || 0} properties`}
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-sm font-bold text-muted-foreground whitespace-nowrap">Sort By:</span>
                <select 
                  className="h-10 border-2 border-border rounded-xl px-4 bg-background w-full sm:w-auto focus:outline-none focus:border-primary font-semibold"
                  value={params.sortBy}
                  onChange={(e) => updateFilter('sortBy', e.target.value as ListPropertiesSortBy)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="price_asc">Price: Low to High</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-[400px] bg-card/50 rounded-2xl animate-pulse border border-border"></div>
                ))}
              </div>
            ) : data?.properties && data.properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {data.properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
                
                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="flex justify-center mt-12 gap-2">
                    <Button 
                      variant="outline" 
                      disabled={params.page === 1}
                      onClick={() => updateFilter('page', (params.page || 1) - 1)}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center px-4 font-semibold text-muted-foreground">
                      Page {params.page} of {data.totalPages}
                    </div>
                    <Button 
                      variant="outline" 
                      disabled={params.page === data.totalPages}
                      onClick={() => updateFilter('page', (params.page || 1) + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-card rounded-2xl p-16 text-center border border-border flex flex-col items-center">
                <MapPin className="w-16 h-16 text-muted-foreground/30 mb-6" />
                <h3 className="text-2xl font-bold font-display text-foreground mb-2">No properties found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">We couldn't find any properties matching your current filters. Try adjusting your search criteria.</p>
                <Button variant="outline" className="mt-8" onClick={() => setParams({ page: 1, limit: 12, sortBy: 'newest' })}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
