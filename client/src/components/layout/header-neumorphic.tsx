import { useState, useEffect } from "react";
import { Bell, Settings, User, Calendar, Clock, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  title: string;
}

const NeumorphicCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-[#e0e5ec] rounded-2xl relative overflow-hidden transition-all duration-300 hover:scale-105 ${className}`}
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
    <div className="relative z-10 p-4">
      {children}
    </div>
    <div className="absolute top-2 left-3 w-8 h-1 bg-white/50 rounded-full blur-sm opacity-60"></div>
    <div className="absolute bottom-2 right-3 w-6 h-1 bg-white/30 rounded-full blur-sm opacity-40"></div>
  </div>
);

const ClockWidget = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = time.toLocaleTimeString('th-TH', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit', 
    hour12: false 
  });
  
  const dateString = time.toLocaleDateString('th-TH', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long'
  });

  const buddhistYear = time.toLocaleDateString('th-TH-u-ca-buddhist', { year: 'numeric' });

  return (
    <div className="flex items-center space-x-4">
      <NeumorphicCard className="min-w-[180px]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-gray-800">{timeString}</div>
            <div className="text-xs text-gray-600">เวลาปัจจุบัน</div>
          </div>
        </div>
      </NeumorphicCard>
      
      <NeumorphicCard className="min-w-[200px]">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-800">{dateString}</div>
            <div className="text-xs text-gray-600">{buddhistYear}</div>
          </div>
        </div>
      </NeumorphicCard>
    </div>
  );
};



export default function Header({ title }: HeaderProps) {
  const pageTitles = { 
    dashboard: 'แดชบอร์ด', 
    'daily-schedule': 'ตารางการทำงานประจำวัน', 
    'holiday-schedule': 'ตารางเวรวันหยุด', 
    employees: 'ข้อมูลพนักงาน', 
    departments: 'Admin',
    'leave-requests': 'การลา', 
    'shift-change': 'ขอเปลี่ยนเวร', 
    'annual-leave': 'ข้อมูลวันหยุดพักผ่อนประจำปี', 
    reports: 'ออกรายงาน', 
    calendar: 'ปฏิทิน',
    admin: 'ผู้ดูแลระบบ' 
  };

  return (
    <header className="h-32 bg-[#e0e5ec] flex items-center justify-between px-8 shrink-0 border-none relative overflow-hidden"
            style={{
              boxShadow: '25px 25px 50px #a3b1c6, -25px -25px 50px #ffffff, inset 3px 3px 6px rgba(255,255,255,0.8), inset -3px -3px 6px rgba(163,177,198,0.6)',
              background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
            }}>
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-cyan-500/5 opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-to-tl from-white/15 via-transparent to-white/10"></div>
      
      {/* Animated Particles */}
      <div className="absolute top-4 left-6 w-2 h-2 bg-blue-400/40 rounded-full animate-pulse"></div>
      <div className="absolute top-8 right-8 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
      <div className="absolute bottom-6 left-10 w-1 h-1 bg-cyan-400/50 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
      
      {/* Left Section - Title */}
      <div className="flex items-center relative z-10">
        <NeumorphicCard className="min-w-[300px]">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Menu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {pageTitles[title as keyof typeof pageTitles] || title}
              </h1>
              <p className="text-sm text-gray-600">ระบบจัดการพนักงาน</p>
            </div>
          </div>
        </NeumorphicCard>
      </div>

      {/* Center Section - Empty for balance */}
      <div className="flex-1"></div>

      {/* Right Section - Clock & User Actions */}
      <div className="flex items-center space-x-6 relative z-10">
        
        {/* Clock Widget */}
        <ClockWidget />

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative">
                <NeumorphicCard className="w-12 h-12 p-0 cursor-pointer">
                  <div className="flex items-center justify-center w-full h-full">
                    <Bell className="w-5 h-5 text-gray-700" />
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs bg-red-500 text-white border-2 border-[#e0e5ec]">
                      3
                    </Badge>
                  </div>
                </NeumorphicCard>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>การแจ้งเตือน</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">คำขอลาใหม่</p>
                  <p className="text-xs text-gray-500">สมชาย ส. ขอลาป่วย 1 วัน</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">เปลี่ยนเวรงาน</p>
                  <p className="text-xs text-gray-500">สมใส จ. ขอเปลี่ยนเวรวันเสาร์</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">วันหยุดใกล้หมด</p>
                  <p className="text-xs text-gray-500">คุณมีวันหยุดเหลือ 5 วัน</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <NeumorphicCard className="w-12 h-12 p-0 cursor-pointer">
            <div className="flex items-center justify-center w-full h-full">
              <Settings className="w-5 h-5 text-gray-700" />
            </div>
          </NeumorphicCard>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
                <NeumorphicCard className="w-12 h-12 p-0">
                  <div className="flex items-center justify-center w-full h-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/api/placeholder/32/32" alt="Profile" />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                        <User className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </NeumorphicCard>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">ผู้ดูแลระบบ</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    admin@company.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>โปรไฟล์</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>ตั้งค่า</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>ออกจากระบบ</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}