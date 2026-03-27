import { 
  useGetFavorites, 
  useAddFavorite, 
  useRemoveFavorite,
  useGetMessages,
  useSendMessage,
  useGetPropertyReviews,
  useCreateReview,
  SendMessageRequest,
  CreateReviewRequest
} from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

// Favorites
export function useFavorites() {
  return useGetFavorites({ request: { headers: getAuthHeaders() } });
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const addFav = useAddFavorite({ request: { headers: getAuthHeaders() } });
  const remFav = useRemoveFavorite({ request: { headers: getAuthHeaders() } });

  const toggle = async (propertyId: number, isCurrentlyFavorited: boolean) => {
    if (isCurrentlyFavorited) {
      await remFav.mutateAsync({ propertyId });
    } else {
      await addFav.mutateAsync({ propertyId });
    }
    // Invalidate multiple queries that might contain the property
    queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
    queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}`] });
  };

  return { toggle, isLoading: addFav.isPending || remFav.isPending };
}

// Messages
export function useMessages() {
  return useGetMessages({ request: { headers: getAuthHeaders() } });
}

export function useSendMessageHook() {
  const queryClient = useQueryClient();
  return useSendMessage({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/messages"] })
    }
  });
}

// Reviews
export function useReviews(propertyId: number) {
  return useGetPropertyReviews(propertyId, { request: { headers: getAuthHeaders() } });
}

export function useCreateReviewHook() {
  const queryClient = useQueryClient();
  return useCreateReview({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: (_, vars) => {
        queryClient.invalidateQueries({ queryKey: [`/api/reviews/${vars.propertyId}`] });
        queryClient.invalidateQueries({ queryKey: [`/api/properties/${vars.propertyId}`] });
      }
    }
  });
}
