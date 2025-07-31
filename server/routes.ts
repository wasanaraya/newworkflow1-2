import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertEmployeeSchema, insertDepartmentSchema, insertPositionSchema, insertLeaveRequestSchema, insertShiftChangeRequestSchema, insertHolidayScheduleSchema, insertAnnualLeaveEntitlementSchema, insertUserPermissionSchema, insertPermissionCategorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Add error handling middleware for API routes
  app.use('/api', (req, res, next) => {
    console.log(`🌐 API Request: ${req.method} ${req.path}`);
    next();
  });

  // Employees
  app.get("/api/employees", async (req, res) => {
    try {
      console.log('📊 GET /api/employees');
      const employees = await storage.getEmployees();
      console.log('✅ Returning employees:', employees.length);
      res.json(employees);
    } catch (error) {
      console.error('❌ GET /api/employees error:', error);
      res.status(500).json({ message: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      console.log('📊 GET /api/employees/:id', req.params.id);
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      console.error('❌ GET /api/employees/:id error:', error);
      res.status(500).json({ message: "Failed to fetch employee" });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      console.log('📊 POST /api/employees', req.body);
      const validatedData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(validatedData);
      res.status(201).json(employee);
    } catch (error) {
      console.error('❌ POST /api/employees error:', error);
      res.status(400).json({ message: "Invalid employee data" });
    }
  });

  app.put("/api/employees/:id", async (req, res) => {
    try {
      console.log('📊 PUT /api/employees/:id', req.params.id, req.body);
      const validatedData = insertEmployeeSchema.partial().parse(req.body);
      const employee = await storage.updateEmployee(req.params.id, validatedData);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      console.error('❌ PUT /api/employees/:id error:', error);
      res.status(400).json({ message: "Invalid employee data" });
    }
  });

  app.delete("/api/employees/:id", async (req, res) => {
    try {
      console.log('📊 DELETE /api/employees/:id', req.params.id);
      const success = await storage.deleteEmployee(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Employee not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('❌ DELETE /api/employees/:id error:', error);
      res.status(500).json({ message: "Failed to delete employee" });
    }
  });

  // Departments
  app.get("/api/departments", async (req, res) => {
    try {
      console.log('📊 GET /api/departments');
      const departments = await storage.getDepartments();
      console.log('✅ Returning departments:', departments.length);
      res.json(departments);
    } catch (error) {
      console.error('❌ GET /api/departments error:', error);
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  app.post("/api/departments", async (req, res) => {
    try {
      console.log('📊 POST /api/departments', req.body);
      const validatedData = insertDepartmentSchema.parse(req.body);
      const department = await storage.createDepartment(validatedData);
      res.status(201).json(department);
    } catch (error) {
      console.error('❌ POST /api/departments error:', error);
      res.status(400).json({ message: "Invalid department data" });
    }
  });

  app.put("/api/departments/:id", async (req, res) => {
    try {
      console.log('📊 PUT /api/departments/:id', req.params.id, req.body);
      const validatedData = insertDepartmentSchema.partial().parse(req.body);
      const department = await storage.updateDepartment(parseInt(req.params.id), validatedData);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      res.json(department);
    } catch (error) {
      console.error('❌ PUT /api/departments/:id error:', error);
      res.status(400).json({ message: "Invalid department data" });
    }
  });

  app.delete("/api/departments/:id", async (req, res) => {
    try {
      console.log('📊 DELETE /api/departments/:id', req.params.id);
      const deleted = await storage.deleteDepartment(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Department not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('❌ DELETE /api/departments/:id error:', error);
      res.status(500).json({ message: "Failed to delete department" });
    }
  });

  // Positions
  app.get("/api/positions", async (req, res) => {
    try {
      console.log('📊 GET /api/positions');
      const positions = await storage.getPositions();
      console.log('✅ Returning positions:', positions.length);
      res.json(positions);
    } catch (error) {
      console.error('❌ GET /api/positions error:', error);
      res.status(500).json({ message: "Failed to fetch positions" });
    }
  });

  app.post("/api/positions", async (req, res) => {
    try {
      console.log('📊 POST /api/positions', req.body);
      const validatedData = insertPositionSchema.parse(req.body);
      const position = await storage.createPosition(validatedData);
      res.status(201).json(position);
    } catch (error) {
      console.error('❌ POST /api/positions error:', error);
      res.status(400).json({ message: "Invalid position data" });
    }
  });

  app.put("/api/positions/:id", async (req, res) => {
    try {
      console.log('📊 PUT /api/positions/:id', req.params.id, req.body);
      const validatedData = insertPositionSchema.partial().parse(req.body);
      const position = await storage.updatePosition(parseInt(req.params.id), validatedData);
      if (!position) {
        return res.status(404).json({ message: "Position not found" });
      }
      res.json(position);
    } catch (error) {
      console.error('❌ PUT /api/positions/:id error:', error);
      res.status(400).json({ message: "Invalid position data" });
    }
  });

  app.delete("/api/positions/:id", async (req, res) => {
    try {
      console.log('📊 DELETE /api/positions/:id', req.params.id);
      const deleted = await storage.deletePosition(parseInt(req.params.id));
      if (!deleted) {
        return res.status(404).json({ message: "Position not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('❌ DELETE /api/positions/:id error:', error);
      res.status(500).json({ message: "Failed to delete position" });
    }
  });

  // Leave Requests
  app.get("/api/leave-requests", async (req, res) => {
    try {
      console.log('📊 GET /api/leave-requests');
      const leaveRequests = await storage.getLeaveRequests();
      console.log('✅ Returning leave requests:', leaveRequests.length);
      res.json(leaveRequests);
    } catch (error) {
      console.error('❌ GET /api/leave-requests error:', error);
      res.status(500).json({ message: "Failed to fetch leave requests" });
    }
  });

  app.post("/api/leave-requests", async (req, res) => {
    try {
      console.log('📊 POST /api/leave-requests', req.body);
      const validatedData = insertLeaveRequestSchema.parse(req.body);
      const leaveRequest = await storage.createLeaveRequest(validatedData);
      res.status(201).json(leaveRequest);
    } catch (error) {
      console.error('❌ POST /api/leave-requests error:', error);
      res.status(400).json({ message: "Invalid leave request data" });
    }
  });

  app.put("/api/leave-requests/:id", async (req, res) => {
    try {
      console.log('📊 PUT /api/leave-requests/:id', req.params.id, req.body);
      const leaveRequest = await storage.updateLeaveRequest(req.params.id, req.body);
      if (!leaveRequest) {
        return res.status(404).json({ message: "Leave request not found" });
      }
      res.json(leaveRequest);
    } catch (error) {
      console.error("Update leave request error:", error);
      res.status(400).json({ message: "Invalid leave request data" });
    }
  });

  app.delete("/api/leave-requests/:id", async (req, res) => {
    try {
      console.log('📊 DELETE /api/leave-requests/:id', req.params.id);
      const deleted = await storage.deleteLeaveRequest(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Leave request not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('❌ DELETE /api/leave-requests/:id error:', error);
      res.status(500).json({ message: "Failed to delete leave request" });
    }
  });

  // Shift Change Requests
  app.get("/api/shift-changes", async (req, res) => {
    try {
      console.log('📊 GET /api/shift-changes');
      const shiftChangeRequests = await storage.getShiftChangeRequests();
      console.log('✅ Returning shift change requests:', shiftChangeRequests.length);
      res.json(shiftChangeRequests);
    } catch (error) {
      console.error('❌ GET /api/shift-changes error:', error);
      res.status(500).json({ message: "Failed to fetch shift change requests" });
    }
  });

  app.post("/api/shift-changes", async (req, res) => {
    try {
      console.log('📊 POST /api/shift-changes', req.body);
      const validatedData = insertShiftChangeRequestSchema.parse(req.body);
      const shiftChangeRequest = await storage.createShiftChangeRequest(validatedData);
      res.status(201).json(shiftChangeRequest);
    } catch (error) {
      console.error('❌ POST /api/shift-changes error:', error);
      res.status(400).json({ message: "Invalid shift change request data" });
    }
  });

  app.put("/api/shift-changes/:id", async (req, res) => {
    try {
      console.log('📊 PUT /api/shift-changes/:id', req.params.id, req.body);
      const shiftChangeRequest = await storage.updateShiftChangeRequest(req.params.id, req.body);
      if (!shiftChangeRequest) {
        return res.status(404).json({ message: "Shift change request not found" });
      }
      res.json(shiftChangeRequest);
    } catch (error) {
      console.error("Update shift change request error:", error);
      res.status(400).json({ message: "Invalid shift change request data" });
    }
  });

  app.delete("/api/shift-changes/:id", async (req, res) => {
    try {
      console.log('📊 DELETE /api/shift-changes/:id', req.params.id);
      const deleted = await storage.deleteShiftChangeRequest(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Shift change request not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('❌ DELETE /api/shift-changes/:id error:', error);
      res.status(500).json({ message: "Failed to delete shift change request" });
    }
  });

  // Holiday Schedules
  app.get("/api/holiday-schedules", async (req, res) => {
    try {
      console.log('📊 GET /api/holiday-schedules');
      const holidaySchedules = await storage.getHolidaySchedules();
      console.log('✅ Returning holiday schedules:', holidaySchedules.length);
      res.json(holidaySchedules);
    } catch (error) {
      console.error('❌ GET /api/holiday-schedules error:', error);
      res.status(500).json({ message: "Failed to fetch holiday schedules" });
    }
  });

  app.post("/api/holiday-schedules", async (req, res) => {
    try {
      console.log('📊 POST /api/holiday-schedules', req.body);
      const validatedData = insertHolidayScheduleSchema.parse(req.body);
      const holidaySchedule = await storage.createHolidaySchedule(validatedData);
      res.status(201).json(holidaySchedule);
    } catch (error) {
      console.error('❌ POST /api/holiday-schedules error:', error);
      res.status(400).json({ message: "Invalid holiday schedule data" });
    }
  });

  app.put("/api/holiday-schedules/:id", async (req, res) => {
    try {
      console.log('📊 PUT /api/holiday-schedules/:id', req.params.id, req.body);
      const holidaySchedule = await storage.updateHolidaySchedule(req.params.id, req.body);
      if (!holidaySchedule) {
        return res.status(404).json({ message: "Holiday schedule not found" });
      }
      res.json(holidaySchedule);
    } catch (error) {
      console.error('❌ PUT /api/holiday-schedules/:id error:', error);
      res.status(400).json({ message: "Invalid holiday schedule data" });
    }
  });

  app.delete("/api/holiday-schedules/:id", async (req, res) => {
    try {
      console.log('📊 DELETE /api/holiday-schedules/:id', req.params.id);
      const deleted = await storage.deleteHolidaySchedule(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Holiday schedule not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('❌ DELETE /api/holiday-schedules/:id error:', error);
      res.status(500).json({ message: "Failed to delete holiday schedule" });
    }
  });

  // Annual Leave Entitlements
  app.get("/api/annual-leave-entitlements", async (req, res) => {
    try {
      console.log('📊 GET /api/annual-leave-entitlements');
      const entitlements = await storage.getAnnualLeaveEntitlements();
      console.log('✅ Returning annual leave entitlements:', entitlements.length);
      res.json(entitlements);
    } catch (error) {
      console.error('❌ GET /api/annual-leave-entitlements error:', error);
      res.status(500).json({ message: "Failed to fetch annual leave entitlements" });
    }
  });

  app.get("/api/annual-leave-entitlements/employee/:employeeId", async (req, res) => {
    try {
      console.log('📊 GET /api/annual-leave-entitlements/employee/:employeeId', req.params.employeeId);
      const entitlements = await storage.getAnnualLeaveEntitlementsByEmployee(req.params.employeeId);
      res.json(entitlements);
    } catch (error) {
      console.error('❌ GET /api/annual-leave-entitlements/employee/:employeeId error:', error);
      res.status(500).json({ message: "Failed to fetch annual leave entitlements" });
    }
  });

  app.post("/api/annual-leave-entitlements", async (req, res) => {
    try {
      console.log('📊 POST /api/annual-leave-entitlements', req.body);
      const validatedData = insertAnnualLeaveEntitlementSchema.parse(req.body);
      const entitlement = await storage.createAnnualLeaveEntitlement(validatedData);
      res.status(201).json(entitlement);
    } catch (error) {
      console.error('❌ POST /api/annual-leave-entitlements error:', error);
      res.status(400).json({ message: "Invalid annual leave entitlement data" });
    }
  });

  app.put("/api/annual-leave-entitlements/:id", async (req, res) => {
    try {
      console.log('📊 PUT /api/annual-leave-entitlements/:id', req.params.id, req.body);
      const entitlement = await storage.updateAnnualLeaveEntitlement(req.params.id, req.body);
      if (!entitlement) {
        return res.status(404).json({ message: "Annual leave entitlement not found" });
      }
      res.json(entitlement);
    } catch (error) {
      console.error('❌ PUT /api/annual-leave-entitlements/:id error:', error);
      res.status(400).json({ message: "Invalid annual leave entitlement data" });
    }
  });

  // User Permission Management
  app.get("/api/users", async (req, res) => {
    try {
      console.log('📊 GET /api/users');
      const employees = await storage.getEmployees();
      // Convert employees to user-like format for permissions management
      const users = employees.map(emp => ({
        id: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        email: emp.email,
        position: emp.position,
        department: emp.department,
        imageUrl: emp.imageUrl
      }));
      console.log('✅ Returning users:', users.length);
      res.json(users);
    } catch (error) {
      console.error('❌ GET /api/users error:', error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id/permissions", async (req, res) => {
    try {
      console.log('📊 GET /api/users/:id/permissions', req.params.id);
      const permissions = await storage.getUserPermissions(req.params.id);
      res.json(permissions);
    } catch (error) {
      console.error('❌ GET /api/users/:id/permissions error:', error);
      res.status(500).json({ message: "Failed to fetch user permissions" });
    }
  });

  app.post("/api/users/:id/permissions", async (req, res) => {
    try {
      console.log('📊 POST /api/users/:id/permissions', req.params.id, req.body);
      const validatedData = insertUserPermissionSchema.parse({
        ...req.body,
        userId: req.params.id
      });
      const permission = await storage.createUserPermission(validatedData);
      res.status(201).json(permission);
    } catch (error) {
      console.error('❌ POST /api/users/:id/permissions error:', error);
      res.status(400).json({ message: "Invalid permission data" });
    }
  });

  app.put("/api/permissions/:id", async (req, res) => {
    try {
      console.log('📊 PUT /api/permissions/:id', req.params.id, req.body);
      const permission = await storage.updateUserPermission(parseInt(req.params.id), req.body);
      if (!permission) {
        return res.status(404).json({ message: "Permission not found" });
      }
      res.json(permission);
    } catch (error) {
      console.error('❌ PUT /api/permissions/:id error:', error);
      res.status(400).json({ message: "Invalid permission data" });
    }
  });

  app.delete("/api/permissions/:id", async (req, res) => {
    try {
      console.log('📊 DELETE /api/permissions/:id', req.params.id);
      const success = await storage.deleteUserPermission(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Permission not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('❌ DELETE /api/permissions/:id error:', error);
      res.status(500).json({ message: "Failed to delete permission" });
    }
  });

  // Permission Categories
  app.get("/api/permission-categories", async (req, res) => {
    try {
      console.log('📊 GET /api/permission-categories');
      const categories = await storage.getPermissionCategories();
      console.log('✅ Returning permission categories:', categories.length);
      res.json(categories);
    } catch (error) {
      console.error('❌ GET /api/permission-categories error:', error);
      res.status(500).json({ message: "Failed to fetch permission categories" });
    }
  });

  app.post("/api/permission-categories", async (req, res) => {
    try {
      console.log('📊 POST /api/permission-categories', req.body);
      const validatedData = insertPermissionCategorySchema.parse(req.body);
      const category = await storage.createPermissionCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      console.error('❌ POST /api/permission-categories error:', error);
      res.status(400).json({ message: "Invalid permission category data" });
    }
  });

  app.put("/api/permission-categories/:id", async (req, res) => {
    try {
      console.log('📊 PUT /api/permission-categories/:id', req.params.id, req.body);
      const category = await storage.updatePermissionCategory(parseInt(req.params.id), req.body);
      if (!category) {
        return res.status(404).json({ message: "Permission category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error('❌ PUT /api/permission-categories/:id error:', error);
      res.status(400).json({ message: "Invalid permission category data" });
    }
  });

  app.delete("/api/permission-categories/:id", async (req, res) => {
    try {
      console.log('📊 DELETE /api/permission-categories/:id', req.params.id);
      const success = await storage.deletePermissionCategory(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: "Permission category not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error('❌ DELETE /api/permission-categories/:id error:', error);
      res.status(500).json({ message: "Failed to delete permission category" });
    }
  });

  // Add a test endpoint to verify API is working
  app.get("/api/test", (req, res) => {
    console.log('📊 GET /api/test');
    res.json({ message: "API is working", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
