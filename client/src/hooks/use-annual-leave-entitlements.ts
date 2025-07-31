import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { AnnualLeaveEntitlement, InsertAnnualLeaveEntitlement } from "@shared/schema";

export function useAnnualLeaveEntitlements() {
  return useQuery<AnnualLeaveEntitlement[]>({
    queryKey: ["/api/annual-leave-entitlements"],
  });
}

export function useAnnualLeaveEntitlementsByEmployee(employeeId: string) {
  return useQuery<AnnualLeaveEntitlement[]>({
    queryKey: ["/api/annual-leave-entitlements", "employee", employeeId],
    enabled: !!employeeId,
  });
}

export function useCreateAnnualLeaveEntitlement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (entitlement: InsertAnnualLeaveEntitlement) => {
      const response = await apiRequest("POST", "/api/annual-leave-entitlements", entitlement);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/annual-leave-entitlements"] });
    },
  });
}

export function useUpdateAnnualLeaveEntitlement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, entitlement }: { id: string; entitlement: Partial<AnnualLeaveEntitlement> }) => {
      const response = await apiRequest("PUT", `/api/annual-leave-entitlements/${id}`, entitlement);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/annual-leave-entitlements"] });
    },
  });
}
