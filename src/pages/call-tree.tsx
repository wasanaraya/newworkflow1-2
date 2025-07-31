import { useState, useMemo, useRef, useEffect } from "react";
import { useEmployees } from "@/hooks/use-employees";
import { useDepartments } from "@/hooks/use-departments";
import { Phone, Users, Building, Crown, Star, ChevronDown, Search, Filter, Zap, Globe, Shield } from "lucide-react";
import DefaultAvatarSVG from "@/components/default-avatar";

export default function CallTree() {
  const { data: employees = [] } = useEmployees();
  const { data: departments = [] } = useDepartments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [viewMode, setViewMode] = useState('hierarchy'); // hierarchy, departments, all
  const connectionLinesRef = useRef<HTMLDivElement>(null);

  // Position levels with hierarchy and advanced styling - Updated with admin data
  const positionLevels = [
    { 
      level: 1, 
      name: 'CEO', 
      color: 'from-red-500 via-red-600 to-red-700', 
      positions: ['ผู้จัดการ'], 
      icon: Crown,
      description: 'ผู้บริหารระดับสูง'
    },
    { 
      level: 2, 
      name: 'Assistant Manager', 
      color: 'from-blue-500 via-blue-600 to-blue-700', 
      positions: ['ผู้ช่วยผู้จัดการ'], 
      icon: Building,
      description: 'ผู้ช่วยผู้จัดการ'
    },
    { 
      level: 3, 
      name: 'Senior Officer', 
      color: 'from-green-500 via-green-600 to-green-700', 
      positions: ['เจ้าหน้าที่งานบริหารธนบัตรอาวุโส', 'ธนกรอาวุโส', 'ช่างเทคนิคอาวุโส(ควบ)', 'พนักงานบริการงานธนบัตรอาวุโส'], 
      icon: Star,
      description: 'เจ้าหน้าที่อาวุโส'
    },
    { 
      level: 4, 
      name: 'Officer', 
      color: 'from-yellow-500 via-yellow-600 to-yellow-700', 
      positions: ['เจ้าหน้าที่งานบริหารธนบัตร', 'เจ้าหน้าที่ชำนาญงาน', 'ธนกร'], 
      icon: Users,
      description: 'เจ้าหน้าที่'
    }
  ];

  // Advanced department styling with neumorphic colors
  const departmentStyles = {
    'ส่วนกลาง': { 
      gradient: 'from-purple-500 to-violet-600', 
      bg: 'bg-purple-50', 
      neomorphic: '#e0e5ec',
      shadow: 'shadow-purple-200/50'
    },
    'แผนกนับคัด': { 
      gradient: 'from-blue-500 to-indigo-600', 
      bg: 'bg-blue-50', 
      neomorphic: '#e0e5ec',
      shadow: 'shadow-blue-200/50'
    },
    'แผนกตรวจพิสูจน์': { 
      gradient: 'from-green-500 to-emerald-600', 
      bg: 'bg-green-50', 
      neomorphic: '#e0e5ec',
      shadow: 'shadow-green-200/50'
    },
    'แผนกอนุมัติ': { 
      gradient: 'from-orange-500 to-amber-600', 
      bg: 'bg-orange-50', 
      neomorphic: '#e0e5ec',
      shadow: 'shadow-orange-200/50'
    },
    'แผนกช่าง': { 
      gradient: 'from-teal-500 to-cyan-600', 
      bg: 'bg-teal-50', 
      neomorphic: '#e0e5ec',
      shadow: 'shadow-teal-200/50'
    },
    'แผนกธุรการ': { 
      gradient: 'from-rose-500 to-pink-600', 
      bg: 'bg-rose-50', 
      neomorphic: '#e0e5ec',
      shadow: 'shadow-rose-200/50'
    },
    'แผนกห้องมั่นคง': { 
      gradient: 'from-red-500 to-rose-600', 
      bg: 'bg-red-50', 
      neomorphic: '#e0e5ec',
      shadow: 'shadow-red-200/50'
    },
    'ไม่ระบุ': { 
      gradient: 'from-gray-500 to-slate-600', 
      bg: 'bg-gray-50', 
      neomorphic: '#e0e5ec',
      shadow: 'shadow-gray-200/50'
    }
  };

  // Advanced position level detection
  const getPositionLevel = (position: string): number => {
    for (const level of positionLevels) {
      if (level.positions.some(pos => position.includes(pos))) {
        return level.level;
      }
    }
    return 6;
  };

  // Filter and organize employees with advanced filtering
  const filteredEmployees = useMemo(() => {
    let filtered = employees.filter(emp => {
      const matchesSearch = searchQuery === '' || 
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.phone.includes(searchQuery);
      
      const matchesDepartment = selectedDepartment === 'all' || emp.department === selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    });

    // Updated structure: 1 CEO, 1 Assistant Manager, 4 Senior Officers, 4 Officers  
    return {
      ceo: filtered.filter(emp => getPositionLevel(emp.position) === 1).slice(0, 1),
      assistantManager: filtered.filter(emp => getPositionLevel(emp.position) === 2).slice(0, 1),
      seniorOfficer: filtered.filter(emp => getPositionLevel(emp.position) === 3).slice(0, 4),
      officer: filtered.filter(emp => getPositionLevel(emp.position) === 4).slice(0, 4)
    };
  }, [employees, searchQuery, selectedDepartment]);

  // Advanced 3D Neumorphic Employee Card
  const EmployeeCard = ({ employee, level, index }: { employee: any; level: number; index: number }) => {
    const levelInfo = positionLevels.find(p => p.level === level) || positionLevels[3];
    const IconComponent = levelInfo.icon;

    return (
      <div
        className="group relative"
        style={{
          animationDelay: `${index * 150}ms`,
          animation: 'fadeInUp 0.8s ease-out forwards',
        }}
      >
        {/* Advanced 3D Neumorphic Container */}
        <div className="relative w-60 h-72 transform transition-all duration-700 hover:scale-105 hover:-translate-y-2">
          
          {/* Neumorphic Card Base */}
          <div 
            className="w-full h-full rounded-3xl relative overflow-hidden transition-all duration-500 group-hover:shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
              boxShadow: `
                20px 20px 40px #a3b1c6, 
                -20px -20px 40px #ffffff,
                inset 4px 4px 8px #ffffff40,
                inset -4px -4px 8px #a3b1c640
              `,
            }}
          >
            
            {/* Advanced Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
              }} />
            </div>

            {/* Floating Light Particles */}
            <div className="absolute top-6 right-6 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-60" />
            <div className="absolute top-12 right-4 w-1 h-1 bg-purple-400 rounded-full animate-bounce opacity-50" />
            <div className="absolute bottom-12 left-6 w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse opacity-40" />
            
            {/* Advanced Level Badge */}
            <div 
              className={`absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br ${levelInfo.color} rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110`}
              style={{
                boxShadow: `
                  8px 8px 16px #a3b1c6, 
                  -8px -8px 16px #ffffff,
                  inset 2px 2px 4px #ffffff60,
                  inset -2px -2px 4px #00000020
                `,
              }}
            >
              <IconComponent className="w-8 h-8 text-white drop-shadow-lg filter" />
            </div>
            
            {/* Profile Section */}
            <div className="p-6 pt-8 text-center relative z-10">
              
              {/* Advanced 3D Profile Image */}
              <div className="relative mx-auto mb-4">
                <div className="w-28 h-28 mx-auto relative">
                  
                  {/* Image Container with Advanced Neumorphism */}
                  <div 
                    className="relative w-full h-full rounded-full overflow-hidden transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                    style={{
                      background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
                      boxShadow: `
                        12px 12px 24px #a3b1c6, 
                        -12px -12px 24px #ffffff,
                        inset 6px 6px 12px #ffffff60,
                        inset -6px -6px 12px #a3b1c640
                      `,
                    }}
                  >
                    <div className="w-full h-full p-1">
                      <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        {employee.imageUrl ? (
                          <img 
                            src={employee.imageUrl} 
                            className="w-full h-full object-cover" 
                            alt={`${employee.firstName} ${employee.lastName}`}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <DefaultAvatarSVG className="w-16 h-16" />
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Advanced Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
                  </div>
                  
                  {/* Status Indicator with Pulse */}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-lg">
                    <div className="w-full h-full bg-green-400 rounded-full animate-ping" />
                  </div>
                </div>
              </div>
              
              {/* Employee Information */}
              <div className="space-y-2">
                {/* Name with Advanced Typography */}
                <h3 className="text-lg font-bold text-gray-800 leading-tight tracking-wide">
                  {employee.firstName} {employee.lastName}
                </h3>
                
                {/* Position with Dynamic Line Breaking */}
                <div className="min-h-[2.5rem] flex items-center justify-center">
                  <p className="text-sm text-gray-600 leading-relaxed px-2 text-center font-medium">
                    {employee.position.length > 18 ? (
                      <>
                        <span className="block">{employee.position.substring(0, 18)}</span>
                        <span className="block">{employee.position.substring(18)}</span>
                      </>
                    ) : (
                      employee.position
                    )}
                  </p>
                </div>

              </div>
            </div>
            
            {/* Advanced Contact Section */}
            <div 
              className="absolute bottom-0 left-0 right-0 p-4 rounded-b-3xl transition-all duration-500"
              style={{
                background: 'linear-gradient(145deg, #d1d9e0, #c5d2df)',
                boxShadow: `
                  inset 6px 6px 12px #a3b1c6, 
                  inset -6px -6px 12px #ffffff
                `,
              }}
            >
              <div className="flex items-center justify-center space-x-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
                    boxShadow: `
                      4px 4px 8px #a3b1c6, 
                      -4px -4px 8px #ffffff
                    `,
                  }}
                >
                  <Phone className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-sm font-semibold text-gray-800 tracking-wide">
                  {employee.phone || 'ไม่มีข้อมูล'}
                </span>
              </div>
            </div>
            
            {/* Advanced Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-blue-400/5 group-hover:via-purple-400/5 group-hover:to-pink-400/5 rounded-3xl transition-all duration-500 pointer-events-none" />
          </div>
        </div>
      </div>
    );
  };

  // Advanced SVG Connection Lines with Morphing Effects
  const ConnectionLines = () => {
    return (
      <div className="absolute inset-0 pointer-events-none z-0" ref={connectionLinesRef}>
        <svg className="w-full h-full" viewBox="0 0 1200 1600" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Advanced Gradients with Multiple Stops */}
            <linearGradient id="advancedRedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#f87171" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#dc2626" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="advancedBlueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="advancedGreenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#4ade80" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#16a34a" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="advancedYellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#eab308" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#facc15" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="advancedPurpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#c084fc" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9333ea" stopOpacity="0.9" />
            </linearGradient>
            
            {/* Advanced Filter Effects */}
            <filter id="advancedGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMorphology operator="dilate" radius="1" result="expanded"/>
              <feFlood floodColor="#ffffff" floodOpacity="0.3" result="whiteFlood"/>
              <feComposite in="whiteFlood" in2="expanded" operator="in" result="whiteGlow"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="whiteGlow"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Morphing Animation */}
            <filter id="morphing">
              <feTurbulence baseFrequency="0.01" numOctaves="2" result="noise"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>
            </filter>
          </defs>
          
          {/* CEO to Assistant Manager with Advanced Styling */}
          {filteredEmployees.ceo.length > 0 && filteredEmployees.assistantManager.length > 0 && (
            <g>
              <line
                x1="600" y1="100" x2="600" y2="180"
                stroke="url(#advancedRedGradient)"
                strokeWidth="8"
                filter="url(#advancedGlow)"
                className="animate-pulse"
                strokeLinecap="round"
              />
              {/* Connection Node */}
              <circle cx="600" cy="140" r="6" fill="url(#advancedRedGradient)" filter="url(#advancedGlow)">
                <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          )}
          
          {/* Assistant Manager to Senior Officers with Advanced T-Shape */}
          {filteredEmployees.assistantManager.length > 0 && filteredEmployees.seniorOfficer.length > 0 && (
            <g>
              {/* Vertical stem */}
              <line
                x1="600" y1="420" x2="600" y2="480"
                stroke="url(#advancedGreenGradient)"
                strokeWidth="8"
                filter="url(#advancedGlow)"
                strokeLinecap="round"
              />
              {/* Horizontal bar with curves */}
              <path
                d="M 200 480 Q 400 470 600 480 Q 800 470 1000 480"
                stroke="url(#advancedGreenGradient)"
                strokeWidth="8"
                fill="none"
                filter="url(#advancedGlow)"
                strokeLinecap="round"
              />
              {/* Vertical connections to Directors */}
              {[0, 1, 2, 3].map(index => (
                <g key={index}>
                  <line
                    x1={200 + index * 267} y1="480" x2={200 + index * 267} y2="520"
                    stroke="url(#advancedGreenGradient)"
                    strokeWidth="8"
                    filter="url(#advancedGlow)"
                    strokeLinecap="round"
                  />
                  <circle cx={200 + index * 267} cy="500" r="6" fill="url(#advancedGreenGradient)" filter="url(#advancedGlow)">
                    <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                  </circle>
                </g>
              ))}
            </g>
          )}
          
          {/* Senior Officers to Officers with Flowing Lines */}
          {filteredEmployees.seniorOfficer.length > 0 && filteredEmployees.officer.length > 0 && (
            <g>
              {[0, 1, 2, 3].map(index => (
                <g key={index}>
                  <path
                    d={`M ${200 + index * 267} 600 Q ${200 + index * 267} 650 ${200 + index * 267} 680`}
                    stroke="url(#advancedYellowGradient)"
                    strokeWidth="8"
                    fill="none"
                    filter="url(#advancedGlow)"
                    strokeLinecap="round"
                  />
                  <circle cx={200 + index * 267} cy="640" r="6" fill="url(#advancedYellowGradient)" filter="url(#advancedGlow)">
                    <animate attributeName="r" values="4;8;4" dur="2s" repeatCount="indefinite" />
                  </circle>
                </g>
              ))}
            </g>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen p-8 relative overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)
        `
      }}
    >
      
      {/* Advanced Header Section */}
      <div className="relative z-20 mb-12">
        <div 
          className="max-w-7xl mx-auto p-8 rounded-3xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
            boxShadow: `
              25px 25px 50px #a3b1c6, 
              -25px -25px 50px #ffffff,
              inset 4px 4px 8px #ffffff60,
              inset -4px -4px 8px #a3b1c640
            `,
          }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%),
                linear-gradient(-45deg, transparent 40%, rgba(0,0,0,0.05) 50%, transparent 60%)
              `,
              backgroundSize: '20px 20px'
            }} />
          </div>

          {/* Header Content */}
          <div className="text-center relative z-10">
            <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-wide">
              📞 Call Tree Organization
            </h1>
            <p className="text-xl text-gray-600 mb-8">โครงสร้างองค์กรแห่งการเชื่อมต่อและสื่อสาร</p>
            
            {/* Advanced Control Panel */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              
              {/* Search Input */}
              <div 
                className="relative flex items-center"
                style={{
                  background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
                  boxShadow: `
                    inset 8px 8px 16px #a3b1c6, 
                    inset -8px -8px 16px #ffffff
                  `,
                  borderRadius: '20px',
                  padding: '12px 20px'
                }}
              >
                <Search className="w-5 h-5 text-gray-500 mr-3" />
                <input
                  type="text"
                  placeholder="ค้นหาพนักงาน..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-gray-700 placeholder-gray-500 w-64"
                />
              </div>

              {/* Department Filter */}
              <div 
                className="relative flex items-center"
                style={{
                  background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
                  boxShadow: `
                    inset 8px 8px 16px #a3b1c6, 
                    inset -8px -8px 16px #ffffff
                  `,
                  borderRadius: '20px',
                  padding: '12px 20px'
                }}
              >
                <Filter className="w-5 h-5 text-gray-500 mr-3" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="bg-transparent outline-none text-gray-700 appearance-none pr-8"
                >
                  <option value="all">ทุกแผนก</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-4 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex">
                {['hierarchy', 'departments', 'all'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                      viewMode === mode ? 'text-blue-600' : 'text-gray-600'
                    }`}
                    style={{
                      background: viewMode === mode 
                        ? 'linear-gradient(145deg, #dae1e7, #e6ebf0)' 
                        : 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
                      boxShadow: viewMode === mode
                        ? `inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff`
                        : `6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff`,
                      borderRadius: mode === 'hierarchy' ? '15px 0 0 15px' :
                                   mode === 'all' ? '0 15px 15px 0' : '0'
                    }}
                  >
                    {mode === 'hierarchy' ? 'ลำดับชั้น' : 
                     mode === 'departments' ? 'แผนก' : 'ทั้งหมด'}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats Bar with Advanced Design */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {positionLevels.map((level, index) => {
                const count = Object.values(filteredEmployees)[index]?.length || 0;
                return (
                  <div 
                    key={level.level} 
                    className="text-center p-4 rounded-2xl transition-all duration-300 hover:scale-105"
                    style={{
                      background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
                      boxShadow: `
                        12px 12px 24px #a3b1c6, 
                        -12px -12px 24px #ffffff,
                        inset 2px 2px 4px #ffffff40,
                        inset -2px -2px 4px #a3b1c640
                      `,
                    }}
                  >
                    <div 
                      className={`w-12 h-12 mx-auto mb-2 bg-gradient-to-br ${level.color} rounded-full flex items-center justify-center`}
                      style={{
                        boxShadow: `
                          6px 6px 12px #a3b1c6, 
                          -6px -6px 12px #ffffff
                        `,
                      }}
                    >
                      <level.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800">{count}</div>
                    <div className="text-xs text-gray-600 font-medium">{level.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Connection Lines */}
      <ConnectionLines />

      {/* Advanced Organization Chart */}
      <div className="relative z-20 max-w-7xl mx-auto">
        
        {/* Level 1 - CEO */}
        {filteredEmployees.ceo.length > 0 && (
          <div className="flex justify-center mb-24">
            <EmployeeCard employee={filteredEmployees.ceo[0]} level={1} index={0} />
          </div>
        )}

        {/* Level 2 - Assistant Manager */}
        {filteredEmployees.assistantManager.length > 0 && (
          <div className="flex justify-center mb-24">
            <EmployeeCard employee={filteredEmployees.assistantManager[0]} level={2} index={1} />
          </div>
        )}

        {/* Level 3 - Senior Officers */}
        {filteredEmployees.seniorOfficer.length > 0 && (
          <div className="flex justify-center space-x-6 mb-24 max-w-6xl mx-auto">
            {filteredEmployees.seniorOfficer.map((employee, index) => (
              <EmployeeCard key={employee.id} employee={employee} level={3} index={index + 2} />
            ))}
          </div>
        )}

        {/* Level 4 - Officers */}
        {filteredEmployees.officer.length > 0 && (
          <div className="flex justify-center space-x-6 mb-24 max-w-6xl mx-auto">
            {filteredEmployees.officer.map((employee, index) => (
              <EmployeeCard key={employee.id} employee={employee} level={4} index={index + 6} />
            ))}
          </div>
        )}

      </div>

      {/* Advanced Footer */}
      <div className="relative z-20 text-center mt-16">
        <div 
          className="inline-block p-8 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
            boxShadow: `
              25px 25px 50px #a3b1c6, 
              -25px -25px 50px #ffffff,
              inset 4px 4px 8px #ffffff60,
              inset -4px -4px 8px #a3b1c640
            `,
          }}
        >
          <div className="text-4xl font-bold text-gray-800 mb-4">
            รวม {employees.length} คน
          </div>
          <div className="text-gray-600 text-lg">
            พร้อมให้บริการและสื่อสารตลอด 24 ชั่วโมง
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: linear-gradient(145deg, #e6ebf0, #dae1e7);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(145deg, #a3b1c6, #8c9cb8);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(145deg, #8c9cb8, #a3b1c6);
        }
      `}</style>
    </div>
  );
}