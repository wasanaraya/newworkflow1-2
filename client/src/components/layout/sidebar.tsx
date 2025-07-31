import { Link, useLocation } from "wouter";
import { useState } from "react";
import { 
  Home, 
  Users, 
  CalendarDays, 
  FileText, 
  CalendarClock, 
  UserCog, 
  PlaneTakeoff,
  Repeat,
  Settings,
  LogOut,
  Car,
  ChevronRight,
  ChevronLeft,
  Workflow
} from "lucide-react";

const navItems = [
  { path: "/", label: "Dashboard", icon: Home },
  { path: "/daily-schedule", label: "ตารางการทำงานประจำวัน", icon: CalendarDays },
  { path: "/calendar", label: "ตารางเวรวันหยุด", icon: CalendarClock },
  { path: "/leave-requests", label: "การลา", icon: UserCog },
  { path: "/annual-leave", label: "พักผ่อนประจำปี", icon: PlaneTakeoff },
  { path: "/shift-changes", label: "ขอเปลี่ยนเวร", icon: Repeat },
  { path: "/employees", label: "ข้อมูลพนักงาน", icon: Users },
  { path: "/call-tree", label: "Call Tree", icon: Workflow },
  { path: "/reports", label: "ออกรายงาน", icon: FileText },
  { path: "/departments", label: "Admin", icon: Settings },
  { path: "/user-permissions", label: "จัดการสิทธิ์ผู้ใช้", icon: UserCog },
];

export default function Sidebar() {
  const [location] = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside 
      className={`${isExpanded ? 'w-64' : 'w-16'} bg-[#e0e5ec] text-gray-800 flex flex-col shrink-0 transition-all duration-300 ease-in-out relative`} 
      style={{
        boxShadow: '15px 15px 30px #a3b1c6, -15px -15px 30px #ffffff, inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(163,177,198,0.5)',
        background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Logo & Brand */}
      <div className="h-20 flex items-center justify-center">
        <div className="p-3 rounded-xl bg-[#e0e5ec] transition-all duration-300 hover:scale-110"
             style={{
               boxShadow: '8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff, inset 2px 2px 4px rgba(255,255,255,0.8), inset -2px -2px 4px rgba(163,177,198,0.5)',
               background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
             }}>
          <Car className="h-8 w-8 text-indigo-600" />
        </div>
        {isExpanded && (
          <h1 className="ml-4 text-2xl font-bold text-gray-800 whitespace-nowrap bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Workforce
          </h1>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <div 
                className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 cursor-pointer relative group mx-1 ${
                  isActive 
                    ? 'text-indigo-600 bg-[#e0e5ec]' 
                    : 'text-gray-600 hover:text-indigo-500 hover:bg-[#e0e5ec]'
                }`}
                style={isActive ? {
                  boxShadow: 'inset 8px 8px 16px #a3b1c6, inset -8px -8px 16px #ffffff',
                  background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
                } : {}}
                title={!isExpanded ? item.label : ''}
              >
                <Icon className={`h-5 w-5 ${isExpanded ? 'mr-3' : 'mx-auto'}`} />
                {isExpanded && (
                  <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
                )}
                
                {/* Tooltip for collapsed state */}
                {!isExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Section */}
      <div className="px-2 py-4">
        <div 
          className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:text-indigo-500 hover:shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff] transition-all duration-300 cursor-pointer relative group"
          title={!isExpanded ? 'ออกจากระบบ' : ''}
        >
          <LogOut className={`h-5 w-5 ${isExpanded ? 'mr-3' : 'mx-auto'}`} />
          {isExpanded && (
            <span className="whitespace-nowrap">ออกจากระบบ</span>
          )}
          
          {/* Tooltip for collapsed state */}
          {!isExpanded && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              ออกจากระบบ
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
