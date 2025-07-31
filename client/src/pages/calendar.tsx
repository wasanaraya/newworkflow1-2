import { useState, useMemo } from "react";
import { useEmployees } from "@/hooks/use-employees";
import { useHolidaySchedules } from "@/hooks/use-holiday-schedules";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import DefaultAvatarSVG from "@/components/default-avatar";
import { departmentColors } from "@/lib/utils";

export default function Calendar() {
  const { data: employees = [] } = useEmployees();
  const { data: schedules = [] } = useHolidaySchedules();
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const scheduleMap = useMemo(() => {
    const map = new Map();
    schedules.forEach(schedule => {
      const employeeDetails = schedule.employeeIds?.map((id: string) => {
        return employees.find(e => e.id === id);
      }).filter(Boolean) || [];
      map.set(schedule.date, employeeDetails);
    });
    return map;
  }, [schedules, employees]);

  const changeMonth = (amount: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const daysOfWeek = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();



  return (
    <div className="bg-[#e0e5ec] p-6 rounded-xl" style={{boxShadow: '10px 10px 20px #a3b1c6, -10px -10px 20px #ffffff'}}>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <h3 className="text-2xl font-semibold text-gray-800">ตารางเวรวันหยุด</h3>
        <div className="flex items-center p-2 rounded-lg" style={{boxShadow: 'inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff'}}>
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff]">
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <h4 className="text-xl font-bold text-indigo-600 mx-4 w-48 text-center">
            {monthNames[month]} {year + 543}
          </h4>
          <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff]">
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
        </div>

      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center font-bold text-gray-600 py-2">{day}</div>
        ))}
        
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="border rounded-lg border-transparent"></div>
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, day) => {
          const date = new Date(Date.UTC(year, month, day + 1));
          const dateString = date.toISOString().split('T')[0];
          const dayEmployees = scheduleMap.get(dateString) || [];
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;
          const isHoliday = dayEmployees.length > 0;

          return (
            <div
              key={day + 1}
              className={`min-h-[120px] p-2 rounded-lg border transition-all duration-200 cursor-pointer hover:shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff] ${
                isHoliday ? 'bg-red-50 border-red-200' : 
                isWeekend ? 'bg-blue-50 border-blue-200' : 
                'bg-white border-gray-200'
              }`}
              style={{
                boxShadow: isHoliday || isWeekend ? '3px 3px 8px #a3b1c6, -3px -3px 8px #ffffff' : 'inset 2px 2px 5px #a3b1c6, inset -2px -2px 5px #ffffff'
              }}
            >
              <div className="text-sm font-semibold text-gray-700 mb-1">
                {day + 1}
              </div>
              
              {isHoliday && (
                <div className="space-y-1">
                  <div className="text-xs font-medium text-red-600 mb-1">วันหยุด</div>
                  {dayEmployees.slice(0, 2).map((emp: any) => (
                    <div key={emp.id} className="flex items-center space-x-1">
                      <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
                        {emp.imageUrl ? (
                          <img src={emp.imageUrl} className="w-full h-full object-cover" alt={emp.firstName} />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <Users className="w-2 h-2 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-700 truncate">
                        {emp.firstName} {emp.lastName}
                      </span>
                    </div>
                  ))}
                  {dayEmployees.length > 2 && (
                    <div className="text-xs text-gray-500">+{dayEmployees.length - 2} คน</div>
                  )}
                </div>
              )}
              

            </div>
          );
        })}
      </div>


    </div>
  );
}