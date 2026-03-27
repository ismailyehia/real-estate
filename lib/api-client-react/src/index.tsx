export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  city: string;
  address: string;
  type: string;
  status: "for_sale" | "for_rent";
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  isFeatured: boolean;
  isFavorited: boolean;
}

const SAMPLE_PROPERTIES: Property[] = [
  {
    id: 1,
    title: "The Ethereal Manor",
    description: "An ultra-modern architectural masterpiece with panoramic views.",
    price: 12500000,
    city: "Beverly Hills",
    address: "90210 Sunset Blvd",
    type: "villa",
    status: "for_sale",
    bedrooms: 6,
    bathrooms: 8,
    area: 12000,
    images: ["/images/luxury_mansion.png"],
    isFeatured: true,
    isFavorited: false
  },
  {
    id: 2,
    title: "Skyline Sky-Home",
    description: "Breathtaking penthouse with 360-degree city views.",
    price: 8900000,
    city: "New York",
    address: "Central Park West",
    type: "apartment",
    status: "for_sale",
    bedrooms: 4,
    bathrooms: 4,
    area: 5500,
    images: ["/images/luxury_penthouse.png"],
    isFeatured: true,
    isFavorited: true
  },
  {
    id: 3,
    title: "Azure Bay Villa",
    description: "Tropical paradise with private beach access and infinity pool.",
    price: 45000,
    city: "Maldives",
    address: "Private Island 04",
    type: "villa",
    status: "for_rent",
    bedrooms: 5,
    bathrooms: 6,
    area: 8000,
    images: ["/images/luxury_villa.png"],
    isFeatured: true,
    isFavorited: false
  },
  {
    id: 4,
    title: "The Gilded Loft",
    description: "Industrial elegance meets modern luxury in the heart of the city.",
    price: 3200000,
    city: "London",
    address: "Soho Square",
    type: "studio",
    status: "for_sale",
    bedrooms: 2,
    bathrooms: 2,
    area: 3000,
    images: ["/images/luxury_loft.png"],
    isFeatured: true,
    isFavorited: false
  }
];

export const useListProperties = () => ({ data: { properties: SAMPLE_PROPERTIES, total: 4, totalPages: 1 }, isLoading: false });
export const useGetProperty = (id: number) => ({ data: SAMPLE_PROPERTIES.find(p => p.id === id) || null, isLoading: false });
export const useCreateProperty = () => ({ mutate: () => {}, mutateAsync: async () => {} });
export const useUpdateProperty = () => ({ mutate: () => {}, mutateAsync: async () => {} });
export const useDeleteProperty = () => ({ mutate: () => {}, mutateAsync: async () => {} });
export const useGetFeaturedProperties = () => ({ data: SAMPLE_PROPERTIES.filter(p => p.isFeatured), isLoading: false });
export const useGetSimilarProperties = () => ({ data: SAMPLE_PROPERTIES.slice(0, 2), isLoading: false });
export const useAddFavorite = () => ({ mutate: () => {}, mutateAsync: async () => {} });
export const useRemoveFavorite = () => ({ mutate: () => {}, mutateAsync: async () => {} });
export const useGetFavorites = () => ({ data: SAMPLE_PROPERTIES.filter(p => p.isFavorited), isLoading: false });
export const useSendMessage = () => ({ mutate: () => {}, mutateAsync: async () => {} });
export const useGetMessages = () => ({ data: [], isLoading: false });
export const useCreateReview = () => ({ mutate: () => {}, mutateAsync: async () => {} });
export const useGetPropertyReviews = () => ({ data: [], isLoading: false });
export const useGetAdminStats = () => ({ data: null, isLoading: false });
export const useGetAdminUsers = () => ({ data: [], isLoading: false });
export const useGetAdminProperties = () => ({ data: [], isLoading: false });
export const useUpdateUserRole = () => ({ mutate: () => {}, mutateAsync: async () => {} });
export const useDeleteUser = () => ({ mutate: () => {}, mutateAsync: async () => {} });
export const useGetUsers = () => ({ data: [], isLoading: false });
export const useGetUser = () => ({ data: null, isLoading: false });
export const useUpdateUser = () => ({ mutate: () => {}, mutateAsync: async () => {} });
export type ListPropertiesParams = any;
export type ListPropertiesStatus = "for_sale" | "for_rent";
export type ListPropertiesType = "apartment" | "villa" | "studio" | "land";
export type ListPropertiesSortBy = "newest" | "oldest" | "price_desc" | "price_asc";
export type CreatePropertyRequest = any;
export type CreatePropertyRequestType = ListPropertiesType;
export type CreatePropertyRequestStatus = ListPropertiesStatus;
export type SendMessageRequest = any;
export type CreateReviewRequest = any;
export type UpdateUserRequest = any;
export type UpdateUserRoleRequest = any;
export type RegisterRequestRole = "user" | "agent" | "admin";
export const useLogin = () => ({ mutate: () => {}, mutateAsync: async () => {} });
export const useRegister = () => ({ mutate: () => {}, mutateAsync: async () => {} });
export const useGetMe = () => ({ data: null, isLoading: false });
export interface User { id: number; name: string; email: string; role: string; }
export type LoginRequest = any;
export type RegisterRequest = any;
