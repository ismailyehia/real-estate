import { 
  useGetAdminStats, 
  useGetAdminUsers, 
  useUpdateUserRole, 
  useDeleteUser 
} from "@workspace/api-client-react";
import { getAuthHeaders } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

export function useAdminStats() {
  return useGetAdminStats({ request: { headers: getAuthHeaders() } });
}

export function useAdminUsers() {
  return useGetAdminUsers({ request: { headers: getAuthHeaders() } });
}

export function useUpdateUserRoleHook() {
  const queryClient = useQueryClient();
  return useUpdateUserRole({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] })
    }
  });
}

export function useDeleteUserHook() {
  const queryClient = useQueryClient();
  return useDeleteUser({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] })
    }
  });
}
