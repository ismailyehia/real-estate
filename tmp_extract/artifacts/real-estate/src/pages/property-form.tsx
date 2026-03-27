import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useProperty, useCreatePropertyHook, useUpdatePropertyHook } from "@/hooks/use-properties";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreatePropertyRequestType, CreatePropertyRequestStatus, CreatePropertyRequest } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Building, Plus, Trash2 } from "lucide-react";

export function PropertyForm() {
  const [matchEdit, params] = useRoute("/properties/:id/edit");
  const isEditing = matchEdit && params?.id !== "new";
  const id = Number(params?.id);
  
  const { data: existingProperty, isLoading: loadingExisting } = useProperty(id);
  const createMutation = useCreatePropertyHook();
  const updateMutation = useUpdatePropertyHook();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreatePropertyRequest>({
    title: "",
    description: "",
    price: 0,
    city: "",
    address: "",
    type: "apartment" as CreatePropertyRequestType,
    status: "for_sale" as CreatePropertyRequestStatus,
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    images: [""],
    isFeatured: false
  });

  useEffect(() => {
    if (isEditing && existingProperty) {
      setFormData({
        title: existingProperty.title,
        description: existingProperty.description,
        price: existingProperty.price,
        city: existingProperty.city,
        address: existingProperty.address,
        type: existingProperty.type as CreatePropertyRequestType,
        status: existingProperty.status as CreatePropertyRequestStatus,
        bedrooms: existingProperty.bedrooms || 0,
        bathrooms: existingProperty.bathrooms || 0,
        area: existingProperty.area || 0,
        images: existingProperty.images.length > 0 ? existingProperty.images : [""],
        isFeatured: existingProperty.isFeatured
      });
    }
  }, [isEditing, existingProperty]);

  if (isEditing && loadingExisting) return <div className="p-10 text-center animate-pulse">Loading property data...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean up empty image URLs
    const cleanedData = {
      ...formData,
      images: formData.images.filter(url => url.trim() !== "")
    };

    if (cleanedData.images.length === 0) {
      toast({ title: "Error", description: "Please provide at least one image URL", variant: "destructive" });
      return;
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id, data: cleanedData });
        toast({ title: "Success", description: "Property updated successfully!" });
      } else {
        await createMutation.mutateAsync({ data: cleanedData });
        toast({ title: "Success", description: "Property created successfully!" });
      }
      setLocation("/dashboard");
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Something went wrong", variant: "destructive" });
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, images: [...formData.images, ""] });
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData({ ...formData, images: newImages });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-10 flex items-center gap-4 border-b border-border pb-6">
        <div className="bg-primary/10 text-primary p-3 rounded-2xl">
          <Building className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-display font-bold">{isEditing ? 'Edit Property' : 'List a Property'}</h1>
          <p className="text-muted-foreground mt-1">Enter the details for your listing below.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card p-8 rounded-3xl border border-border shadow-sm space-y-8">
        
        {/* Basic Info */}
        <div className="space-y-6">
          <h3 className="text-xl font-display font-bold border-b border-border pb-2">Basic Information</h3>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Title</label>
            <Input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Modern Luxury Villa with Ocean View" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Description</label>
            <textarea 
              required 
              className="w-full rounded-xl border-2 border-border bg-background p-4 text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 min-h-[150px]"
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Price ($)</label>
              <Input type="number" required min="0" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Status</label>
              <select 
                className="w-full h-12 rounded-xl border-2 border-border px-4 bg-background focus:outline-none focus:border-primary"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as CreatePropertyRequestStatus})}
              >
                <option value="for_sale">For Sale</option>
                <option value="for_rent">For Rent</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location & Details */}
        <div className="space-y-6 pt-6">
          <h3 className="text-xl font-display font-bold border-b border-border pb-2">Location & Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">City</label>
              <Input required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Address</label>
              <Input required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Type</label>
              <select 
                className="w-full h-12 rounded-xl border-2 border-border px-4 bg-background focus:outline-none focus:border-primary"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as CreatePropertyRequestType})}
              >
                <option value="apartment">Apartment</option>
                <option value="villa">Villa</option>
                <option value="studio">Studio</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Bedrooms</label>
              <Input type="number" min="0" value={formData.bedrooms || ''} onChange={(e) => setFormData({...formData, bedrooms: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Bathrooms</label>
              <Input type="number" min="0" value={formData.bathrooms || ''} onChange={(e) => setFormData({...formData, bathrooms: Number(e.target.value)})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Area (sqft)</label>
              <Input type="number" min="0" value={formData.area || ''} onChange={(e) => setFormData({...formData, area: Number(e.target.value)})} />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <h3 className="text-xl font-display font-bold">Images (URLs)</h3>
            <Button type="button" variant="outline" size="sm" onClick={addImageField}><Plus className="w-4 h-4 mr-1"/> Add Image</Button>
          </div>
          
          <div className="space-y-3">
            {formData.images.map((img, index) => (
              <div key={index} className="flex gap-2">
                <Input 
                  placeholder="https://images.unsplash.com/..." 
                  value={img} 
                  onChange={(e) => handleImageChange(index, e.target.value)} 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  className="shrink-0 text-destructive border-destructive/20 hover:bg-destructive hover:text-white"
                  onClick={() => removeImageField(index)}
                  disabled={formData.images.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-8 flex gap-4">
          <Button type="button" variant="outline" className="w-full h-14 text-lg" onClick={() => setLocation("/dashboard")}>Cancel</Button>
          <Button type="submit" className="w-full h-14 text-lg" disabled={createMutation.isPending || updateMutation.isPending}>
            {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Property"}
          </Button>
        </div>
      </form>
    </div>
  );
}
