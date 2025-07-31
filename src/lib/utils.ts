import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const departmentColors: Record<string, string> = {
  'ผู้จัดการ': 'bg-red-500',
  'ผู้ช่วยผู้จัดการ': 'bg-orange-500',
  'แผนกนับคัด': 'bg-amber-500',
  'แผนกตรวจพิสูจน์': 'bg-yellow-500',
  'แผนกอนุมัติ': 'bg-lime-500',
  'แผนกช่าง': 'bg-cyan-500',
  'แผนกธุรการ': 'bg-blue-500',
  'แผนกห้องมั่นคง': 'bg-indigo-500',
  'แผนกช่วยงาน': 'bg-purple-500',
  'ส่วนกลาง': 'bg-gray-500'
};

export const departmentBgColors: Record<string, string> = {
  'ผู้จัดการ': 'bg-red-100',
  'ผู้ช่วยผู้จัดการ': 'bg-orange-100',
  'แผนกนับคัด': 'bg-amber-100',
  'แผนกตรวจพิสูจน์': 'bg-yellow-100',
  'แผนกอนุมัติ': 'bg-lime-100',
  'แผนกช่าง': 'bg-cyan-100',
  'แผนกธุรการ': 'bg-blue-100',
  'แผนกห้องมั่นคง': 'bg-indigo-100',
  'แผนกช่วยงาน': 'bg-purple-100',
  'ส่วนกลาง': 'bg-gray-100'
};

export const departmentTextColors: Record<string, string> = {
  'ผู้จัดการ': 'text-red-800',
  'ผู้ช่วยผู้จัดการ': 'text-orange-800',
  'แผนกนับคัด': 'text-amber-800',
  'แผนกตรวจพิสูจน์': 'text-yellow-800',
  'แผนกอนุมัติ': 'text-lime-800',
  'แผนกช่าง': 'text-cyan-800',
  'แผนกธุรการ': 'text-blue-800',
  'แผนกห้องมั่นคง': 'text-indigo-800',
  'แผนกช่วยงาน': 'text-purple-800',
  'ส่วนกลาง': 'text-gray-800'
};

export const calculateWorkDuration = (startDate: string) => {
  if (!startDate) return { duration: 'N/A', endDate: 'N/A' };
  
  const start = new Date(startDate);
  const end = new Date(start);
  end.setFullYear(start.getFullYear() + 4);
  
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  
  return { 
    duration: `${years} ปี ${months} เดือน`, 
    endDate: end.toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) 
  };
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};
