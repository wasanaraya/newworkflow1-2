import { useState, useMemo, useEffect } from "react";
import { useEmployees } from "@/hooks/use-employees";
import { useLeaveRequests } from "@/hooks/use-leave-requests";
import { useAnnualLeaveEntitlements } from "@/hooks/use-annual-leave-entitlements";

const MonthlyCalendar = ({ year, month, leaveDates }: { year: number; month: number; leaveDates: Set<string> }) => {
  const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const daysOfWeek = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div className="bg-[#e0e5ec] rounded-xl p-4" style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}>
      <h4 className="font-bold text-center text-indigo-700 mb-2">{monthNames[month]} {year + 543}</h4>
      <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500">
        {daysOfWeek.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 mt-1 text-center text-sm">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`}></div>)}
        {Array.from({ length: daysInMonth }).map((_, day) => {
          const date = new Date(year, month, day + 1);
          const dateString = date.toISOString().split('T')[0];
          const isLeaveDay = leaveDates.has(dateString);
          const isToday = new Date().toISOString().split('T')[0] === dateString;
          return (
            <div key={day} className={`w-8 h-8 flex items-center justify-center rounded-full 
              ${isLeaveDay ? 'bg-yellow-400 text-white font-bold' : ''} 
              ${isToday ? 'ring-2 ring-blue-500' : ''}`}
            >
              {day + 1}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function AnnualLeavePage() {
  const { data: employees = [] } = useEmployees();
  const { data: leaveRequests = [] } = useLeaveRequests();
  const { data: annualLeaveEntitlements = [] } = useAnnualLeaveEntitlements();
  
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');

  const eligibleEmployees = employees.filter(e => e.position !== 'ผู้จัดการ' && e.position !== 'ผู้ช่วยผู้จัดการ');
  
  useEffect(() => {
    if (eligibleEmployees.length > 0) {
      setSelectedEmployeeId(eligibleEmployees[0].id);
    }
  }, [employees]);

  const { usedDays, leaveDatesSet } = useMemo(() => {
    if (!selectedEmployeeId) return { usedDays: 0, leaveDatesSet: new Set() };

    let totalDays = 0;
    const datesSet = new Set();
    
    leaveRequests
      .filter(req => req.employeeId === selectedEmployeeId && req.status === 'approved' && req.reason.includes('พักผ่อน'))
      .forEach(req => {
        let currentDate = new Date(req.startDate);
        const endDate = new Date(req.endDate);

        while (currentDate <= endDate) {
          if (currentDate.getFullYear() === selectedYear) {
            totalDays++;
            datesSet.add(currentDate.toISOString().split('T')[0]);
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
      
    return { usedDays: totalDays, leaveDatesSet: datesSet };
  }, [leaveRequests, selectedEmployeeId, selectedYear]);

  const entitlement = annualLeaveEntitlements.find(e => e.employeeId === selectedEmployeeId && e.year === selectedYear.toString());
  const entitledDays = entitlement?.entitlement || 0;
  const remainingDays = entitledDays - usedDays;

  return (
    <div className="space-y-6">
      <div className="bg-[#e0e5ec] p-6 rounded-xl space-y-4" style={{boxShadow: '10px 10px 20px #a3b1c6, -10px -10px 20px #ffffff'}}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <label htmlFor="year-select-annual" className="text-sm font-medium text-gray-700 mr-2">เลือกปี พ.ศ.:</label>
            <select 
              id="year-select-annual" 
              value={selectedYear} 
              onChange={e => setSelectedYear(parseInt(e.target.value))} 
              className="p-2 bg-[#e0e5ec] rounded-lg border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
            >
              {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y + 543}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="emp-select" className="text-sm font-medium text-gray-700 mr-2">เลือกพนักงาน:</label>
            <select 
              id="emp-select" 
              value={selectedEmployeeId} 
              onChange={e => setSelectedEmployeeId(e.target.value)} 
              className="min-w-[200px] p-2 bg-[#e0e5ec] rounded-lg border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
            >
              <option value="">-- เลือกพนักงาน --</option>
              {eligibleEmployees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedEmployeeId && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-4">
            <div className="p-4 rounded-lg" style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}>
              <p className="text-sm text-gray-500">วันหยุดที่ได้รับ</p>
              <p className="text-2xl font-bold text-blue-600">{entitledDays}</p>
            </div>
            <div className="p-4 rounded-lg" style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}>
              <p className="text-sm text-gray-500">ใช้ไป</p>
              <p className="text-2xl font-bold text-yellow-600">{usedDays}</p>
            </div>
            <div className="p-4 rounded-lg" style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}>
              <p className="text-sm text-gray-500">คงเหลือ</p>
              <p className="text-2xl font-bold text-green-600">{remainingDays}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(12).keys()].map(month => (
          <MonthlyCalendar key={month} year={selectedYear} month={month} leaveDates={leaveDatesSet} />
        ))}
      </div>
    </div>
  );
}