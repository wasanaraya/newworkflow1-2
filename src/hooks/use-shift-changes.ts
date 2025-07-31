import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ShiftChangeRequest, InsertShiftChangeRequest } from "@shared/schema";

export function useShiftChangeRequests() {
  return useQuery<ShiftChangeRequest[]>({
    queryKey: ["/api/shift-changes"],
  });
}

export function useCreateShiftChangeRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (shiftChangeRequest: InsertShiftChangeRequest) => {
      const response = await apiRequest("POST", "/api/shift-changes", shiftChangeRequest);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shift-changes"] });
    },
  });
}

export function useUpdateShiftChangeRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, shiftChangeRequest }: { id: string; shiftChangeRequest: Partial<ShiftChangeRequest> }) => {
      const response = await apiRequest("PUT", `/api/shift-changes/${id}`, shiftChangeRequest);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shift-changes"] });
    },
  });
}

export function useDeleteShiftChangeRequest() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/shift-changes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shift-changes"] });
    },
  });
}
