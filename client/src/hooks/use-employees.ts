import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Employee, InsertEmployee } from "@shared/schema";

const API_BASE = "/api/employees";

async function fetchEmployees(): Promise<Employee[]> {
  console.log('🔍 Fetching employees from API...');
  
  const response = await fetch(API_BASE, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    console.error('❌ Failed to fetch employees:', response.status, response.statusText);
    throw new Error("Failed to fetch employees");
  }
  const data = await response.json();
  console.log('✅ Fetched employees from API:', data?.length || 0);
  return data;
}

async function createEmployee(employee: InsertEmployee): Promise<Employee> {
  console.log('➕ Creating employee via API:', employee);
  
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Failed to create employee:', errorText);
    throw new Error(`Failed to create employee: ${errorText}`);
  }
  const data = await response.json();
  console.log('✅ Created employee via API:', data);
  return data;
}

async function updateEmployee({ id, ...employee }: { id: string } & Partial<InsertEmployee>): Promise<Employee> {
  console.log('📝 Updating employee via API:', id, employee);
  
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Failed to update employee:', errorText);
    throw new Error(`Failed to update employee: ${errorText}`);
  }
  const data = await response.json();
  console.log('✅ Updated employee via API:', data);
  return data;
}

async function deleteEmployee(id: string): Promise<void> {
  console.log('🗑️ Deleting employee via API:', id);
  
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Delete employee failed:', response.status, errorText);
    throw new Error(`Failed to delete employee: ${errorText}`);
  }
  console.log('✅ Employee deleted successfully via API:', id);
}

export function useEmployees() {
  return useQuery({
    queryKey: [API_BASE],
    queryFn: fetchEmployees,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors
      if (error instanceof Error && error.message.includes('4')) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_BASE] });
    },
  });
}