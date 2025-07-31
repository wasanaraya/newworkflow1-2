import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Building, UserCheck, FileUp, Upload, CheckCircle, XCircle, Download, Database } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDepartments, useCreateDepartment, useUpdateDepartment, useDeleteDepartment } from "@/hooks/use-departments";
import { usePositions, useCreatePosition, useUpdatePosition, useDeletePosition } from "@/hooks/use-positions";
import { useAnnualLeaveEntitlements, useCreateAnnualLeaveEntitlement, useUpdateAnnualLeaveEntitlement } from "@/hooks/use-annual-leave-entitlements";
import { useHolidaySchedules, useCreateHolidaySchedule, useUpdateHolidaySchedule } from "@/hooks/use-holiday-schedules";
import { useEmployees } from "@/hooks/use-employees";
import { useToast } from "@/hooks/use-toast";
import { fileToBase64 } from "@/lib/utils";
import ConfirmModal from "@/components/modals/confirm-modal";
import * as XLSX from 'xlsx';

export default function Departments() {
  const [activeTab, setActiveTab] = useState('departments');
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCapacity, setNewDeptCapacity] = useState(0);
  const [editingDept, setEditingDept] = useState({ oldName: "", newName: "", newCapacity: 0 });
  const [newPosName, setNewPosName] = useState("");
  const [editingPos, setEditingPos] = useState({ oldName: "", newName: "" });
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [leaveDays, setLeaveDays] = useState<Record<string, string>>({});
  const [scheduleImportPreview, setScheduleImportPreview] = useState<any[]>([]);
  const [excelFileName, setExcelFileName] = useState("");
  const [appointmentOrderUrl, setAppointmentOrderUrl] = useState<{name: string, url: string} | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalProps, setConfirmModalProps] = useState({ title: "", message: "", onConfirm: () => {} });
  const [testLoading, setTestLoading] = useState(false);

  const { data: departments } = useDepartments();
  const { data: positions } = usePositions();
  const { data: employees = [] } = useEmployees();
  const { data: annualLeaveEntitlements } = useAnnualLeaveEntitlements();
  const { data: holidaySchedules } = useHolidaySchedules();
  const createDepartmentMutation = useCreateDepartment();
  const updateDepartmentMutation = useUpdateDepartment();
  const deleteDepartmentMutation = useDeleteDepartment();
  const createPositionMutation = useCreatePosition();
  const updatePositionMutation = useUpdatePosition();
  const deletePositionMutation = useDeletePosition();
  const createAnnualLeaveEntitlementMutation = useCreateAnnualLeaveEntitlement();
  const updateAnnualLeaveEntitlementMutation = useUpdateAnnualLeaveEntitlement();
  const createHolidayScheduleMutation = useCreateHolidaySchedule();
  const updateHolidayScheduleMutation = useUpdateHolidaySchedule();
  const { toast } = useToast();

  const testConnection = async () => {
    setTestLoading(true);
    try {
      const response = await fetch('/api/test-connection');
      const result = await response.json();
      if (result.success) {
        toast({ title: "สำเร็จ", description: "การเชื่อมต่อฐานข้อมูลทำงานปกติ" });
      } else {
        toast({ title: "ข้อผิดพลาด", description: "ไม่สามารถเชื่อมต่อฐานข้อมูลได้", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "ข้อผิดพลาด", description: "เกิดข้อผิดพลาดในการทดสอบ", variant: "destructive" });
    } finally {
      setTestLoading(false);
    }
  };

  const testCRUD = async () => {
    setTestLoading(true);
    try {
      const response = await fetch('/api/test-crud');
      const result = await response.json();
      if (result.success) {
        toast({ title: "สำเร็จ", description: "ทดสอบ CRUD Operations สำเร็จ" });
      } else {
        toast({ title: "ข้อผิดพลาด", description: "การทดสอบ CRUD ล้มเหลว", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "ข้อผิดพลาด", description: "เกิดข้อผิดพลาดในการทดสอบ", variant: "destructive" });
    } finally {
      setTestLoading(false);
    }
  };

  const handleAddDepartment = () => {
    if (newDeptName.trim()) {
      createDepartmentMutation.mutate({ 
        name: newDeptName.trim(), 
        maxCapacity: newDeptCapacity || 0 
      });
      setNewDeptName("");
      setNewDeptCapacity(0);
    }
  };

  const handleUpdateDepartment = (id: number, newName: string, newCapacity: number) => {
    if (newName.trim()) {
      updateDepartmentMutation.mutate({ 
        id: id, 
        department: { 
          name: newName.trim(),
          maxCapacity: newCapacity || 0
        }
      });
      setEditingDept({ oldName: "", newName: "", newCapacity: 0 });
    }
  };

  const handleAddPosition = () => {
    if (newPosName.trim()) {
      createPositionMutation.mutate({ name: newPosName.trim() });
      setNewPosName("");
    }
  };

  const handleUpdatePosition = (oldName: string, newName: string) => {
    const pos = positions?.find(p => p.name === oldName);
    if (pos && newName.trim()) {
      updatePositionMutation.mutate({ id: pos.id, position: { name: newName.trim() } });
      setEditingPos({ oldName: "", newName: "" });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'pdf' | 'excel') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'pdf') {
      try {
        const base64 = await fileToBase64(file);
        setAppointmentOrderUrl({ name: file.name, url: base64 });
        toast({ title: "อัปโหลดสำเร็จ", description: "อัปโหลดคำสั่งแต่งตั้งเรียบร้อยแล้ว" });
      } catch (error) {
        toast({ title: "ข้อผิดพลาด", description: "ไม่สามารถอัปโหลดไฟล์ได้", variant: "destructive" });
      }
    } else if (type === 'excel') {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          const preview = jsonData.slice(0, 10).map((row: any, index) => ({
            id: index,
            date: row[0],
            employee1Id: row[1],
            employee1Name: row[2],
            employee2Id: row[3],
            employee2Name: row[4],
            employee1Valid: employees?.some(emp => emp.id === row[1]),
            employee2Valid: employees?.some(emp => emp.id === row[3])
          }));
          
          setScheduleImportPreview(preview);
          setExcelFileName(file.name);
        };
        reader.readAsArrayBuffer(file);
      } catch (error) {
        toast({ title: "ข้อผิดพลาด", description: "ไม่สามารถอ่านไฟล์ Excel ได้", variant: "destructive" });
      }
    }
  };

  const confirmDeleteDepartment = (dept: any) => {
    setConfirmModalProps({
      title: "ยืนยันการลบ",
      message: `คุณต้องการลบแผนก "${dept.name}" หรือไม่?`,
      onConfirm: () => deleteDepartmentMutation.mutate(dept.id)
    });
    setShowConfirmModal(true);
  };

  const confirmDeletePosition = (pos: any) => {
    setConfirmModalProps({
      title: "ยืนยันการลบ",
      message: `คุณต้องการลบตำแหน่ง "${pos.name}" หรือไม่?`,
      onConfirm: () => deletePositionMutation.mutate(pos.id)
    });
    setShowConfirmModal(true);
  };

  const handleDeleteAllHolidaySchedules = async () => {
    if (!holidaySchedules || holidaySchedules.length === 0) return;
    
    try {
      // ใช้ Promise.all เพื่อลบข้อมูลทั้งหมดพร้อมกัน
      await Promise.all(
        holidaySchedules.map(schedule => 
          fetch(`/api/holiday-schedules/${schedule.id}`, {
            method: 'DELETE',
          })
        )
      );
      
      toast({ 
        title: "ลบสำเร็จ", 
        description: `ลบข้อมูลตารางเวรวันหยุดทั้งหมด ${holidaySchedules.length} รายการเรียบร้อยแล้ว` 
      });
      
      // รีเฟรชข้อมูลผ่าน query invalidation
      window.location.reload();
    } catch (error) {
      console.error('Error deleting holiday schedules:', error);
      toast({ 
        title: "ข้อผิดพลาด", 
        description: "ไม่สามารถลบข้อมูลได้", 
        variant: "destructive" 
      });
    }
  };

  const tabs = [
    { id: 'departments', label: 'จัดการแผนก', icon: '🏢' },
    { id: 'positions', label: 'จัดการตำแหน่ง', icon: '👥' },
    { id: 'leave-entitlements', label: 'สิทธิ์ลาพักผ่อน', icon: '📅' },
    { id: 'holiday-schedule', label: 'ตารางเวรวันหยุด', icon: '📋' },
    { id: 'database-test', label: 'ทดสอบฐานข้อมูล', icon: '🔧' }
  ];

  return (
    <div className="p-8 bg-[#e0e5ec] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin</h1>
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-[#e0e5ec] p-2 rounded-xl" style={{boxShadow: 'inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff'}}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'text-indigo-600 bg-[#e0e5ec]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                style={activeTab === tab.id ? {boxShadow: '5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff'} : {}}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'departments' && (
          <div className="bg-[#e0e5ec] p-6 rounded-2xl" style={{boxShadow: '10px 10px 20px #a3b1c6, -10px -10px 20px #ffffff'}}>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Building className="mr-3 text-blue-600"/>จัดการแผนก
            </h3>
            
            <div className="mb-6 p-4 rounded-xl space-y-4" style={{boxShadow: 'inset 7px 7px 10px #a3b1c6, inset -7px -7px 10px #ffffff'}}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  placeholder="ชื่อแผนกใหม่"
                  className="flex-1 p-3 bg-[#e0e5ec] border-none rounded-xl outline-none"
                  style={{boxShadow: 'inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff'}}
                />
                <input
                  type="number"
                  value={newDeptCapacity}
                  onChange={(e) => setNewDeptCapacity(parseInt(e.target.value) || 0)}
                  placeholder="จำนวนคน"
                  min="0"
                  className="w-32 p-3 bg-[#e0e5ec] border-none rounded-xl outline-none text-center"
                  style={{boxShadow: 'inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff'}}
                />
                <button
                  onClick={handleAddDepartment}
                  className="px-6 py-3 bg-[#4a90e2] text-white font-semibold rounded-xl transition-all duration-300"
                  style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments?.map((dept) => (
                <div key={dept.id} className="p-4 rounded-xl" style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}>
                  {editingDept.oldName === dept.name ? (
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingDept.newName}
                          onChange={(e) => setEditingDept({...editingDept, newName: e.target.value})}
                          placeholder="ชื่อแผนก"
                          className="flex-1 p-2 bg-[#e0e5ec] border-none rounded-lg"
                          style={{boxShadow: 'inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff'}}
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={editingDept.newCapacity}
                          onChange={(e) => setEditingDept({...editingDept, newCapacity: parseInt(e.target.value) || 0})}
                          placeholder="จำนวนคน"
                          min="0"
                          className="flex-1 p-2 bg-[#e0e5ec] border-none rounded-lg text-center"
                          style={{boxShadow: 'inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff'}}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateDepartment(dept.id, editingDept.newName, editingDept.newCapacity)}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg flex-1"
                        >
                          ✓ บันทึก
                        </button>
                        <button
                          onClick={() => setEditingDept({oldName: '', newName: '', newCapacity: 0})}
                          className="px-3 py-2 bg-gray-500 text-white rounded-lg flex-1"
                        >
                          ✗ ยกเลิก
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">{dept.name}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingDept({oldName: dept.name, newName: dept.name, newCapacity: dept.maxCapacity || 0})}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDeleteDepartment(dept)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">จำนวนคน:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-indigo-600">
                            {employees?.filter(emp => emp.department === dept.name).length || 0}
                          </span>
                          <span className="text-gray-400">/</span>
                          <span className="font-semibold text-gray-600">{dept.maxCapacity || 0}</span>
                          <span className="text-xs text-gray-500">คน</span>
                        </div>
                      </div>
                      {dept.maxCapacity && employees && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              (employees.filter(emp => emp.department === dept.name).length / dept.maxCapacity) > 0.8 
                                ? 'bg-red-500' 
                                : (employees.filter(emp => emp.department === dept.name).length / dept.maxCapacity) > 0.6 
                                ? 'bg-yellow-500' 
                                : 'bg-green-500'
                            }`}
                            style={{ 
                              width: `${Math.min((employees.filter(emp => emp.department === dept.name).length / dept.maxCapacity) * 100, 100)}%` 
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'positions' && (
          <div className="bg-[#e0e5ec] p-6 rounded-2xl" style={{boxShadow: '10px 10px 20px #a3b1c6, -10px -10px 20px #ffffff'}}>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <UserCheck className="mr-3 text-green-600"/>จัดการตำแหน่ง
            </h3>
            
            <div className="mb-6 p-4 rounded-xl space-y-4" style={{boxShadow: 'inset 7px 7px 10px #a3b1c6, inset -7px -7px 10px #ffffff'}}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPosName}
                  onChange={(e) => setNewPosName(e.target.value)}
                  placeholder="ชื่อตำแหน่งใหม่"
                  className="flex-1 p-3 bg-[#e0e5ec] border-none rounded-xl outline-none"
                  style={{boxShadow: 'inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff'}}
                />
                <button
                  onClick={handleAddPosition}
                  className="px-6 py-3 bg-[#4a90e2] text-white font-semibold rounded-xl transition-all duration-300"
                  style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {positions?.map((pos) => (
                <div key={pos.id} className="p-4 rounded-xl" style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}>
                  {editingPos.oldName === pos.name ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editingPos.newName}
                        onChange={(e) => setEditingPos({...editingPos, newName: e.target.value})}
                        className="flex-1 p-2 bg-[#e0e5ec] border-none rounded-lg"
                        style={{boxShadow: 'inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff'}}
                      />
                      <button
                        onClick={() => handleUpdatePosition(editingPos.oldName, editingPos.newName)}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => setEditingPos({oldName: '', newName: ''})}
                        className="px-3 py-2 bg-gray-500 text-white rounded-lg"
                      >
                        ✗
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{pos.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingPos({oldName: pos.name, newName: pos.name})}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDeletePosition(pos)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leave-entitlements' && (
          <div className="bg-[#e0e5ec] p-6 rounded-2xl" style={{boxShadow: '10px 10px 20px #a3b1c6, -10px -10px 20px #ffffff'}}>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <UserCheck className="mr-3 text-orange-600"/>สิทธิ์ลาพักผ่อนรายปี
            </h3>
            
            <div className="mb-6 p-4 rounded-xl space-y-4" style={{boxShadow: 'inset 7px 7px 10px #a3b1c6, inset -7px -7px 10px #ffffff'}}>
              <div className="flex items-center gap-4">
                <label className="font-medium text-gray-700">เลือกปี:</label>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger className="w-32 bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 5}, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                      <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {employees?.map((emp) => (
                <div key={emp.id} className="p-4 rounded-xl flex items-center justify-between" style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}>
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-800">{emp.firstName} {emp.lastName}</span>
                    <span className="text-sm text-gray-500">({emp.id})</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="number"
                      placeholder="จำนวนวันลา"
                      value={leaveDays[emp.id] || ''}
                      onChange={(e) => setLeaveDays({...leaveDays, [emp.id]: e.target.value})}
                      className="w-32 p-2 bg-[#e0e5ec] border-none rounded-lg outline-none"
                      style={{boxShadow: 'inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff'}}
                      min="0"
                      max="365"
                    />
                    <span className="text-sm text-gray-500">วัน</span>
                    <button
                      onClick={() => {
                        const days = parseInt(leaveDays[emp.id] || '0');
                        if (days > 0) {
                          createAnnualLeaveEntitlementMutation.mutate({
                            employeeId: emp.id,
                            year: selectedYear,
                            totalDays: days,
                            usedDays: 0,
                            remainingDays: days
                          });
                        }
                      }}
                      className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      บันทึก
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* อัปโหลดคำสั่งแต่งตั้ง */}
            <div className="mt-8 bg-[#e0e5ec] p-6 rounded-2xl" style={{boxShadow: '10px 10px 20px #a3b1c6, -10px -10px 20px #ffffff'}}>
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <FileUp className="mr-3 text-purple-600"/>อัปโหลดคำสั่งแต่งตั้ง
              </h4>
              
              <div className="p-4 rounded-xl space-y-4" style={{boxShadow: 'inset 7px 7px 10px #a3b1c6, inset -7px -7px 10px #ffffff'}}>
                <label htmlFor="pdf-upload" className="cursor-pointer flex items-center justify-center w-full bg-[#e0e5ec] text-gray-500 font-semibold px-4 py-3 rounded-xl transition-all duration-300" style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}>
                  <Upload className="w-5 h-5 mr-2"/> {appointmentOrderUrl?.name || "เลือกไฟล์ PDF"}
                </label>
                <input id="pdf-upload" type="file" accept=".pdf" className="hidden" onChange={(e) => handleFileUpload(e, 'pdf')}/>
                {appointmentOrderUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">✓ อัปโหลดแล้ว: {appointmentOrderUrl.name}</span>
                    <button
                      onClick={() => window.open(appointmentOrderUrl.url, '_blank')}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      ดาวน์โหลด
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'holiday-schedule' && (
          <div className="bg-[#e0e5ec] p-6 rounded-2xl" style={{boxShadow: '10px 10px 20px #a3b1c6, -10px -10px 20px #ffffff'}}>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FileUp className="mr-3 text-indigo-600"/>ตารางเวรวันหยุด
            </h3>
            
            {/* นำเข้าเวรวันหยุด (Excel) */}
            <div className="mb-6 p-4 rounded-xl space-y-4" style={{boxShadow: 'inset 7px 7px 10px #a3b1c6, inset -7px -7px 10px #ffffff'}}>
              <div className="mb-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-400">
                <h4 className="font-bold text-blue-800 mb-2">รูปแบบไฟล์ Excel ที่รองรับ:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>คอลัมน์ที่ 1:</strong> วันที่ (รูปแบบ YYYY-MM-DD เช่น 2025-01-01)</p>
                  <p><strong>คอลัมน์ที่ 2:</strong> รหัสพนักงานคนที่ 1 (เช่น EMP001)</p>
                  <p><strong>คอลัมน์ที่ 3:</strong> ชื่อพนักงานคนที่ 1 (เช่น สมเกียรติ วงษ์ทอง)</p>
                  <p><strong>คอลัมน์ที่ 4:</strong> รหัสพนักงานคนที่ 2 (เช่น EMP002)</p>
                  <p><strong>คอลัมน์ที่ 5:</strong> ชื่อพนักงานคนที่ 2 (เช่น สมหวัง ใจดี)</p>
                </div>
                
                {/* แสดงรายการพนักงานที่มีในระบบ */}
                <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800 font-semibold mb-2">รหัสพนักงานที่มีในระบบ:</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
                    {employees?.map(emp => (
                      <div key={emp.id} className="flex items-center space-x-2">
                        <span className="font-mono bg-green-100 px-2 py-1 rounded">{emp.id}</span>
                        <span>{emp.firstName} {emp.lastName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <label htmlFor="excel-upload" className="cursor-pointer flex items-center justify-center flex-1 bg-[#e0e5ec] text-gray-500 font-semibold px-4 py-3 rounded-xl transition-all duration-300" style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}>
                  <Upload className="w-5 h-5 mr-2"/> {excelFileName || "เลือกไฟล์ Excel (.xlsx)"}
                </label>
                <input id="excel-upload" type="file" accept=".xlsx, .xls" className="hidden" onChange={(e) => handleFileUpload(e, 'excel')}/>
                
                {holidaySchedules && holidaySchedules.length > 0 && (
                  <button
                    onClick={() => {
                      setConfirmModalProps({
                        title: "ยืนยันการลบข้อมูลทั้งหมด",
                        message: `คุณต้องการลบข้อมูลตารางเวรวันหยุดทั้งหมด ${holidaySchedules.length} รายการ หรือไม่?\n\nการดำเนินการนี้ไม่สามารถย้อนกลับได้`,
                        onConfirm: handleDeleteAllHolidaySchedules
                      });
                      setShowConfirmModal(true);
                    }}
                    className="flex items-center justify-center bg-red-600 text-white font-semibold px-4 py-3 rounded-xl transition-all duration-300 hover:bg-red-700" 
                    style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}
                  >
                    <Trash2 className="w-5 h-5 mr-2"/> ลบข้อมูลทั้งหมด
                  </button>
                )}
              </div>
            </div>

            {scheduleImportPreview.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold text-gray-600 mb-2">ตัวอย่างข้อมูลที่จะนำเข้า</h4>
                <div className="max-h-60 overflow-y-auto overflow-x-auto p-2 rounded-lg" style={{boxShadow: 'inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff'}}>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">วันที่</th>
                        <th className="text-left p-2">พนักงานคนที่ 1</th>
                        <th className="text-left p-2">พนักงานคนที่ 2</th>
                        <th className="text-left p-2">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduleImportPreview.map((row, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{row.date}</td>
                          <td className={`p-2 ${!row.employee1Valid ? 'text-red-600 font-bold' : ''}`}>
                            {row.employee1Id} - {row.employee1Name}
                          </td>
                          <td className={`p-2 ${!row.employee2Valid ? 'text-red-600 font-bold' : ''}`}>
                            {row.employee2Id} - {row.employee2Name}
                          </td>
                          <td className="p-2">
                            {row.employee1Valid && row.employee2Valid ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  onClick={() => {
                    // นำเข้าข้อมูลเวรวันหยุด
                    scheduleImportPreview.forEach(row => {
                      if (row.employee1Valid && row.employee2Valid) {
                        createHolidayScheduleMutation.mutate({
                          date: row.date,
                          employee1Id: row.employee1Id,
                          employee1Name: row.employee1Name,
                          employee2Id: row.employee2Id,
                          employee2Name: row.employee2Name
                        });
                      }
                    });
                    setScheduleImportPreview([]);
                    setExcelFileName("");
                  }}
                  className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-300"
                  style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}
                >
                  นำเข้าข้อมูล
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'database-test' && (
          <div className="bg-[#e0e5ec] p-6 rounded-2xl" style={{boxShadow: '10px 10px 20px #a3b1c6, -10px -10px 20px #ffffff'}}>
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <FileUp className="mr-3 text-green-600"/>ทดสอบการเชื่อมต่อฐานข้อมูล
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 border-l-4 border-blue-400">
                <h4 className="font-bold text-blue-800 mb-2">ข้อมูลการเชื่อมต่อ Supabase:</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>URL:</strong> https://zubrflyhzsmqngfbjkpg.supabase.co</p>
                  <p><strong>สถานะ:</strong> พร้อมใช้งาน</p>
                  <p><strong>โปรเจกต์:</strong> zubrflyhzsmqngfbjkpg</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={testConnection}
                  disabled={testLoading}
                  className="flex items-center justify-center bg-blue-600 text-white font-semibold px-6 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
                  style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}
                >
                  <Database className="w-5 h-5 mr-2" />
                  {testLoading ? 'กำลังทดสอบ...' : 'ทดสอบการเชื่อมต่อ'}
                </button>

                <button
                  onClick={testCRUD}
                  disabled={testLoading}
                  className="flex items-center justify-center bg-green-600 text-white font-semibold px-6 py-4 rounded-xl hover:bg-green-700 transition-all duration-300 disabled:opacity-50"
                  style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {testLoading ? 'กำลังทดสอบ...' : 'ทดสอบ CRUD Operations'}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-green-50 border-l-4 border-green-400">
                <h4 className="font-bold text-green-800 mb-2">ฟีเจอร์ที่พร้อมใช้งาน:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>จัดการข้อมูลพนักงาน</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>ระบบการลา</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>การเปลี่ยนกะ</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>ตารางเวรวันหยุด</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>สิทธิ์วันลาประจำปี</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>จัดการสิทธิ์ผู้ใช้</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)} 
        onConfirm={confirmModalProps.onConfirm} 
        title={confirmModalProps.title} 
        message={confirmModalProps.message} 
      />
    </div>
  );
}