import { useState, useEffect } from "react";
import { X, Upload, FileText, Trash2, Users, Edit3, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DefaultAvatarSVG from "@/components/default-avatar";

import { insertEmployeeSchema } from "@shared/schema";
import type { Employee, InsertEmployee } from "@shared/schema";
import { useDepartments } from "@/hooks/use-departments";
import { useQuery } from "@tanstack/react-query";
import { fileToBase64 } from "@/lib/utils";

const formSchema = insertEmployeeSchema.extend({
  department: z.string().optional(),
  files: z.array(z.object({
    name: z.string(),
    url: z.string(),
    type: z.string()
  })).optional(),
});

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (employee: InsertEmployee) => void;
  onEdit?: (employee: Employee) => void;
  onDelete?: (employeeId: string) => void;
  employee?: Employee | null;
  isLoading?: boolean;
  mode?: 'view' | 'edit' | 'create';
}

export default function EmployeeModal({ isOpen, onClose, onSubmit, onEdit, onDelete, employee, isLoading, mode = 'view' }: EmployeeModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{name: string, url: string, type: string}>>([]);
  const [currentMode, setCurrentMode] = useState<'view' | 'edit' | 'create'>(mode);


  const { data: departments } = useDepartments();
  const { data: positions } = useQuery<Array<{id: number, name: string}>>({
    queryKey: ["/api/positions"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      employeeId: "",
      address: "",
      dateOfBirth: "",
      departmentId: null,
      positionId: null,
      profileImage: null,
      files: [],
    },
  });

  useEffect(() => {
    if (employee) {
      setCurrentMode(employee ? 'view' : 'create');
      form.reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email || "",
        phone: employee.phone || "",
        employeeId: employee.employeeId || "",
        address: employee.address || "",
        dateOfBirth: employee.dateOfBirth || "",
        departmentId: employee.departmentId,
        positionId: employee.positionId,
        profileImage: employee.profileImage,
        files: employee.files || [],
      });
      setPreviewImage(employee.profileImage);
      setUploadedFiles(employee.files || []);
    } else {
      setCurrentMode('create');
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        employeeId: "",
        address: "",
        dateOfBirth: "",
        departmentId: null,
        positionId: null,
        profileImage: null,
        files: [],
      });
      setPreviewImage(null);
      setUploadedFiles([]);
    }
  }, [employee, form]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setPreviewImage(base64);
        form.setValue("profileImage", base64);
      } catch (error) {
        console.error("Error converting file to base64:", error);
      }
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
          try {
            const base64 = await fileToBase64(file);
            newFiles.push({
              name: file.name,
              url: base64,
              type: file.type,
            });
          } catch (error) {
            console.error("Error converting file to base64:", error);
          }
        }
      }
      const updatedFiles = [...uploadedFiles, ...newFiles];
      setUploadedFiles(updatedFiles);
      form.setValue("files", updatedFiles);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
    form.setValue("files", updatedFiles);
  };



  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted with values:', values);
    console.log('Form errors:', form.formState.errors);
    
    try {
      const submitData: InsertEmployee = {
        ...values,
        department: values.department || "แผนกธุรการ",
        files: uploadedFiles || [],
      } as InsertEmployee;
      console.log('Submitting data:', submitData);
      await onSubmit(submitData);
      console.log('onSubmit completed successfully');
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      // Don't re-throw to prevent unhandled promise rejection
    }
  };



  const handleDeleteEmployee = () => {
    if (employee && onDelete) {
      onDelete(employee);
      onClose();
    }
  };

  const handleEditEmployee = () => {
    setCurrentMode('edit');
  };

  if (currentMode === 'view' && employee) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border-none shadow-2xl rounded-3xl"
                       style={{
                         background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
                         backdropFilter: 'blur(20px)',
                         border: '2px solid rgba(255, 255, 255, 0.3)',
                         boxShadow: '20px 20px 40px #a3b1c6, -20px -20px 40px #ffffff, inset 2px 2px 4px #ffffff, inset -2px -2px 4px #a3b1c6'
                       }}>
          <DialogHeader className="pb-4" style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-semibold flex items-center gap-3" style={{
                color: '#1e293b',
                textShadow: 'none'
              }}>
                <User className="w-6 h-6 text-slate-600" />
                ข้อมูลพนักงาน
              </DialogTitle>
              <div className="flex gap-3">
                <button
                  onClick={handleEditEmployee}
                  className="w-16 h-16 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group"
                  style={{
                    background: 'linear-gradient(145deg, #f0f2f5, #e1e5e9)',
                    boxShadow: `
                      8px 8px 16px #c1c7d0,
                      -8px -8px 16px #ffffff,
                      inset 0 0 0 1px rgba(255, 255, 255, 0.8)
                    `,
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `
                      12px 12px 24px #c1c7d0,
                      -12px -12px 24px #ffffff,
                      inset 0 0 0 1px rgba(255, 255, 255, 0.9)
                    `;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `
                      8px 8px 16px #c1c7d0,
                      -8px -8px 16px #ffffff,
                      inset 0 0 0 1px rgba(255, 255, 255, 0.8)
                    `;
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.boxShadow = `
                      inset 4px 4px 8px #c1c7d0,
                      inset -4px -4px 8px #ffffff
                    `;
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.boxShadow = `
                      8px 8px 16px #c1c7d0,
                      -8px -8px 16px #ffffff,
                      inset 0 0 0 1px rgba(255, 255, 255, 0.8)
                    `;
                  }}
                >
                  <Edit3 className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition-colors" />
                </button>
                <button
                  onClick={handleDeleteEmployee}
                  className="w-16 h-16 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group"
                  style={{
                    background: 'linear-gradient(145deg, #f0f2f5, #e1e5e9)',
                    boxShadow: `
                      8px 8px 16px #c1c7d0,
                      -8px -8px 16px #ffffff,
                      inset 0 0 0 1px rgba(255, 255, 255, 0.8)
                    `,
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `
                      12px 12px 24px #c1c7d0,
                      -12px -12px 24px #ffffff,
                      inset 0 0 0 1px rgba(255, 255, 255, 0.9)
                    `;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `
                      8px 8px 16px #c1c7d0,
                      -8px -8px 16px #ffffff,
                      inset 0 0 0 1px rgba(255, 255, 255, 0.8)
                    `;
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.boxShadow = `
                      inset 4px 4px 8px #c1c7d0,
                      inset -4px -4px 8px #ffffff
                    `;
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.boxShadow = `
                      8px 8px 16px #c1c7d0,
                      -8px -8px 16px #ffffff,
                      inset 0 0 0 1px rgba(255, 255, 255, 0.8)
                    `;
                  }}
                >
                  <Trash2 className="w-6 h-6 text-red-600 group-hover:text-red-700 transition-colors" />
                </button>
              </div>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="rounded-xl p-6 shadow-lg" style={{
                background: `
                  linear-gradient(145deg, rgba(0, 0, 0, 0.4), rgba(20, 20, 40, 0.6)),
                  radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.1) 0%, transparent 70%)
                `,
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                boxShadow: `
                  0 0 25px rgba(0, 255, 255, 0.3),
                  0 8px 32px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1),
                  inset 0 0 20px rgba(0, 255, 255, 0.05)
                `
              }}>
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-lg border-4 border-white">
                    {employee.imageUrl ? (
                      <img 
                        src={employee.imageUrl} 
                        alt={`${employee.firstName} ${employee.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <User className="w-12 h-12 text-blue-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-1 text-slate-800">
                    {employee.firstName} {employee.lastName}
                  </h3>
                  <p className="text-lg font-medium mb-2 text-blue-600">{employee.position}</p>
                  <div className="text-sm space-y-1 text-slate-600">
                    <p><strong>รหัส:</strong> {employee.id}</p>
                    <p><strong>แผนก:</strong> {employee.department}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Information Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="rounded-xl p-6 shadow-lg" style={{
                background: `
                  linear-gradient(145deg, rgba(0, 0, 0, 0.4), rgba(20, 20, 40, 0.6)),
                  radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.1) 0%, transparent 70%)
                `,
                backdropFilter: 'blur(15px)',
                border: '1px solid rgba(0, 255, 255, 0.3)',
                boxShadow: `
                  0 0 25px rgba(0, 255, 255, 0.3),
                  0 8px 32px rgba(0, 0, 0, 0.3),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1),
                  inset 0 0 20px rgba(0, 255, 255, 0.05)
                `
              }}>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                  <FileText className="w-5 h-5 text-blue-600" />
                  ข้อมูลติดต่อ
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">อีเมล</label>
                    <p className="font-medium text-slate-800">{employee.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">เบอร์โทรศัพท์</label>
                    <p className="font-medium text-slate-800">{employee.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">วันที่เริ่มงาน</label>
                    <p className="font-medium text-slate-800">{new Date(employee.startDate).toLocaleDateString('th-TH')}</p>
                  </div>
                </div>
              </div>

              {/* Car Information */}
              {(employee.carBrand || employee.carPlate || employee.carColor) && (
                <div className="rounded-xl p-6 shadow-lg" style={{
                  background: 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 8px 32px rgba(0, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 0 20px rgba(0, 255, 255, 0.05)'
                }}>
                  <h4 className="text-lg font-semibold mb-4 text-slate-800">ข้อมูลรถยนต์</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {employee.carBrand && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">ยี่ห้อ</label>
                        <p className="font-medium text-slate-800">{employee.carBrand}</p>
                      </div>
                    )}
                    {employee.carPlate && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">ทะเบียน</label>
                        <p className="font-medium text-slate-800">{employee.carPlate}</p>
                      </div>
                    )}
                    {employee.carColor && (
                      <div>
                        <label className="text-sm font-medium text-slate-600">สี</label>
                        <p className="font-medium text-slate-800">{employee.carColor}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Documents Section */}
              <div className="rounded-xl p-6 shadow-lg"
                   style={{
                     background: 'rgba(255, 255, 255, 0.4)',
                     backdropFilter: 'blur(15px)',
                     border: '1px solid rgba(255, 255, 255, 0.6)',
                     boxShadow: '0 8px 32px rgba(0, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 0 20px rgba(0, 255, 255, 0.05)'
                   }}>
                <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
                  <FileText className="w-5 h-5 text-blue-600" />
                  เอกสารแนบ (3 ไฟล์)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Mock Document 1 */}
                  <div className="flex items-center justify-between p-4 rounded-xl"
                       style={{
                         background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
                         boxShadow: `
                           inset 4px 4px 8px #c1c7d0,
                           inset -4px -4px 8px #ffffff
                         `
                       }}>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">ใบสมัครงาน.pdf</p>
                        <p className="text-xs text-slate-500">PDF • 2.3 MB</p>
                      </div>
                    </div>
                    <button
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'linear-gradient(145deg, #f0f2f5, #e1e5e9)',
                        boxShadow: `
                          4px 4px 8px #c1c7d0,
                          -4px -4px 8px #ffffff
                        `
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.boxShadow = `
                          inset 2px 2px 4px #c1c7d0,
                          inset -2px -2px 4px #ffffff
                        `;
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.boxShadow = `
                          4px 4px 8px #c1c7d0,
                          -4px -4px 8px #ffffff
                        `;
                      }}
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                    </button>
                  </div>

                  {/* Mock Document 2 */}
                  <div className="flex items-center justify-between p-4 rounded-xl"
                       style={{
                         background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
                         boxShadow: `
                           inset 4px 4px 8px #c1c7d0,
                           inset -4px -4px 8px #ffffff
                         `
                       }}>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">ประวัติการศึกษา.pdf</p>
                        <p className="text-xs text-slate-500">PDF • 1.8 MB</p>
                      </div>
                    </div>
                    <button
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'linear-gradient(145deg, #f0f2f5, #e1e5e9)',
                        boxShadow: `
                          4px 4px 8px #c1c7d0,
                          -4px -4px 8px #ffffff
                        `
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.boxShadow = `
                          inset 2px 2px 4px #c1c7d0,
                          inset -2px -2px 4px #ffffff
                        `;
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.boxShadow = `
                          4px 4px 8px #c1c7d0,
                          -4px -4px 8px #ffffff
                        `;
                      }}
                    >
                      <FileText className="w-4 h-4 text-green-600" />
                    </button>
                  </div>

                  {/* Mock Document 3 */}
                  <div className="flex items-center justify-between p-4 rounded-xl md:col-span-2"
                       style={{
                         background: 'linear-gradient(145deg, #f8fafc, #e2e8f0)',
                         boxShadow: `
                           inset 4px 4px 8px #c1c7d0,
                           inset -4px -4px 8px #ffffff
                         `
                       }}>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">ใบรับรองการทำงาน.pdf</p>
                        <p className="text-xs text-slate-500">PDF • 3.1 MB</p>
                      </div>
                    </div>
                    <button
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
                      style={{
                        background: 'linear-gradient(145deg, #f0f2f5, #e1e5e9)',
                        boxShadow: `
                          4px 4px 8px #c1c7d0,
                          -4px -4px 8px #ffffff
                        `
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.boxShadow = `
                          inset 2px 2px 4px #c1c7d0,
                          inset -2px -2px 4px #ffffff
                        `;
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.boxShadow = `
                          4px 4px 8px #c1c7d0,
                          -4px -4px 8px #ffffff
                        `;
                      }}
                    >
                      <FileText className="w-4 h-4 text-purple-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>


        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-none" style={{
        background: 'linear-gradient(135deg, rgba(224, 242, 254, 0.9) 0%, rgba(179, 229, 252, 0.8) 50%, rgba(129, 212, 250, 0.7) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 25px 50px rgba(0, 255, 255, 0.1), 0 0 40px rgba(255, 255, 255, 0.3), 0 0 80px rgba(0, 255, 255, 0.05)'
      }}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold" style={{
            color: '#ffffff',
            textShadow: '0 0 15px rgba(0, 255, 255, 0.8)'
          }}>{currentMode === 'edit' ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงานใหม่"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit, (errors) => {
            console.log('Form validation errors:', errors);
          })} className="space-y-6">
            {/* Profile Image Upload - Moved to top */}
            <div className="flex flex-col items-center space-y-4 p-6 rounded-xl" style={{
              background: `
                linear-gradient(145deg, rgba(0, 0, 0, 0.4), rgba(20, 20, 40, 0.6)),
                radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.1) 0%, transparent 70%)
              `,
              backdropFilter: 'blur(15px)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              boxShadow: `
                0 0 25px rgba(0, 255, 255, 0.3),
                0 8px 32px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 0 20px rgba(0, 255, 255, 0.05)
              `
            }}>
              <h4 className="text-lg font-medium" style={{
                color: '#ffffff',
                textShadow: '0 0 15px rgba(0, 255, 255, 0.8)'
              }}>รูปโปรไฟล์ 3D Avatar</h4>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full p-2" style={{
                  background: `
                    linear-gradient(145deg, rgba(0, 0, 0, 0.5), rgba(20, 20, 40, 0.7)),
                    radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.15) 0%, transparent 70%)
                  `,
                  border: '2px solid rgba(0, 255, 255, 0.4)',
                  boxShadow: `
                    0 0 25px rgba(0, 255, 255, 0.4),
                    0 4px 15px rgba(0, 0, 0, 0.3),
                    inset 0 2px 4px rgba(255, 255, 255, 0.1),
                    inset 0 0 15px rgba(0, 255, 255, 0.1)
                  `
                }}>
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Preview" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <DefaultAvatarSVG className="w-full h-full rounded-full" />
                  )}
                </div>
                <div className="text-center">
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="profileImage" className="cursor-pointer">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="inline-flex items-center space-x-2 bg-[#e0e5ec] border-none shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]" 
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4" />
                        <span>อัปโหลดรูป 3D Avatar</span>
                      </span>
                    </Button>
                  </label>

                  <p className="text-xs mt-2" style={{
                    color: 'rgba(255, 255, 255, 0.6)'
                  }}>หรืออัปโหลดรูป PNG, JPG, WebP ขนาดไม่เกิน 5MB</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">ข้อมูลส่วนตัว</h4>
                
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ชื่อ</FormLabel>
                      <FormControl>
                        <Input placeholder="ชื่อ" className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>นามสกุล</FormLabel>
                      <FormControl>
                        <Input placeholder="นามสกุล" className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>อีเมล</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="example@company.com" className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เบอร์โทรศัพท์</FormLabel>
                      <FormControl>
                        <Input placeholder="08XXXXXXXX" className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Work Information */}
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">ข้อมูลการทำงาน</h4>
                
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ตำแหน่ง</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]">
                            <SelectValue placeholder="เลือกตำแหน่ง" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#e0e5ec] border-none shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff]">
                          {positions?.map((position) => (
                            <SelectItem key={position.id} value={position.name}>
                              {position.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                

                
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>วันที่เริ่มงาน</FormLabel>
                      <FormControl>
                        <Input type="date" className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Car Information */}
                <div className="border-t pt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">ข้อมูลรถยนต์</h5>
                  <div className="grid grid-cols-1 gap-3">
                    <FormField
                      control={form.control}
                      name="carBrand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">ยี่ห้อรถ</FormLabel>
                          <FormControl>
                            <Input placeholder="Toyota, Honda, etc." className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="carPlate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">หมายเลขทะเบียน</FormLabel>
                          <FormControl>
                            <Input placeholder="1กข 1234" className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="carColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">สีรถ</FormLabel>
                          <FormControl>
                            <Input placeholder="ขาว, ดำ, แดง" className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="p-6 rounded-xl space-y-4" style={{boxShadow: 'inset 7px 7px 10px #a3b1c6, inset -7px -7px 10px #ffffff'}}>
              <h4 className="text-lg font-medium text-gray-900">เอกสารแนบ</h4>
              
              <div className="space-y-4">
                {/* File Upload Input */}
                <div className="text-center">
                  <Input
                    id="fileUpload"
                    type="file"
                    accept="application/pdf,.pdf,image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="inline-flex items-center space-x-2 bg-[#e0e5ec] border-none shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]" 
                      asChild
                    >
                      <span>
                        <Upload className="w-4 h-4" />
                        <span>อัปโหลดไฟล์ PDF หรือรูปภาพ</span>
                      </span>
                    </Button>
                  </label>
                  <p className="text-xs text-gray-500 mt-2">รองรับไฟล์ PDF และรูปภาพ (PNG, JPG, WebP)<br/>ขนาดไฟล์ไม่เกิน 10MB</p>
                </div>

                {/* Uploaded Files List */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700">ไฟล์ที่อัปโหลดแล้ว</h5>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 bg-[#e0e5ec] rounded-lg"
                          style={{boxShadow: '3px 3px 6px #a3b1c6, -3px -3px 6px #ffffff'}}
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-red-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate max-w-48">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {file.type === 'application/pdf' ? 'PDF Document' : 'Image File'}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="bg-[#e0e5ec] border-none shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
              >
                ยกเลิก
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="bg-[#4a90e2] text-white border-none shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff] hover:shadow-[inset_5px_5px_10px_#3a7bc8,_inset_-5px_-5px_10px_#5ba7ff] disabled:opacity-50"
              >
                {isLoading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
      

    </Dialog>
  );
}
