import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { HolidaySchedule, InsertHolidaySchedule } from "@shared/schema";

export function useHolidaySchedules() {
  return useQuery<HolidaySchedule[]>({
    queryKey: ["/api/holiday-schedules"],
  });
}

export function useCreateHolidaySchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (holidaySchedule: InsertHolidaySchedule) => {
      const response = await apiRequest("POST", "/api/holiday-schedules", holidaySchedule);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/holiday-schedules"] });
    },
  });
}

export function useUpdateHolidaySchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, holidaySchedule }: { id: string; holidaySchedule: Partial<HolidaySchedule> }) => {
      const response = await apiRequest("PUT", `/api/holiday-schedules/${id}`, holidaySchedule);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/holiday-schedules"] });
    },
  });
}

export function useDeleteHolidaySchedule() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/holiday-schedules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/holiday-schedules"] });
    },
  });
}
