import { 
  useListProperties, 
  useGetProperty, 
  useCreateProperty, 
  useUpdateProperty, 
  useDeleteProperty,
  useGetFeaturedProperties,
  useGetSimilarProperties,
  ListPropertiesParams,
  CreatePropertyRequest
} from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export function useProperties(params?: ListPropertiesParams) {
  return useListProperties(params, { request: { headers: getAuthHeaders() } });
}

export function useFeaturedProperties() {
  return useGetFeaturedProperties({ request: { headers: getAuthHeaders() } });
}

export function useProperty(id: number) {
  return useGetProperty(id, { request: { headers: getAuthHeaders() } });
}

export function useSimilarProperties(id: number) {
  return useGetSimilarProperties(id, { request: { headers: getAuthHeaders() } });
}

export function useCreatePropertyHook() {
  const queryClient = useQueryClient();
  return useCreateProperty({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      }
    }
  });
}

export function useUpdatePropertyHook() {
  const queryClient = useQueryClient();
  return useUpdateProperty({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
        queryClient.invalidateQueries({ queryKey: [`/api/properties/${variables.id}`] });
      }
    }
  });
}

export function useDeletePropertyHook() {
  const queryClient = useQueryClient();
  return useDeleteProperty({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      }
    }
  });
}
