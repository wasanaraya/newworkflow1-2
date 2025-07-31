import { useState, useMemo } from "react";
import { useEmployees } from "@/hooks/use-employees";
import { useDepartments } from "@/hooks/use-departments";
import { ChevronLeft, ChevronRight, FileText, Printer, Clock, MapPin, User, Calendar } from "lucide-react";
import DefaultAvatarSVG from "@/components/default-avatar";
import { departmentColors, departmentBgColors } from "@/lib/utils";

export default function DailySchedule() {
  const { data: employees = [] } = useEmployees();
  const { data: departments = [] } = useDepartments();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedShift, setSelectedShift] = useState('all');

  // Define shifts without time information
  const shifts = [
    { id: 'morning', name: 'กะเช้า', color: 'from-amber-400 to-orange-500' },
    { id: 'afternoon', name: 'กะบ่าย', color: 'from-blue-400 to-indigo-500' },
    { id: 'night', name: 'กะดึก', color: 'from-purple-400 to-violet-500' },
  ];

  // Department color mapping for beautiful visual distinction
  const departmentColorMap: { [key: string]: { gradient: string; bg: string; text: string } } = {
    'ส่วนกลาง': { 
      gradient: 'from-purple-500 to-violet-600', 
      bg: 'bg-purple-50', 
      text: 'text-purple-800' 
    },
    'แผนกนับคัด': { 
      gradient: 'from-blue-500 to-indigo-600', 
      bg: 'bg-blue-50', 
      text: 'text-blue-800' 
    },
    'แผนกตรวจพิสูจน์': { 
      gradient: 'from-green-500 to-emerald-600', 
      bg: 'bg-green-50', 
      text: 'text-green-800' 
    },
    'แผนกอนุมัติ': { 
      gradient: 'from-orange-500 to-amber-600', 
      bg: 'bg-orange-50', 
      text: 'text-orange-800' 
    },
    'แผนกช่าง': { 
      gradient: 'from-teal-500 to-cyan-600', 
      bg: 'bg-teal-50', 
      text: 'text-teal-800' 
    },
    'แผนกธุรการ': { 
      gradient: 'from-rose-500 to-pink-600', 
      bg: 'bg-rose-50', 
      text: 'text-rose-800' 
    },
    'แผนกห้องมั่นคง': { 
      gradient: 'from-red-500 to-rose-600', 
      bg: 'bg-red-50', 
      text: 'text-red-800' 
    },
    'ไม่ระบุ': { 
      gradient: 'from-gray-500 to-slate-600', 
      bg: 'bg-gray-50', 
      text: 'text-gray-800' 
    }
  };

  // Use actual employee data for the schedule with realistic shift assignments
  const scheduleData = useMemo(() => {
    return employees.map(emp => {
      // Assign shifts based on position and department
      let assignedShift = shifts[0]; // Default morning shift
      
      if (emp.position === 'ผู้จัดการ' || emp.position === 'ผู้ช่วยผู้จัดการ') {
        assignedShift = shifts[0]; // Management on morning shift
      } else if (emp.department === 'แผนกห้องมั่นคง') {
        assignedShift = shifts[1]; // Security on afternoon shift
      } else if (emp.department === 'แผนกช่าง') {
        assignedShift = shifts[2]; // Technical staff on night shift
      }
      
      return {
        ...emp,
        shift: assignedShift,
        location: emp.department || 'ไม่ระบุ',
        status: 'present',
        notes: emp.position === 'ผู้จัดการ' ? 'ประชุมบอร์ด 14:00' : 
               emp.department === 'แผนกห้องมั่นคง' ? 'ตรวจเวร' : ''
      };
    });
  }, [employees, shifts]);

  const filteredSchedule = useMemo(() => {
    if (selectedShift === 'all') return scheduleData;
    return scheduleData.filter(emp => emp.shift.id === selectedShift);
  }, [scheduleData, selectedShift]);

  const changeDate = (days: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const locale = 'th-TH';
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  // Status indicator component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      present: { color: 'from-green-400 to-emerald-500', text: 'มาทำงาน', bg: 'bg-green-50' },
      absent: { color: 'from-red-400 to-rose-500', text: 'ขาดงาน', bg: 'bg-red-50' },
      late: { color: 'from-yellow-400 to-orange-500', text: 'มาสาย', bg: 'bg-yellow-50' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.present;
    
    return (
      <div className={`px-3 py-1 rounded-full bg-[#e0e5ec] transition-all duration-300 hover:scale-105`}
           style={{
             boxShadow: 'inset 4px 4px 8px #a3b1c6, inset -4px -4px 8px #ffffff',
             background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
           }}>
        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${config.color} inline-block mr-2 animate-pulse`}></div>
        <span className="text-xs font-medium text-gray-700">{config.text}</span>
      </div>
    );
  };

  return (
    <div className="bg-[#e0e5ec] p-8 rounded-3xl space-y-8 border-none relative overflow-hidden" 
         style={{
           boxShadow: '25px 25px 50px #a3b1c6, -25px -25px 50px #ffffff',
           background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
         }}>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none"></div>
      <div className="absolute top-8 right-8 w-4 h-4 bg-white/20 rounded-full"></div>
      <div className="absolute bottom-8 left-8 w-2 h-2 bg-white/30 rounded-full"></div>
      
      {/* Header with Date Navigation and Controls */}
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-[#e0e5ec] p-3 rounded-2xl"
               style={{
                 boxShadow: 'inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff',
                 background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
               }}>
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="text-lg font-bold text-gray-800">ตารางการทำงานประจำวัน</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Shift Filter */}
          <div className="flex gap-2 bg-[#e0e5ec] p-2 rounded-xl"
               style={{
                 boxShadow: 'inset 4px 4px 8px #a3b1c6, inset -4px -4px 8px #ffffff',
                 background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
               }}>
            <button
              onClick={() => setSelectedShift('all')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                selectedShift === 'all' ? 'text-white' : 'text-gray-600'
              }`}
              style={{
                boxShadow: selectedShift === 'all' 
                  ? '4px 4px 8px #a3b1c6, -4px -4px 8px #ffffff' 
                  : 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff',
                background: selectedShift === 'all' 
                  ? 'linear-gradient(145deg, #4a90e2, #357abd)' 
                  : 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
              }}
            >
              ทั้งหมด
            </button>
            {shifts.map(shift => (
              <button
                key={shift.id}
                onClick={() => setSelectedShift(shift.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                  selectedShift === shift.id ? 'text-white' : 'text-gray-600'
                }`}
                style={{
                  boxShadow: selectedShift === shift.id 
                    ? '4px 4px 8px #a3b1c6, -4px -4px 8px #ffffff' 
                    : 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff',
                  background: selectedShift === shift.id 
                    ? `linear-gradient(145deg, ${shift.color.includes('amber') ? '#f59e0b, #d97706' : shift.color.includes('blue') ? '#3b82f6, #2563eb' : '#8b5cf6, #7c3aed'})` 
                    : 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
                }}
              >
                {shift.name}
              </button>
            ))}
          </div>

          {/* Date Navigation */}
          <div className="flex justify-center items-center p-3 rounded-xl bg-[#e0e5ec] border-none group" 
               style={{
                 boxShadow: 'inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff',
                 background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
               }}>
            <button onClick={() => changeDate(-1)} 
                    className="p-2 rounded-full bg-[#e0e5ec] text-[#4a90e2] border-none transition-all duration-300 hover:scale-110 hover:rotate-12 active:scale-95" 
                    style={{
                      boxShadow: '4px 4px 8px #a3b1c6, -4px -4px 8px #ffffff',
                      background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                    }}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <div className="mx-3 bg-[#e0e5ec] px-4 py-2 rounded-lg" 
                 style={{
                   boxShadow: 'inset 4px 4px 8px #a3b1c6, inset -4px -4px 8px #ffffff',
                   background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
                 }}>
              <h4 className="text-base font-bold text-gray-800 text-center whitespace-nowrap tracking-wide bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {currentDate.toLocaleDateString(locale, dateOptions)}
              </h4>
            </div>
            
            <button onClick={() => changeDate(1)} 
                    className="p-2 rounded-full bg-[#e0e5ec] text-[#4a90e2] border-none transition-all duration-300 hover:scale-110 hover:-rotate-12 active:scale-95" 
                    style={{
                      boxShadow: '4px 4px 8px #a3b1c6, -4px -4px 8px #ffffff',
                      background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                    }}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <button onClick={handlePrint} 
                  className="p-3 rounded-xl bg-[#e0e5ec] text-green-600 border-none transition-all duration-300 hover:scale-105 active:scale-95" 
                  style={{
                    boxShadow: '6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff',
                    background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                  }}>
            <Printer className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 3D Neumorphism Schedule Table */}
      <div className="bg-[#e0e5ec] rounded-3xl overflow-hidden relative"
           style={{
             boxShadow: '20px 20px 40px #a3b1c6, -20px -20px 40px #ffffff, inset 2px 2px 4px #ffffff, inset -2px -2px 4px #a3b1c6',
             background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
           }}>
        
        {/* Table Header */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 p-6 relative overflow-hidden"
             style={{
               boxShadow: 'inset 6px 6px 12px rgba(255,255,255,0.2), inset -6px -6px 12px rgba(0,0,0,0.3)',
               background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #8b5cf6)'
             }}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"></div>
          <div className="grid grid-cols-6 gap-4 relative z-10">
            <div className="text-white font-bold text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>พนักงาน</span>
            </div>
            <div className="text-white font-bold text-sm flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>แผนก</span>
            </div>
            <div className="text-white font-bold text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>กะ</span>
            </div>
            <div className="text-white font-bold text-sm text-center">สถานะ</div>
            <div className="text-white font-bold text-sm text-center">ตำแหน่ง</div>
            <div className="text-white font-bold text-sm text-center">หมายเหตุ</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="p-6 space-y-4">
          {filteredSchedule.map((emp, index) => {
            const deptColors = departmentColorMap[emp.location] || departmentColorMap['ไม่ระบุ'];
            
            return (
              <div
                key={emp.id}
                className="grid grid-cols-6 gap-4 items-center p-4 bg-[#e0e5ec] rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group"
                style={{
                  boxShadow: '8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff, inset 1px 1px 2px #ffffff, inset -1px -1px 2px #a3b1c6',
                  background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                {/* Employee Info */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#e0e5ec] p-1 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                       style={{
                         boxShadow: '4px 4px 8px #a3b1c6, -4px -4px 8px #ffffff, inset 1px 1px 2px #ffffff, inset -1px -1px 2px #a3b1c6',
                         background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                       }}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#e0e5ec] relative"
                         style={{boxShadow: 'inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff'}}>
                      {emp.imageUrl ? (
                        <img src={emp.imageUrl} className="h-full w-full object-cover rounded-full" alt={emp.firstName} />
                      ) : (
                        <DefaultAvatarSVG />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{emp.firstName} {emp.lastName}</p>
                    <p className="text-xs text-gray-600">{emp.id}</p>
                  </div>
                </div>

                {/* Department with Color Coding */}
                <div className={`px-4 py-3 rounded-xl bg-gradient-to-r ${deptColors.gradient} text-white text-center relative overflow-hidden transition-all duration-300 hover:scale-105`}
                     style={{
                       boxShadow: '6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff',
                     }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                  <span className="text-sm font-bold relative z-10 drop-shadow-sm">{emp.location}</span>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white/20 rounded-full"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white/30 rounded-full"></div>
                </div>

                {/* Shift without time */}
                <div className={`px-3 py-2 rounded-xl bg-gradient-to-r ${emp.shift.color} text-white text-center`}
                     style={{
                       boxShadow: '4px 4px 8px #a3b1c6, -4px -4px 8px #ffffff',
                     }}>
                  <div className="text-sm font-bold">{emp.shift.name}</div>
                </div>

                {/* Status */}
                <div className="flex justify-center">
                  <StatusBadge status={emp.status} />
                </div>

                {/* Position */}
                <div className="text-center bg-[#e0e5ec] py-2 px-3 rounded-xl"
                     style={{
                       boxShadow: 'inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff',
                       background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
                     }}>
                  <span className="text-xs font-medium text-gray-700">{emp.position}</span>
                </div>

                {/* Notes */}
                <div className="text-center">
                  {emp.notes && (
                    <span className="text-xs text-gray-600 bg-[#e0e5ec] px-2 py-1 rounded-lg"
                          style={{
                            boxShadow: 'inset 2px 2px 4px #a3b1c6, inset -2px -2px 4px #ffffff',
                            background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
                          }}>
                      {emp.notes}
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {filteredSchedule.length === 0 && (
            <div className="text-center py-12 bg-[#e0e5ec] rounded-3xl"
                 style={{
                   boxShadow: 'inset 8px 8px 16px #a3b1c6, inset -8px -8px 16px #ffffff',
                   background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
                 }}>
              <p className="text-gray-500 text-lg font-medium">ไม่มีข้อมูลพนักงานในกะที่เลือก</p>
            </div>
          )}
        </div>

        {/* Department Color Legend */}
        <div className="mt-6 p-6 bg-[#e0e5ec] rounded-2xl"
             style={{
               boxShadow: 'inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff',
               background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
             }}>
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-indigo-600" />
            สีแผนกต่างๆ
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(departmentColorMap).map(([deptName, colors]) => (
              <div key={deptName} className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors.gradient} shadow-md`}
                     style={{
                       boxShadow: '2px 2px 4px #a3b1c6, -2px -2px 4px #ffffff',
                     }}></div>
                <span className="text-sm font-medium text-gray-700">{deptName}</span>
              </div>
            ))}
          </div>
        </div>

      {/* Floating decorative elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-blue-300 to-indigo-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}