import { useState, useEffect, useMemo } from "react";
import { useEmployees } from "@/hooks/use-employees";
import { useLeaveRequests } from "@/hooks/use-leave-requests";
import { useHolidaySchedules } from "@/hooks/use-holiday-schedules";
import { Users, UserCog, Mail, CalendarDays, CalendarClock, ChevronLeft, ChevronRight, FileText, TrendingUp } from "lucide-react";

const DashboardCalendar = ({ title, events, employees, highlightColor, icon }: any) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: [] as string[] });
  const IconComponent = icon;

  const changeMonth = (amount: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };
  
  const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const daysOfWeek = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handleMouseEnter = (dayEvents: any[], e: React.MouseEvent) => {
    if (dayEvents && dayEvents.length > 0) {
      setTooltip({
        show: true,
        x: e.clientX,
        y: e.clientY,
        content: dayEvents.map(emp => emp ? `${emp.firstName} ${emp.lastName}` : 'ไม่พบข้อมูล')
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, content: [] });
  };

  return (
    <div className="bg-[#e0e5ec] p-8 rounded-3xl border-none relative overflow-hidden group" 
         style={{
           boxShadow: '20px 20px 40px #a3b1c6, -20px -20px 40px #ffffff',
           background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
         }}>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none"></div>
      <div className="absolute top-4 right-4 w-3 h-3 bg-white/20 rounded-full"></div>
      <div className="absolute bottom-4 left-4 w-2 h-2 bg-white/30 rounded-full"></div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-[#e0e5ec] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
               style={{
                 boxShadow: '8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff, inset 2px 2px 4px #ffffff, inset -2px -2px 4px #a3b1c6',
                 background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
               }}>
            <IconComponent className="h-8 w-8 text-indigo-600"/>
          </div>
          <h4 className="font-bold text-xl text-gray-800 tracking-wide bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">{title}</h4>
        </div>
        <div className="flex items-center space-x-4 bg-[#e0e5ec] p-4 rounded-2xl"
             style={{
               boxShadow: 'inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff',
               background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
             }}>
          <button onClick={() => changeMonth(-1)} 
                  className="p-3 rounded-full bg-[#e0e5ec] text-[#4a90e2] border-none transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95" 
                  style={{
                    boxShadow: '6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff',
                    background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                  }}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="bg-[#e0e5ec] px-6 py-3 rounded-xl min-w-[140px]"
               style={{
                 boxShadow: 'inset 4px 4px 8px #a3b1c6, inset -4px -4px 8px #ffffff',
                 background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
               }}>
            <span className="font-bold text-center text-gray-800 tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {monthNames[month]} {year + 543}
            </span>
          </div>
          <button onClick={() => changeMonth(1)} 
                  className="p-3 rounded-full bg-[#e0e5ec] text-[#4a90e2] border-none transition-all duration-300 hover:scale-110 hover:-rotate-12 active:scale-95" 
                  style={{
                    boxShadow: '6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff',
                    background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                  }}>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm font-bold text-gray-600 mb-4 relative z-10">
        {daysOfWeek.map(day => (
          <div key={day} className="py-3 bg-[#e0e5ec] rounded-xl"
               style={{
                 boxShadow: 'inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff',
                 background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
               }}>
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 relative z-10">
        {Array.from({ length: firstDayOfMonth }, (_, i) => (
          <div key={`empty-${i}`} className="py-3 bg-[#e0e5ec] rounded-xl opacity-30"
               style={{
                 boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff',
                 background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
               }}>
          </div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayEvents = events[dateString] || [];
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={day}
              className={`py-3 text-sm cursor-pointer transition-all duration-300 rounded-xl font-semibold relative group/day ${
                hasEvents ? 'text-white' : 'text-gray-700'
              }`}
              style={hasEvents ? {
                boxShadow: '6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff, inset 2px 2px 4px rgba(255,255,255,0.2), inset -2px -2px 4px rgba(0,0,0,0.2)',
                background: highlightColor.includes('blue') ? 'linear-gradient(145deg, #4a90e2, #357abd)' : 
                           highlightColor.includes('green') ? 'linear-gradient(145deg, #48cc8b, #369870)' :
                           highlightColor.includes('purple') ? 'linear-gradient(145deg, #8b7ed8, #6c63b5)' :
                           'linear-gradient(145deg, #4a90e2, #357abd)'
              } : {
                boxShadow: '6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff',
                background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
              }}
              onMouseEnter={(e) => handleMouseEnter(dayEvents, e)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative z-10 group-hover/day:scale-110 transition-transform duration-200">
                {day}
              </div>
              {hasEvents && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-yellow-300 rounded-full border border-white/50"
                     style={{boxShadow: '1px 1px 2px rgba(0,0,0,0.3)'}}></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 rounded-xl opacity-0 group-hover/day:opacity-100 transition-opacity duration-300"></div>
            </div>
          );
        })}
      </div>

      {tooltip.show && (
        <div className="fixed bg-[#2d3748] text-white text-sm rounded-xl py-3 px-4 pointer-events-none z-50 border-none"
             style={{
               left: tooltip.x + 10,
               top: tooltip.y - 10,
               boxShadow: '8px 8px 16px rgba(0,0,0,0.3), -2px -2px 8px rgba(255,255,255,0.1)',
               background: 'linear-gradient(145deg, #2d3748, #1a202c)'
             }}>
          {tooltip.content.map((content, index) => (
            <div key={index} className="py-1 font-medium">{content}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const { data: employees = [] } = useEmployees();
  const { data: leaveRequests = [] } = useLeaveRequests();
  const { data: holidaySchedules = [] } = useHolidaySchedules();

  const onLeaveTodayIds = [
    { employeeId: 'EMP003', type: 'ลาพักผ่อน' },
    { employeeId: 'EMP004', type: 'ลากิจ (ครึ่งเช้า)' },
  ];
  const onLeaveToday = onLeaveTodayIds.map(leave => ({...leave, employee: employees?.find(e => e.id === leave.employeeId)})).filter(item => item.employee);

  const annualLeaveEvents = useMemo(() => {
    const events: Record<string, any[]> = {};
    leaveRequests
      ?.filter(req => req.status === 'approved' && req.reason.includes('พักผ่อน'))
      .forEach(req => {
        let currentDate = new Date(req.startDate);
        const endDate = new Date(req.endDate);
        const employee = employees?.find(e => e.id === req.employeeId);
        if (!employee) return;

        while (currentDate <= endDate) {
          const dateString = currentDate.toISOString().split('T')[0];
          if (!events[dateString]) {
            events[dateString] = [];
          }
          events[dateString].push(employee);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
    return events;
  }, [leaveRequests, employees]);

  const holidayShiftEvents = useMemo(() => {
    const events: Record<string, any[]> = {};
    holidaySchedules?.forEach(schedule => {
      const dateString = schedule.date;
      const assignedEmployees = [schedule]; // Simplified for now
      
      if (assignedEmployees.length > 0) {
        events[dateString] = assignedEmployees;
      }
    });
    return events;
  }, [holidaySchedules]);

  return (
    <div className="space-y-8 bg-[#e0e5ec] p-8 rounded-3xl border-none relative overflow-hidden"
         style={{
           boxShadow: '25px 25px 50px #a3b1c6, -25px -25px 50px #ffffff',
           background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
         }}>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none"></div>
      <div className="absolute top-8 right-8 w-4 h-4 bg-white/20 rounded-full"></div>
      <div className="absolute bottom-8 left-8 w-2 h-2 bg-white/30 rounded-full"></div>
      
      {/* Stats Cards Section */}
      <div className="mb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Employees Card */}
          <div className="bg-[#e0e5ec] rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-105 p-6"
               style={{
                 background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
                 boxShadow: '15px 15px 30px #a3b1c6, -15px -15px 30px #ffffff, inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(163,177,198,0.5)',
                 transform: 'translateZ(10px)'
               }}>
            <div className="absolute inset-1 rounded-xl"
                 style={{
                   background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)',
                   boxShadow: 'inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff'
                 }}></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-800">{employees?.length || 0}</div>
                  <div className="text-sm text-gray-600">พนักงานทั้งหมด</div>
                </div>
              </div>
            </div>
            <div className="absolute top-2 left-3 w-8 h-1 bg-white/50 rounded-full blur-sm opacity-60"></div>
            <div className="absolute bottom-2 right-3 w-6 h-1 bg-white/30 rounded-full blur-sm opacity-40"></div>
          </div>

          {/* Pending Leave Requests Card */}
          <div className="bg-[#e0e5ec] rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-105 p-6"
               style={{
                 background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
                 boxShadow: '15px 15px 30px #a3b1c6, -15px -15px 30px #ffffff, inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(163,177,198,0.5)',
                 transform: 'translateZ(10px)'
               }}>
            <div className="absolute inset-1 rounded-xl"
                 style={{
                   background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)',
                   boxShadow: 'inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff'
                 }}></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-800">{leaveRequests?.filter(req => req.status === 'pending').length || 0}</div>
                  <div className="text-sm text-gray-600">คำขอลารอดำเนินการ</div>
                </div>
              </div>
            </div>
            <div className="absolute top-2 left-3 w-8 h-1 bg-white/50 rounded-full blur-sm opacity-60"></div>
            <div className="absolute bottom-2 right-3 w-6 h-1 bg-white/30 rounded-full blur-sm opacity-40"></div>
          </div>

          {/* Active Employees Card */}
          <div className="bg-[#e0e5ec] rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-105 p-6"
               style={{
                 background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
                 boxShadow: '15px 15px 30px #a3b1c6, -15px -15px 30px #ffffff, inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(163,177,198,0.5)',
                 transform: 'translateZ(10px)'
               }}>
            <div className="absolute inset-1 rounded-xl"
                 style={{
                   background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)',
                   boxShadow: 'inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff'
                 }}></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-800">{employees?.length || 0}</div>
                  <div className="text-sm text-gray-600">พนักงานทำงาน</div>
                </div>
              </div>
            </div>
            <div className="absolute top-2 left-3 w-8 h-1 bg-white/50 rounded-full blur-sm opacity-60"></div>
            <div className="absolute bottom-2 right-3 w-6 h-1 bg-white/30 rounded-full blur-sm opacity-40"></div>
          </div>

          {/* Employees on Leave Today Card */}
          <div className="bg-[#e0e5ec] rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-105 p-6"
               style={{
                 background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
                 boxShadow: '15px 15px 30px #a3b1c6, -15px -15px 30px #ffffff, inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(163,177,198,0.5)',
                 transform: 'translateZ(10px)'
               }}>
            <div className="absolute inset-1 rounded-xl"
                 style={{
                   background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)',
                   boxShadow: 'inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff'
                 }}></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <UserCog className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-800">{onLeaveToday.length}</div>
                  <div className="text-sm text-gray-600">พนักงานลาวันนี้</div>
                </div>
              </div>
            </div>
            <div className="absolute top-2 left-3 w-8 h-1 bg-white/50 rounded-full blur-sm opacity-60"></div>
            <div className="absolute bottom-2 right-3 w-6 h-1 bg-white/30 rounded-full blur-sm opacity-40"></div>
          </div>
        </div>
      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        <DashboardCalendar
          title="ปฏิทินลาพักผ่อน"
          events={annualLeaveEvents}
          employees={employees}
          highlightColor="bg-blue-500"
          icon={CalendarDays}
        />
        <DashboardCalendar
          title="ตารางเวรวันหยุด"
          events={holidayShiftEvents}
          employees={employees}
          highlightColor="bg-green-500"
          icon={CalendarClock}
        />
      </div>

      {onLeaveToday.length > 0 && (
        <div className="bg-[#e0e5ec] p-8 rounded-3xl border-none relative overflow-hidden group"
             style={{
               boxShadow: '20px 20px 40px #a3b1c6, -20px -20px 40px #ffffff',
               background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
             }}>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none"></div>
          <div className="absolute top-4 right-4 w-3 h-3 bg-white/20 rounded-full"></div>
          
          <div className="flex items-center space-x-4 mb-6 relative z-10">
            <div className="p-4 rounded-full bg-[#e0e5ec] transition-all duration-500 group-hover:scale-110 group-hover:rotate-12"
                 style={{
                   boxShadow: '10px 10px 20px #a3b1c6, -10px -10px 20px #ffffff, inset 2px 2px 4px #ffffff, inset -2px -2px 4px #a3b1c6',
                   background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                 }}>
              <UserCog className="h-8 w-8 text-orange-600"/>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 tracking-wide bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              พนักงานที่ลาวันนี้
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {onLeaveToday.map(({ employee, type }: any, index: number) => (
              <div key={employee.id} 
                   className="bg-[#e0e5ec] p-6 rounded-2xl border-none transition-all duration-500 hover:scale-105 group/item"
                   style={{
                     boxShadow: '12px 12px 24px #a3b1c6, -12px -12px 24px #ffffff',
                     background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
                     animationDelay: `${index * 100}ms`
                   }}>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center space-x-4 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-[#e0e5ec] p-2 transition-all duration-300 group-hover/item:scale-110"
                       style={{
                         boxShadow: '8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff, inset 2px 2px 4px #ffffff, inset -2px -2px 4px #a3b1c6',
                         background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                       }}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#e0e5ec]"
                         style={{boxShadow: 'inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff'}}>
                      {employee.imageUrl ? (
                        <img src={employee.imageUrl} className="w-full h-full object-cover" alt={employee.firstName} />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold">
                          {employee.firstName[0]}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-800 tracking-wide">
                      {employee.firstName} {employee.lastName}
                    </h4>
                    <p className="text-gray-600 font-medium">{employee.position}</p>
                    <div className="mt-2 bg-[#e0e5ec] px-3 py-1 rounded-xl inline-block"
                         style={{
                           boxShadow: 'inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff',
                           background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
                         }}>
                      <p className="text-sm text-orange-600 font-semibold">{type}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}