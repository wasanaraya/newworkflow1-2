import { useState } from "react";
import { FileText, Download, Calendar, Users, ClipboardList, BarChart3, Building, Briefcase } from "lucide-react";
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useEmployees } from "@/hooks/use-employees";
import { useLeaveRequests } from "@/hooks/use-leave-requests";
import { useShiftChangeRequests } from "@/hooks/use-shift-changes";
import { useAnnualLeaveEntitlements } from "@/hooks/use-annual-leave-entitlements";
import { useDepartments } from "@/hooks/use-departments";
import { usePositions } from "@/hooks/use-positions";

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: employees = [] } = useEmployees();
  const { data: leaveRequests } = useLeaveRequests();
  const { data: shiftChangeRequests } = useShiftChangeRequests();
  const { data: annualLeaveEntitlements } = useAnnualLeaveEntitlements();
  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();

  const reportTypes = [
    {
      id: "employee-list",
      name: "รายชื่อพนักงาน",
      icon: Users,
      description: "รายงานข้อมูลพนักงานทั้งหมด"
    },
    {
      id: "leave-summary",
      name: "สรุปการลาพักผ่อน",
      icon: Calendar,
      description: "รายงานสรุปการลาของพนักงาน"
    },
    {
      id: "leave-requests",
      name: "คำขอลาพักผ่อน",
      icon: ClipboardList,
      description: "รายงานคำขอลาพักผ่อนแยกตามช่วงเวลา"
    },
    {
      id: "shift-changes",
      name: "การเปลี่ยนกะทำงาน",
      icon: BarChart3,
      description: "รายงานการขอเปลี่ยนกะทำงาน"
    },
    {
      id: "annual-leave",
      name: "สิทธิ์วันลาประจำปี",
      icon: FileText,
      description: "รายงานสิทธิ์และการใช้วันลาประจำปี"
    },
    {
      id: "departments",
      name: "ข้อมูลแผนก",
      icon: Building,
      description: "รายงานข้อมูลแผนกและจำนวนคนในแต่ละแผนก"
    },
    {
      id: "positions",
      name: "ข้อมูลตำแหน่ง",
      icon: Briefcase,
      description: "รายงานข้อมูลตำแหน่งงานทั้งหมด"
    }
  ];

  const generateEmployeeListReport = () => {
    if (!employees) return null;

    const csvContent = [
      ["รหัสพนักงาน", "ชื่อ", "นามสกุล", "อีเมล", "เบอร์โทรศัพท์", "ตำแหน่ง", "แผนก", "วันเริ่มงาน"].join(","),
      ...employees.map(emp => [
        emp.id,
        emp.firstName,
        emp.lastName,
        emp.email,
        emp.phone,
        emp.position,
        emp.department,
        emp.startDate
      ].join(","))
    ].join("\n");

    return csvContent;
  };

  const generateLeaveRequestsReport = () => {
    if (!leaveRequests) return null;

    let filteredRequests = leaveRequests;

    if (dateFrom) {
      filteredRequests = filteredRequests.filter(req => req.startDate >= dateFrom);
    }
    if (dateTo) {
      filteredRequests = filteredRequests.filter(req => req.endDate <= dateTo);
    }
    if (selectedEmployee) {
      filteredRequests = filteredRequests.filter(req => req.employeeId === selectedEmployee);
    }

    const csvContent = [
      ["รหัสคำขอ", "รหัสพนักงาน", "ชื่อพนักงาน", "วันเริ่มลา", "วันสิ้นสุดลา", "เหตุผล", "สถานะ", "วันที่ขอ"].join(","),
      ...filteredRequests.map(req => [
        req.id,
        req.employeeId,
        req.employeeName,
        req.startDate,
        req.endDate,
        req.reason,
        req.status,
        req.requestDate
      ].join(","))
    ].join("\n");

    return csvContent;
  };

  const generateShiftChangesReport = () => {
    if (!shiftChangeRequests) return null;

    let filteredRequests = shiftChangeRequests;

    if (dateFrom) {
      filteredRequests = filteredRequests.filter(req => req.changeDate >= dateFrom);
    }
    if (dateTo) {
      filteredRequests = filteredRequests.filter(req => req.changeDate <= dateTo);
    }
    if (selectedEmployee) {
      filteredRequests = filteredRequests.filter(req => req.employeeId === selectedEmployee);
    }

    const csvContent = [
      ["รหัสคำขอ", "รหัสพนักงาน", "ชื่อพนักงาน", "กะปัจจุบัน", "กะที่ขอเปลี่ยน", "วันที่เปลี่ยน", "เหตุผล", "สถานะ"].join(","),
      ...filteredRequests.map(req => [
        req.id,
        req.employeeId,
        req.employeeName,
        req.currentShift,
        req.requestedShift,
        req.changeDate,
        req.reason,
        req.status
      ].join(","))
    ].join("\n");

    return csvContent;
  };

  const generateAnnualLeaveReport = () => {
    if (!annualLeaveEntitlements) return null;

    let filteredEntitlements = annualLeaveEntitlements;

    if (selectedEmployee) {
      filteredEntitlements = filteredEntitlements.filter(ent => ent.employeeId === selectedEmployee);
    }

    const csvContent = [
      ["รหัสพนักงาน", "ปี", "สิทธิ์วันลา", "วันลาที่ใช้", "วันลาคงเหลือ"].join(","),
      ...filteredEntitlements.map(ent => [
        ent.employeeId,
        ent.year,
        ent.entitlement,
        ent.used || 0,
        ent.entitlement - (ent.used || 0)
      ].join(","))
    ].join("\n");

    return csvContent;
  };

  const generateDepartmentsData = () => {
    return departments.map(dept => {
      const empCount = employees.filter(emp => emp.department === dept.name).length;
      return {
        "รหัสแผนก": dept.id,
        "ชื่อแผนก": dept.name,
        "จำนวนคนปัจจุบัน": empCount,
        "จำนวนคนที่กำหนด": dept.maxCapacity || 0,
        "คงเหลือ": (dept.maxCapacity || 0) - empCount,
        "เปอร์เซ็นต์การใช้งาน": dept.maxCapacity ? `${((empCount / dept.maxCapacity) * 100).toFixed(1)}%` : "0%"
      };
    });
  };

  const generatePositionsData = () => {
    return positions.map(pos => {
      const empCount = employees.filter(emp => emp.position === pos.name).length;
      return {
        "รหัสตำแหน่ง": pos.id,
        "ชื่อตำแหน่ง": pos.name,
        "จำนวนพนักงาน": empCount
      };
    });
  };

  const downloadExcel = (data: any[], filename: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const downloadPDF = (data: any[], filename: string, headers: string[]) => {
    let htmlContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            h1 { color: #333; text-align: center; }
          </style>
        </head>
        <body>
          <h1>${filename}</h1>
          <table>
            <thead>
              <tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${data.map(row => 
                `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`
              ).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.html`;
    link.click();
  };

  const generateReport = async (format: 'excel' | 'pdf') => {
    if (!selectedReport) return;

    setIsGenerating(true);

    try {
      let data: any[] = [];
      let filename = "";
      let headers: string[] = [];

      switch (selectedReport) {
        case "employee-list":
          data = employees.map(emp => ({
            "รหัสพนักงาน": emp.id,
            "ชื่อ": emp.firstName,
            "นามสกุล": emp.lastName,
            "อีเมล": emp.email,
            "เบอร์โทรศัพท์": emp.phone,
            "ตำแหน่ง": emp.position,
            "แผนก": emp.department,
            "วันเริ่มงาน": emp.startDate
          }));
          filename = "รายชื่อพนักงาน";
          headers = ["รหัสพนักงาน", "ชื่อ", "นามสกุล", "อีเมล", "เบอร์โทรศัพท์", "ตำแหน่ง", "แผนก", "วันเริ่มงาน"];
          break;
        case "departments":
          data = generateDepartmentsData();
          filename = "รายงานข้อมูลแผนก";
          headers = ["รหัสแผนก", "ชื่อแผนก", "จำนวนคนปัจจุบัน", "จำนวนคนที่กำหนด", "คงเหลือ", "เปอร์เซ็นต์การใช้งาน"];
          break;
        case "positions":
          data = generatePositionsData();
          filename = "รายงานข้อมูลตำแหน่ง";
          headers = ["รหัสตำแหน่ง", "ชื่อตำแหน่ง", "จำนวนพนักงาน"];
          break;
        case "annual-leave":
          data = annualLeaveEntitlements?.map(ent => ({
            "รหัสพนักงาน": ent.employeeId,
            "ปี": ent.year,
            "สิทธิ์วันลา": ent.entitlement,
            "วันลาที่ใช้": ent.used || 0,
            "วันลาคงเหลือ": ent.entitlement - (ent.used || 0)
          })) || [];
          filename = "สิทธิ์วันลาประจำปี";
          headers = ["รหัสพนักงาน", "ปี", "สิทธิ์วันลา", "วันลาที่ใช้", "วันลาคงเหลือ"];
          break;
        default:
          return;
      }

      if (format === 'excel') {
        downloadExcel(data, filename);
      } else {
        downloadPDF(data, filename, headers);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileText className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">รายงาน</h1>
      </div>

      {/* Report Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => {
          const IconComponent = report.icon;
          return (
            <div
              key={report.id}
              className={`p-4 rounded-xl cursor-pointer transition-all ${
                selectedReport === report.id
                  ? "bg-blue-50 border-2 border-blue-200 shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
                  : "bg-[#e0e5ec] border-2 border-transparent shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <div className="flex items-center space-x-3">
                <IconComponent className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">{report.name}</h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Filters */}
      {selectedReport && (
        <div className="bg-[#e0e5ec] p-6 rounded-xl shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]">
          <h3 className="text-lg font-medium text-gray-900 mb-4">ตัวเลือกรายงาน</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range - shown for time-based reports */}
            {(selectedReport === "leave-requests" || selectedReport === "shift-changes") && (
              <>
                <div>
                  <Label htmlFor="dateFrom">วันที่เริ่มต้น</Label>
                  <Input
                    id="dateFrom"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
                  />
                </div>
                <div>
                  <Label htmlFor="dateTo">วันที่สิ้นสุด</Label>
                  <Input
                    id="dateTo"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
                  />
                </div>
              </>
            )}

            {/* Employee Selection - shown for individual reports */}
            {(selectedReport !== "employee-list") && (
              <div>
                <Label htmlFor="employee">พนักงาน (ทั้งหมดถ้าไม่เลือก)</Label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]">
                    <SelectValue placeholder="เลือกพนักงาน" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#e0e5ec] border-none shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff]">
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {employees?.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Generate Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  generateReport('excel');
                }}
                disabled={isGenerating}
                className="flex-1 bg-[#28a745] text-white border-none shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#1e7e34,_inset_-5px_-5px_10px_#34ce57] disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? "กำลังสร้าง..." : "Excel"}
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  generateReport('pdf');
                }}
                disabled={isGenerating}
                className="flex-1 bg-[#dc3545] text-white border-none shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#c82333,_inset_-5px_-5px_10px_#f56565] disabled:opacity-50"
              >
                <FileText className="w-4 h-4 mr-2" />
                {isGenerating ? "กำลังสร้าง..." : "PDF"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Report Preview/Summary */}
      {selectedReport && (
        <div className="bg-[#e0e5ec] p-6 rounded-xl shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]">
          <h3 className="text-lg font-medium text-gray-900 mb-4">ตัวอย่างรายงาน</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {selectedReport === "employee-list" && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{employees?.length || 0}</div>
                  <div className="text-sm text-gray-600">จำนวนพนักงาน</div>
                </div>
              </>
            )}
            
            {selectedReport === "leave-requests" && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{leaveRequests?.length || 0}</div>
                  <div className="text-sm text-gray-600">คำขอลาทั้งหมด</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {leaveRequests?.filter(req => req.status === "อนุมัติ").length || 0}
                  </div>
                  <div className="text-sm text-gray-600">อนุมัติแล้ว</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {leaveRequests?.filter(req => req.status === "รอพิจารณา").length || 0}
                  </div>
                  <div className="text-sm text-gray-600">รอพิจารณา</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {leaveRequests?.filter(req => req.status === "ไม่อนุมัติ").length || 0}
                  </div>
                  <div className="text-sm text-gray-600">ไม่อนุมัติ</div>
                </div>
              </>
            )}

            {selectedReport === "shift-changes" && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{shiftChangeRequests?.length || 0}</div>
                  <div className="text-sm text-gray-600">คำขอเปลี่ยนกะ</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {shiftChangeRequests?.filter(req => req.status === "อนุมัติ").length || 0}
                  </div>
                  <div className="text-sm text-gray-600">อนุมัติแล้ว</div>
                </div>
              </>
            )}

            {selectedReport === "annual-leave" && (
              <>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{annualLeaveEntitlements?.length || 0}</div>
                  <div className="text-sm text-gray-600">พนักงานที่มีสิทธิ์</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {annualLeaveEntitlements?.reduce((sum, ent) => sum + ent.entitlement, 0) || 0}
                  </div>
                  <div className="text-sm text-gray-600">วันลารวม</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {annualLeaveEntitlements?.reduce((sum, ent) => sum + (ent.used || 0), 0) || 0}
                  </div>
                  <div className="text-sm text-gray-600">วันลาที่ใช้</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {annualLeaveEntitlements?.reduce((sum, ent) => sum + (ent.entitlement - (ent.used || 0)), 0) || 0}
                  </div>
                  <div className="text-sm text-gray-600">วันลาคงเหลือ</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}