import { pgTable, text, serial, integer, boolean, date, jsonb, timestamp, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const employees = pgTable("employees", {
  id: text("id").primaryKey(),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  position: text("position").notNull(),
  department: text("department").notNull(),
  imageUrl: text("imageUrl"),
  phoneBrand: text("phoneBrand"),
  phoneModel: text("phoneModel"),
  carBrand: text("carBrand"),
  carPlate: text("carPlate"),
  carColor: text("carColor"),
  startDate: text("startDate").notNull(),
  files: jsonb("files").$type<Array<{name: string, url: string, type: string}>>(),
});

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  maxCapacity: integer("maxCapacity").default(0),
});

export const positions = pgTable("positions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
});

export const leaveRequests = pgTable("leaveRequests", {
  id: text("id").primaryKey(),
  employeeId: text("employeeId").notNull(),
  employeeName: text("employeeName").notNull(),
  startDate: text("startDate").notNull(),
  endDate: text("endDate").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull(), // 'pending', 'approved', 'rejected'
  requestDate: text("requestDate").notNull(),
  approvedBy: text("approvedBy"),
  approvedDate: text("approvedDate"),
});

export const shiftChangeRequests = pgTable("shiftChangeRequests", {
  id: text("id").primaryKey(),
  employeeId: text("employeeId").notNull(),
  employeeName: text("employeeName").notNull(),
  currentShift: text("currentShift").notNull(),
  requestedShift: text("requestedShift").notNull(),
  changeDate: text("changeDate").notNull(),
  reason: text("reason").notNull(),
  status: text("status").notNull(), // 'pending', 'approved', 'rejected'
  requestDate: text("requestDate").notNull(),
  approvedBy: text("approvedBy"),
  approvedDate: text("approvedDate"),
});

export const holidaySchedules = pgTable("holidaySchedules", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  date: text("date").notNull(),
  type: text("type").notNull(), // 'national', 'company', 'religious'
});

export const annualLeaveEntitlements = pgTable("annualLeaveEntitlements", {
  id: text("id").primaryKey(),
  employeeId: text("employeeId").notNull(),
  year: text("year").notNull(),
  entitlement: integer("entitlement").notNull(),
  used: integer("used").default(0),
});

// Session storage table for auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User permissions table
export const userPermissions = pgTable("user_permissions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  permission: varchar("permission").notNull(), 
  granted: boolean("granted").default(true),
  grantedBy: varchar("granted_by").references(() => users.id),
  grantedAt: timestamp("granted_at").defaultNow(),
});

// Permission categories
export const permissionCategories = pgTable("permission_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull().unique(),
  description: text("description"),
  permissions: jsonb("permissions").$type<string[]>().notNull(),
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
});

export const insertPositionSchema = createInsertSchema(positions).omit({
  id: true,
});

export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({
  id: true,
  requestDate: true,
});

export const insertShiftChangeRequestSchema = createInsertSchema(shiftChangeRequests).omit({
  id: true,
  requestDate: true,
});

export const insertHolidayScheduleSchema = createInsertSchema(holidaySchedules).omit({
  id: true,
});

export const insertAnnualLeaveEntitlementSchema = createInsertSchema(annualLeaveEntitlements).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users);
export const insertUserPermissionSchema = createInsertSchema(userPermissions).omit({
  id: true,
  grantedAt: true,
});
export const insertPermissionCategorySchema = createInsertSchema(permissionCategories).omit({
  id: true,
});

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Position = typeof positions.$inferSelect;
export type InsertPosition = z.infer<typeof insertPositionSchema>;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type ShiftChangeRequest = typeof shiftChangeRequests.$inferSelect;
export type InsertShiftChangeRequest = z.infer<typeof insertShiftChangeRequestSchema>;
export type HolidaySchedule = typeof holidaySchedules.$inferSelect;
export type InsertHolidaySchedule = z.infer<typeof insertHolidayScheduleSchema>;
export type AnnualLeaveEntitlement = typeof annualLeaveEntitlements.$inferSelect;
export type InsertAnnualLeaveEntitlement = z.infer<typeof insertAnnualLeaveEntitlementSchema>;
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type UserPermission = typeof userPermissions.$inferSelect;
export type InsertUserPermission = z.infer<typeof insertUserPermissionSchema>;
export type PermissionCategory = typeof permissionCategories.$inferSelect;
export type InsertPermissionCategory = z.infer<typeof insertPermissionCategorySchema>;
