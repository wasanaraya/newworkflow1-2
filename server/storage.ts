import { db } from "./db.js";
import { employees, departments, positions, leaveRequests, shiftChangeRequests, holidaySchedules, annualLeaveEntitlements, userPermissions, permissionCategories } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import type { 
  Employee, 
  InsertEmployee, 
  Department, 
  InsertDepartment, 
  Position, 
  InsertPosition,
  LeaveRequest,
  InsertLeaveRequest,
  ShiftChangeRequest,
  InsertShiftChangeRequest,
  HolidaySchedule,
  InsertHolidaySchedule,
  AnnualLeaveEntitlement,
  InsertAnnualLeaveEntitlement,
  UserPermission,
  InsertUserPermission,
  PermissionCategory,
  InsertPermissionCategory
} from "@shared/schema";

class NeonStorage {
  // Employee methods
  async getEmployees(): Promise<Employee[]> {
    try {
      console.log('📊 Fetching employees from Neon database...');
      const result = await db.select().from(employees).orderBy(desc(employees.id));
      console.log('✅ Fetched employees from Neon:', result.length);
      return result;
    } catch (error) {
      console.error('❌ Error fetching employees from Neon:', error);
      throw new Error(`Failed to fetch employees: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getEmployee(id: string): Promise<Employee | null> {
    try {
      console.log('📊 Fetching employee from Neon:', id);
      const result = await db.select().from(employees).where(eq(employees.id, id)).limit(1);
      const employee = result[0] || null;
      console.log('✅ Fetched employee from Neon:', employee ? 'found' : 'not found');
      return employee;
    } catch (error) {
      console.error('❌ Error fetching employee from Neon:', error);
      throw new Error(`Failed to fetch employee: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    try {
      console.log('➕ Creating employee in Neon:', employee);
      const result = await db.insert(employees).values(employee).returning();
      const newEmployee = result[0];
      console.log('✅ Created employee in Neon:', newEmployee.id);
      return newEmployee;
    } catch (error) {
      console.error('❌ Error creating employee in Neon:', error);
      throw new Error(`Failed to create employee: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | null> {
    try {
      console.log('📝 Updating employee in Neon:', id, employee);
      const result = await db.update(employees).set(employee).where(eq(employees.id, id)).returning();
      const updatedEmployee = result[0] || null;
      console.log('✅ Updated employee in Neon:', updatedEmployee ? 'success' : 'not found');
      return updatedEmployee;
    } catch (error) {
      console.error('❌ Error updating employee in Neon:', error);
      throw new Error(`Failed to update employee: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteEmployee(id: string): Promise<boolean> {
    try {
      console.log('🗑️ Deleting employee from Neon:', id);
      const result = await db.delete(employees).where(eq(employees.id, id)).returning();
      const success = result.length > 0;
      console.log('✅ Deleted employee from Neon:', success ? 'success' : 'not found');
      return success;
    } catch (error) {
      console.error('❌ Error deleting employee from Neon:', error);
      throw new Error(`Failed to delete employee: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Department methods
  async getDepartments(): Promise<Department[]> {
    try {
      console.log('📊 Fetching departments from Neon...');
      const result = await db.select().from(departments).orderBy(desc(departments.id));
      console.log('✅ Fetched departments from Neon:', result.length);
      return result;
    } catch (error) {
      console.error('❌ Error fetching departments from Neon:', error);
      throw new Error(`Failed to fetch departments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createDepartment(department: InsertDepartment): Promise<Department> {
    try {
      console.log('➕ Creating department in Neon:', department);
      const result = await db.insert(departments).values(department).returning();
      const newDepartment = result[0];
      console.log('✅ Created department in Neon:', newDepartment.id);
      return newDepartment;
    } catch (error) {
      console.error('❌ Error creating department in Neon:', error);
      throw new Error(`Failed to create department: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department | null> {
    try {
      console.log('📝 Updating department in Neon:', id, department);
      const result = await db.update(departments).set(department).where(eq(departments.id, id)).returning();
      const updatedDepartment = result[0] || null;
      console.log('✅ Updated department in Neon:', updatedDepartment ? 'success' : 'not found');
      return updatedDepartment;
    } catch (error) {
      console.error('❌ Error updating department in Neon:', error);
      throw new Error(`Failed to update department: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteDepartment(id: number): Promise<boolean> {
    try {
      console.log('🗑️ Deleting department from Neon:', id);
      const result = await db.delete(departments).where(eq(departments.id, id)).returning();
      const success = result.length > 0;
      console.log('✅ Deleted department from Neon:', success ? 'success' : 'not found');
      return success;
    } catch (error) {
      console.error('❌ Error deleting department from Neon:', error);
      throw new Error(`Failed to delete department: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Position methods
  async getPositions(): Promise<Position[]> {
    try {
      console.log('📊 Fetching positions from Neon...');
      const result = await db.select().from(positions).orderBy(desc(positions.id));
      console.log('✅ Fetched positions from Neon:', result.length);
      return result;
    } catch (error) {
      console.error('❌ Error fetching positions from Neon:', error);
      throw new Error(`Failed to fetch positions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createPosition(position: InsertPosition): Promise<Position> {
    try {
      console.log('➕ Creating position in Neon:', position);
      const result = await db.insert(positions).values(position).returning();
      const newPosition = result[0];
      console.log('✅ Created position in Neon:', newPosition.id);
      return newPosition;
    } catch (error) {
      console.error('❌ Error creating position in Neon:', error);
      throw new Error(`Failed to create position: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePosition(id: number, position: Partial<InsertPosition>): Promise<Position | null> {
    try {
      console.log('📝 Updating position in Neon:', id, position);
      const result = await db.update(positions).set(position).where(eq(positions.id, id)).returning();
      const updatedPosition = result[0] || null;
      console.log('✅ Updated position in Neon:', updatedPosition ? 'success' : 'not found');
      return updatedPosition;
    } catch (error) {
      console.error('❌ Error updating position in Neon:', error);
      throw new Error(`Failed to update position: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deletePosition(id: number): Promise<boolean> {
    try {
      console.log('🗑️ Deleting position from Neon:', id);
      const result = await db.delete(positions).where(eq(positions.id, id)).returning();
      const success = result.length > 0;
      console.log('✅ Deleted position from Neon:', success ? 'success' : 'not found');
      return success;
    } catch (error) {
      console.error('❌ Error deleting position from Neon:', error);
      throw new Error(`Failed to delete position: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Leave Request methods
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      console.log('📊 Fetching leave requests from Neon...');
      const result = await db.select().from(leaveRequests).orderBy(desc(leaveRequests.requestDate));
      console.log('✅ Fetched leave requests from Neon:', result.length);
      return result;
    } catch (error) {
      console.error('❌ Error fetching leave requests from Neon:', error);
      throw new Error(`Failed to fetch leave requests: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createLeaveRequest(leaveRequest: InsertLeaveRequest): Promise<LeaveRequest> {
    try {
      console.log('➕ Creating leave request in Neon:', leaveRequest);
      const requestWithDate = {
        ...leaveRequest,
        requestDate: new Date().toISOString().split('T')[0]
      };
      const result = await db.insert(leaveRequests).values(requestWithDate).returning();
      const newLeaveRequest = result[0];
      console.log('✅ Created leave request in Neon:', newLeaveRequest.id);
      return newLeaveRequest;
    } catch (error) {
      console.error('❌ Error creating leave request in Neon:', error);
      throw new Error(`Failed to create leave request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateLeaveRequest(id: string, leaveRequest: Partial<LeaveRequest>): Promise<LeaveRequest | null> {
    try {
      console.log('📝 Updating leave request in Neon:', id, leaveRequest);
      const result = await db.update(leaveRequests).set(leaveRequest).where(eq(leaveRequests.id, id)).returning();
      const updatedLeaveRequest = result[0] || null;
      console.log('✅ Updated leave request in Neon:', updatedLeaveRequest ? 'success' : 'not found');
      return updatedLeaveRequest;
    } catch (error) {
      console.error('❌ Error updating leave request in Neon:', error);
      throw new Error(`Failed to update leave request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteLeaveRequest(id: string): Promise<boolean> {
    try {
      console.log('🗑️ Deleting leave request from Neon:', id);
      const result = await db.delete(leaveRequests).where(eq(leaveRequests.id, id)).returning();
      const success = result.length > 0;
      console.log('✅ Deleted leave request from Neon:', success ? 'success' : 'not found');
      return success;
    } catch (error) {
      console.error('❌ Error deleting leave request from Neon:', error);
      throw new Error(`Failed to delete leave request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Shift Change Request methods
  async getShiftChangeRequests(): Promise<ShiftChangeRequest[]> {
    try {
      console.log('📊 Fetching shift change requests from Neon...');
      const result = await db.select().from(shiftChangeRequests).orderBy(desc(shiftChangeRequests.requestDate));
      console.log('✅ Fetched shift change requests from Neon:', result.length);
      return result;
    } catch (error) {
      console.error('❌ Error fetching shift change requests from Neon:', error);
      throw new Error(`Failed to fetch shift change requests: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createShiftChangeRequest(shiftChangeRequest: InsertShiftChangeRequest): Promise<ShiftChangeRequest> {
    try {
      console.log('➕ Creating shift change request in Neon:', shiftChangeRequest);
      const requestWithDate = {
        ...shiftChangeRequest,
        requestDate: new Date().toISOString().split('T')[0]
      };
      const result = await db.insert(shiftChangeRequests).values(requestWithDate).returning();
      const newShiftChangeRequest = result[0];
      console.log('✅ Created shift change request in Neon:', newShiftChangeRequest.id);
      return newShiftChangeRequest;
    } catch (error) {
      console.error('❌ Error creating shift change request in Neon:', error);
      throw new Error(`Failed to create shift change request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateShiftChangeRequest(id: string, shiftChangeRequest: Partial<ShiftChangeRequest>): Promise<ShiftChangeRequest | null> {
    try {
      console.log('📝 Updating shift change request in Neon:', id, shiftChangeRequest);
      const result = await db.update(shiftChangeRequests).set(shiftChangeRequest).where(eq(shiftChangeRequests.id, id)).returning();
      const updatedShiftChangeRequest = result[0] || null;
      console.log('✅ Updated shift change request in Neon:', updatedShiftChangeRequest ? 'success' : 'not found');
      return updatedShiftChangeRequest;
    } catch (error) {
      console.error('❌ Error updating shift change request in Neon:', error);
      throw new Error(`Failed to update shift change request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteShiftChangeRequest(id: string): Promise<boolean> {
    try {
      console.log('🗑️ Deleting shift change request from Neon:', id);
      const result = await db.delete(shiftChangeRequests).where(eq(shiftChangeRequests.id, id)).returning();
      const success = result.length > 0;
      console.log('✅ Deleted shift change request from Neon:', success ? 'success' : 'not found');
      return success;
    } catch (error) {
      console.error('❌ Error deleting shift change request from Neon:', error);
      throw new Error(`Failed to delete shift change request: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Holiday Schedule methods
  async getHolidaySchedules(): Promise<HolidaySchedule[]> {
    try {
      console.log('📊 Fetching holiday schedules from Neon...');
      const result = await db.select().from(holidaySchedules).orderBy(desc(holidaySchedules.date));
      console.log('✅ Fetched holiday schedules from Neon:', result.length);
      return result;
    } catch (error) {
      console.error('❌ Error fetching holiday schedules from Neon:', error);
      throw new Error(`Failed to fetch holiday schedules: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createHolidaySchedule(holidaySchedule: InsertHolidaySchedule): Promise<HolidaySchedule> {
    try {
      console.log('➕ Creating holiday schedule in Neon:', holidaySchedule);
      const result = await db.insert(holidaySchedules).values(holidaySchedule).returning();
      const newHolidaySchedule = result[0];
      console.log('✅ Created holiday schedule in Neon:', newHolidaySchedule.id);
      return newHolidaySchedule;
    } catch (error) {
      console.error('❌ Error creating holiday schedule in Neon:', error);
      throw new Error(`Failed to create holiday schedule: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateHolidaySchedule(id: string, holidaySchedule: Partial<HolidaySchedule>): Promise<HolidaySchedule | null> {
    try {
      console.log('📝 Updating holiday schedule in Neon:', id, holidaySchedule);
      const result = await db.update(holidaySchedules).set(holidaySchedule).where(eq(holidaySchedules.id, id)).returning();
      const updatedHolidaySchedule = result[0] || null;
      console.log('✅ Updated holiday schedule in Neon:', updatedHolidaySchedule ? 'success' : 'not found');
      return updatedHolidaySchedule;
    } catch (error) {
      console.error('❌ Error updating holiday schedule in Neon:', error);
      throw new Error(`Failed to update holiday schedule: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteHolidaySchedule(id: string): Promise<boolean> {
    try {
      console.log('🗑️ Deleting holiday schedule from Neon:', id);
      const result = await db.delete(holidaySchedules).where(eq(holidaySchedules.id, id)).returning();
      const success = result.length > 0;
      console.log('✅ Deleted holiday schedule from Neon:', success ? 'success' : 'not found');
      return success;
    } catch (error) {
      console.error('❌ Error deleting holiday schedule from Neon:', error);
      throw new Error(`Failed to delete holiday schedule: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Annual Leave Entitlement methods
  async getAnnualLeaveEntitlements(): Promise<AnnualLeaveEntitlement[]> {
    try {
      console.log('📊 Fetching annual leave entitlements from Neon...');
      const result = await db.select().from(annualLeaveEntitlements).orderBy(desc(annualLeaveEntitlements.year));
      console.log('✅ Fetched annual leave entitlements from Neon:', result.length);
      return result;
    } catch (error) {
      console.error('❌ Error fetching annual leave entitlements from Neon:', error);
      throw new Error(`Failed to fetch annual leave entitlements: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getAnnualLeaveEntitlementsByEmployee(employeeId: string): Promise<AnnualLeaveEntitlement[]> {
    try {
      console.log('📊 Fetching annual leave entitlements by employee from Neon:', employeeId);
      const result = await db.select().from(annualLeaveEntitlements).where(eq(annualLeaveEntitlements.employeeId, employeeId)).orderBy(desc(annualLeaveEntitlements.year));
      console.log('✅ Fetched annual leave entitlements by employee from Neon:', result.length);
      return result;
    } catch (error) {
      console.error('❌ Error fetching annual leave entitlements by employee from Neon:', error);
      throw new Error(`Failed to fetch annual leave entitlements: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createAnnualLeaveEntitlement(entitlement: InsertAnnualLeaveEntitlement): Promise<AnnualLeaveEntitlement> {
    try {
      console.log('➕ Creating annual leave entitlement in Neon:', entitlement);
      const result = await db.insert(annualLeaveEntitlements).values(entitlement).returning();
      const newEntitlement = result[0];
      console.log('✅ Created annual leave entitlement in Neon:', newEntitlement.id);
      return newEntitlement;
    } catch (error) {
      console.error('❌ Error creating annual leave entitlement in Neon:', error);
      throw new Error(`Failed to create annual leave entitlement: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateAnnualLeaveEntitlement(id: string, entitlement: Partial<AnnualLeaveEntitlement>): Promise<AnnualLeaveEntitlement | null> {
    try {
      console.log('📝 Updating annual leave entitlement in Neon:', id, entitlement);
      const result = await db.update(annualLeaveEntitlements).set(entitlement).where(eq(annualLeaveEntitlements.id, id)).returning();
      const updatedEntitlement = result[0] || null;
      console.log('✅ Updated annual leave entitlement in Neon:', updatedEntitlement ? 'success' : 'not found');
      return updatedEntitlement;
    } catch (error) {
      console.error('❌ Error updating annual leave entitlement in Neon:', error);
      throw new Error(`Failed to update annual leave entitlement: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // User Permission methods
  async getUserPermissions(userId: string): Promise<UserPermission[]> {
    try {
      console.log('📊 Fetching user permissions from Neon:', userId);
      const result = await db.select().from(userPermissions).where(eq(userPermissions.userId, userId)).orderBy(desc(userPermissions.grantedAt));
      console.log('✅ Fetched user permissions from Neon:', result.length);
      return result;
    } catch (error) {
      console.error('❌ Error fetching user permissions from Neon:', error);
      throw new Error(`Failed to fetch user permissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createUserPermission(permission: InsertUserPermission): Promise<UserPermission> {
    try {
      console.log('➕ Creating user permission in Neon:', permission);
      const result = await db.insert(userPermissions).values(permission).returning();
      const newPermission = result[0];
      console.log('✅ Created user permission in Neon:', newPermission.id);
      return newPermission;
    } catch (error) {
      console.error('❌ Error creating user permission in Neon:', error);
      throw new Error(`Failed to create user permission: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updateUserPermission(id: number, permission: Partial<UserPermission>): Promise<UserPermission | null> {
    try {
      console.log('📝 Updating user permission in Neon:', id, permission);
      const result = await db.update(userPermissions).set(permission).where(eq(userPermissions.id, id)).returning();
      const updatedPermission = result[0] || null;
      console.log('✅ Updated user permission in Neon:', updatedPermission ? 'success' : 'not found');
      return updatedPermission;
    } catch (error) {
      console.error('❌ Error updating user permission in Neon:', error);
      throw new Error(`Failed to update user permission: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deleteUserPermission(id: number): Promise<boolean> {
    try {
      console.log('🗑️ Deleting user permission from Neon:', id);
      const result = await db.delete(userPermissions).where(eq(userPermissions.id, id)).returning();
      const success = result.length > 0;
      console.log('✅ Deleted user permission from Neon:', success ? 'success' : 'not found');
      return success;
    } catch (error) {
      console.error('❌ Error deleting user permission from Neon:', error);
      throw new Error(`Failed to delete user permission: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Permission Category methods
  async getPermissionCategories(): Promise<PermissionCategory[]> {
    try {
      console.log('📊 Fetching permission categories from Neon...');
      const result = await db.select().from(permissionCategories).orderBy(desc(permissionCategories.id));
      console.log('✅ Fetched permission categories from Neon:', result.length);
      return result;
    } catch (error) {
      console.error('❌ Error fetching permission categories from Neon:', error);
      throw new Error(`Failed to fetch permission categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async createPermissionCategory(category: InsertPermissionCategory): Promise<PermissionCategory> {
    try {
      console.log('➕ Creating permission category in Neon:', category);
      const result = await db.insert(permissionCategories).values(category).returning();
      const newCategory = result[0];
      console.log('✅ Created permission category in Neon:', newCategory.id);
      return newCategory;
    } catch (error) {
      console.error('❌ Error creating permission category in Neon:', error);
      throw new Error(`Failed to create permission category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async updatePermissionCategory(id: number, category: Partial<PermissionCategory>): Promise<PermissionCategory | null> {
    try {
      console.log('📝 Updating permission category in Neon:', id, category);
      const result = await db.update(permissionCategories).set(category).where(eq(permissionCategories.id, id)).returning();
      const updatedCategory = result[0] || null;
      console.log('✅ Updated permission category in Neon:', updatedCategory ? 'success' : 'not found');
      return updatedCategory;
    } catch (error) {
      console.error('❌ Error updating permission category in Neon:', error);
      throw new Error(`Failed to update permission category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async deletePermissionCategory(id: number): Promise<boolean> {
    try {
      console.log('🗑️ Deleting permission category from Neon:', id);
      const result = await db.delete(permissionCategories).where(eq(permissionCategories.id, id)).returning();
      const success = result.length > 0;
      console.log('✅ Deleted permission category from Neon:', success ? 'success' : 'not found');
      return success;
    } catch (error) {
      console.error('❌ Error deleting permission category from Neon:', error);
      throw new Error(`Failed to delete permission category: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const storage = new NeonStorage();