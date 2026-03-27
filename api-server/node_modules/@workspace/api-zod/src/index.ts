import { z } from "zod";

export const HealthCheckResponse = z.object({
  status: z.string(),
});

export const RegisterBody = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: z.enum(["user", "agent"]).default("user"),
});

export const LoginBody = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const AuthResponse = z.object({
  token: z.string(),
  user: z.any(),
});

export const User = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  createdAt: z.string(),
});

export const CreatePropertyBody = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  city: z.string(),
  address: z.string(),
  type: z.enum(["apartment", "villa", "studio", "land"]),
  status: z.enum(["for_sale", "for_rent"]),
  bedrooms: z.number().optional().nullable(),
  bathrooms: z.number().optional().nullable(),
  area: z.number().optional().nullable(),
  images: z.array(z.string()),
});

export const Property = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
});

export const PropertyDetail = z.any();
export const PropertyListResponse = z.any();
export const SendMessageBody = z.object({
  propertyId: z.number(),
  content: z.string(),
});
export const Message = z.any();
export const CreateReviewBody = z.object({
  rating: z.number(),
  comment: z.string(),
});
export const Review = z.any();
export const AdminStats = z.any();
export const UpdateUserRoleBody = z.object({
  role: z.enum(["user", "agent", "admin"]),
});
export const SuccessResponse = z.object({
  success: z.boolean(),
  message: z.string(),
});
