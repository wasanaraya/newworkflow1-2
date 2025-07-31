import React, { useState, useEffect, useMemo } from 'react';
import { 
  Mail, Phone, Car, Briefcase, Paperclip, Upload, X, Edit, Trash2, PlusCircle, FileText, Eye, Camera 
} from 'lucide-react';
import { useEmployees, useCreateEmployee, useUpdateEmployee, useDeleteEmployee } from "@/hooks/use-employees";
import { useDepartments } from "@/hooks/use-departments";
import { usePositions } from "@/hooks/use-positions";
import { useToast } from "@/hooks/use-toast";
import DefaultAvatarSVG from "@/components/default-avatar";
import AvatarPicker from "@/components/avatar-picker";

// --- Data & Helpers ---
const initialPositions = [ 
  'ผู้จัดการ', 'ผู้ช่วยผู้จัดการ', 'เจ้าหน้าที่งานบริหารธนบัตรอาวุโส', 
  'เจ้าหน้าที่งานบริหารธนบัตรอาวุโส(ควบ)', 'ธนกรชำนาญ', 'ธนกรอาวุโส(ควบ)', 
  'ช่างเทคนิคอาวุโส(ควบ)', 'ธนกร', 'พนักงานธุรการธนบัตรอาวุโส'
];

const initialDepartments = [ 
  'แผนกธุรการ', 'แผนกนับคัด', 'แผนกตรวจพิสูจน์', 'แผนกอนุมัติ', 
  'แผนกช่าง', 'แผนกห้องมั่นคง', 'แผนกช่วยงาน' 
];

const calculateWorkDuration = (startDate: string) => {
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
    endDate: end.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) 
  };
};

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
  const reader = new FileReader(); 
  reader.readAsDataURL(file); 
  reader.onload = () => resolve(reader.result as string); 
  reader.onerror = error => reject(error);
});

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  error?: string;
}

const InputField = ({ label, name, value, onChange, type = 'text', required = false, error = '' }: InputFieldProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input 
      type={type} 
      name={name} 
      value={value || ''} 
      onChange={onChange} 
      required={required} 
      className={`w-full p-2 bg-[#e0e5ec] rounded-lg border-none ${error ? 'shadow-[inset_3px_3px_5px_#a3b1c6,_inset_-3px_-3px_5px_#ffffff,_inset_0_0_0_2px_#ef4444]' : 'shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]'}`} 
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  imageUrl: string | null;
  carBrand: string | null;
  carPlate: string | null;
  carColor: string | null;
  startDate: string;
  files: Array<{name: string, url: string, type: string}>;
}

interface EmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onViewFiles: (employee: Employee) => void;
}

const EmployeeCard = ({ employee, onEdit, onViewFiles }: EmployeeCardProps) => (
  <div className="rounded-2xl p-4 bg-[#e0e5ec] transition-all duration-300 w-full" style={{boxShadow: '8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff'}}>
    <div className="flex items-start space-x-3">
      <div className="relative p-1.5 rounded-xl w-16 h-16 flex-shrink-0" style={{boxShadow: 'inset 5px 5px 8px #a3b1c6, inset -5px -5px 8px #ffffff'}}>
        {employee.imageUrl ? 
          <img src={employee.imageUrl} className="w-full h-full rounded-lg object-cover" alt="avatar" /> : 
          <img src="/attached_assets/20250625_2109_อะนิเมะ 3D นูนต่ำ_remix_01jykpkyxgf9ds2bvd44e834qh_1750868994981.png" className="w-full h-full rounded-lg object-cover" alt="default avatar" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-bold text-gray-800 break-words leading-tight">{employee.firstName} {employee.lastName}</h3>
        <p className="text-indigo-600 font-medium text-sm break-words">{employee.position}</p>
        <p className="text-xs text-gray-500 break-words">{employee.id}</p>
      </div>
    </div>
    
    <div className="mt-3 space-y-2">
      <div className="p-3 rounded-lg space-y-2" style={{boxShadow: 'inset 5px 5px 8px #a3b1c6, inset -5px -5px 8px #ffffff'}}>
        <div className="flex items-start text-xs"><Mail className="w-4 h-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0"/><span className="break-words flex-1">{employee.email || '-'}</span></div>
        <div className="flex items-start text-xs"><Phone className="w-4 h-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0"/><span className="break-words flex-1">{employee.phone || '-'}</span></div>
        <div className="flex items-start text-xs"><Car className="w-4 h-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0"/><span className="break-words flex-1">{employee.carBrand ? `${employee.carBrand} / ${employee.carPlate} / ${employee.carColor}` : '-'}</span></div>
        <div className="flex items-start text-xs"><Briefcase className="w-4 h-4 mr-2 text-gray-500 mt-0.5 flex-shrink-0"/><span className="break-words flex-1">อายุงาน: {calculateWorkDuration(employee.startDate).duration}</span></div>
      </div>

      {employee.files && employee.files.length > 0 && (
        <div className="p-2 rounded-lg" style={{boxShadow: 'inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff'}}>
          <div className="text-xs text-blue-600 flex items-center">
            <Paperclip className="w-3 h-3 mr-1" />
            เอกสารแนบ {employee.files.length} ไฟล์
          </div>
        </div>
      )}
    </div>

    <div className="mt-2 flex justify-end space-x-2">
      <button 
        onClick={() => onViewFiles(employee)} 
        className="p-2 rounded-lg text-green-600 transition-all duration-200 active:shadow-[inset_3px_3px_6px_#a3b1c6,_inset_-3px_-3px_6px_#ffffff]" 
        style={{boxShadow: '3px 3px 6px #a3b1c6, -3px -3px 6px #ffffff'}}
        title="ดูเอกสารแนบ"
      >
        <FileText className="w-4 h-4"/>
      </button>
      <button onClick={() => onEdit(employee)} className="p-2 rounded-lg text-blue-600 transition-all duration-200 active:shadow-[inset_3px_3px_6px_#a3b1c6,_inset_-3px_-3px_6px_#ffffff]" style={{boxShadow: '3px 3px 6px #a3b1c6, -3px -3px 6px #ffffff'}}>
        <Edit className="w-4 h-4"/>
      </button>
    </div>
  </div>
);

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any, imageFile: File | null, pdfFiles: File[]) => Promise<void>;
  onDelete?: (employee: Employee) => void;
  employee: Employee | null;
  existingIds: string[];
  departments: string[];
  positions: string[];
}

const EmployeeModal = ({ isOpen, onClose, onSave, onDelete, employee, existingIds, departments, positions }: EmployeeModalProps) => {
  const [formData, setFormData] = useState({
    id: '', firstName: '', lastName: '', email: '', phone: '',
    position: '', department: '', imageUrl: null,
    phoneBrand: '', phoneModel: '', phoneBrandCustom: '',
    carBrand: '', carPlate: '', carColor: '', carBrandCustom: '',
    startDate: '', files: []
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [idError, setIdError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  useEffect(() => {
    const defaultData = {
      id: '', firstName: '', lastName: '', email: '', phone: '',
      position: '', department: '', imageUrl: null,
      phoneBrand: '', phoneModel: '', phoneBrandCustom: '',
      carBrand: '', carPlate: '', carColor: '', carBrandCustom: '',
      startDate: new Date().toISOString().split('T')[0], files: []
    };

    if (employee) {
      setFormData({ 
        ...defaultData, 
        ...employee, 
        files: employee.files || [], 
        carBrand: employee.carBrand || '',
        carPlate: employee.carPlate || '',
        carColor: employee.carColor || '',
        phoneBrand: employee.phoneBrand || '',
        phoneModel: employee.phoneModel || ''
      });
      setImagePreview(employee.imageUrl);
    } else {
      const newIdNumber = Math.max(0, ...existingIds.map(id => parseInt(id.replace('EMP', '')))) + 1;
      const newId = `EMP${String(newIdNumber).padStart(3, '0')}`;
      setFormData({ ...defaultData, id: newId });
      setImagePreview(null);
    }
    
    setIdError('');
    setImageFile(null);
    setPdfFiles([]);
    setIsSaving(false);
    setSaveError('');
  }, [employee, isOpen, existingIds]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newId = e.target.value.toUpperCase();
    setFormData(prev => ({ ...prev, id: newId }));
    setIdError(existingIds.includes(newId) && (!employee || employee.id !== newId) ? 'รหัสพนักงานนี้มีอยู่แล้ว' : '');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  const handleAvatarSelect = (avatarUrl: string) => {
    setImagePreview(avatarUrl);
    setImageFile(null); // Clear any uploaded file
    setFormData(prev => ({ ...prev, imageUrl: avatarUrl }));
  };;

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPdfFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };
  
  const removeExistingFile = (fileName: string) => {
    setFormData(prev => ({ ...prev, files: prev.files.filter((f: any) => f.name !== fileName) }));
  };
  
  const removeNewPdf = (fileName: string) => {
    setPdfFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (idError || isSaving) return;
    setIsSaving(true);
    setSaveError('');
    try {
      // จัดการข้อมูล custom เมื่อเลือก "อื่นๆ"
      const finalFormData = {
        ...formData,
        phoneBrand: formData.phoneBrand === 'อื่นๆ' ? formData.phoneBrandCustom : formData.phoneBrand,
        carBrand: formData.carBrand === 'อื่นๆ' ? formData.carBrandCustom : formData.carBrand,
        // Ensure imageUrl is set correctly
        imageUrl: imageFile ? null : (imagePreview || null)
      };
      
      await onSave(finalFormData, imageFile, pdfFiles);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const currentAvatar = imagePreview ? <img src={imagePreview} alt="Avatar Preview" className="w-full h-full rounded-2xl object-cover"/> : <img src="/attached_assets/20250625_2109_อะนิเมะ 3D นูนต่ำ_remix_01jykpkyxgf9ds2bvd44e834qh_1750868994981.png" className="w-full h-full rounded-2xl object-cover" alt="default avatar" />;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-[#e0e5ec] rounded-xl shadow-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto" style={{boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff'}}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{employee ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่'}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-gray-600 hover:text-gray-800 transition-all duration-300"
            style={{boxShadow: '5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff'}}
          >
            <X className="w-6 h-6"/>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 flex flex-col items-center space-y-4">
              <div className="p-2 rounded-2xl w-36 h-36" style={{boxShadow: 'inset 7px 7px 10px #a3b1c6, inset -7px -7px 10px #ffffff'}}>{currentAvatar}</div>
              
              {/* Avatar Selection Buttons */}
              <div className="flex flex-col space-y-2 w-full">
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(true)}
                  className="flex items-center justify-center bg-[#e0e5ec] text-indigo-600 font-semibold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105"
                  style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}
                >
                  <Camera className="w-5 h-5 mr-2" />
                  เลือกรูปโปรไฟล์
                </button>
                
                <label htmlFor="image-upload" className="cursor-pointer flex items-center justify-center bg-[#e0e5ec] text-gray-600 font-semibold px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105" style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}>
                  <Upload className="w-5 h-5 mr-2" />
                  อัปโหลดรูป
                </label>
                <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange}/>
              </div>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="รหัสพนักงาน" name="id" value={formData.id} onChange={handleIdChange} required error={idError} />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ตำแหน่ง</label>
                <select name="position" value={formData.position} onChange={handleChange} required className={`w-full p-2.5 bg-[#e0e5ec] rounded-lg border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]`}>
                  <option value="">เลือกตำแหน่ง</option>
                  {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">แผนก</label>
                <select name="department" value={formData.department} onChange={handleChange} required className={`w-full p-2.5 bg-[#e0e5ec] rounded-lg border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]`}>
                  <option value="">เลือกแผนก</option>
                  {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
                </select>
              </div>
              <InputField label="ชื่อ" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <InputField label="นามสกุล" name="lastName" value={formData.lastName} onChange={handleChange} required />
              <div className="sm:col-span-2"><InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required /></div>
              <InputField label="วันที่เริ่มงาน" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
            </div>
          </div>

          <div className="col-span-1 md:col-span-3">
            <h4 className="font-bold text-gray-700 mb-2">ข้อมูลโทรศัพท์</h4>
            <div className="p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4" style={{boxShadow: 'inset 7px 7px 10px #a3b1c6, inset -7px -7px 10px #ffffff'}}>
              <InputField label="เบอร์โทรศัพท์" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ยี่ห้อโทรศัพท์</label>
                <select name="phoneBrand" value={formData.phoneBrand} onChange={handleChange} className="w-full p-2.5 bg-[#e0e5ec] rounded-lg border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]">
                  <option value="">เลือกยี่ห้อ</option>
                  <option value="iPhone">iPhone (Apple)</option>
                  <option value="Samsung">Samsung</option>
                  <option value="Huawei">Huawei</option>
                  <option value="Xiaomi">Xiaomi</option>
                  <option value="Oppo">Oppo</option>
                  <option value="Vivo">Vivo</option>
                  <option value="OnePlus">OnePlus</option>
                  <option value="Realme">Realme</option>
                  <option value="Google Pixel">Google Pixel</option>
                  <option value="Sony">Sony</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
                {formData.phoneBrand === 'อื่นๆ' && (
                  <input
                    type="text"
                    name="phoneBrandCustom"
                    placeholder="ระบุยี่ห้อโทรศัพท์"
                    value={formData.phoneBrandCustom || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-[#e0e5ec] rounded-lg border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff] mt-2"
                  />
                )}
              </div>
              <InputField label="รุ่นโทรศัพท์" name="phoneModel" value={formData.phoneModel || ''} onChange={handleChange} />
            </div>
          </div>

          <div className="col-span-1 md:col-span-3">
            <h4 className="font-bold text-gray-700 mb-2">ข้อมูลรถยนต์</h4>
            <div className="p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-4" style={{boxShadow: 'inset 7px 7px 10px #a3b1c6, inset -7px -7px 10px #ffffff'}}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ยี่ห้อรถ</label>
                <select name="carBrand" value={formData.carBrand} onChange={handleChange} className="w-full p-2.5 bg-[#e0e5ec] rounded-lg border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]">
                  <option value="">เลือกยี่ห้อ</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Mazda">Mazda</option>
                  <option value="Nissan">Nissan</option>
                  <option value="Isuzu">Isuzu</option>
                  <option value="Ford">Ford</option>
                  <option value="Chevrolet">Chevrolet</option>
                  <option value="Mitsubishi">Mitsubishi</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes-Benz">Mercedes-Benz</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
                {formData.carBrand === 'อื่นๆ' && (
                  <input
                    type="text"
                    name="carBrandCustom"
                    placeholder="ระบุยี่ห้อรถยนต์"
                    value={formData.carBrandCustom || ''}
                    onChange={handleChange}
                    className="w-full p-2.5 bg-[#e0e5ec] rounded-lg border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff] mt-2"
                  />
                )}
              </div>
              <InputField label="ทะเบียน" name="carPlate" value={formData.carPlate} onChange={handleChange} />
              <InputField label="สี" name="carColor" value={formData.carColor} onChange={handleChange} />
            </div>
          </div>
          
          <div className="col-span-1 md:col-span-3">
            <h4 className="font-bold text-gray-600 mb-2">เอกสารแนบ (PDF)</h4>
            <div className="space-y-2 mb-2">
              {formData.files?.map((file: any, i: number) => (
                <div key={`ex-${i}`} className="flex justify-between items-center text-sm p-2 rounded-lg" style={{boxShadow: '5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff'}}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 truncate">{file.name}</a>
                  <button type="button" onClick={() => removeExistingFile(file.name)}>
                    <X className="w-4 h-4 text-red-500"/>
                  </button>
                </div>
              ))}
              {pdfFiles.map((file, i) => (
                <div key={`new-${i}`} className="flex justify-between items-center text-sm p-2 rounded-lg" style={{boxShadow: '5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff'}}>
                  <span className="truncate">{file.name}</span>
                  <button type="button" onClick={() => removeNewPdf(file.name)}>
                    <X className="w-4 h-4 text-red-500"/>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="pdf-upload" className="cursor-pointer flex items-center justify-center w-full bg-[#e0e5ec] text-gray-500 font-semibold px-4 py-2 rounded-xl transition-all duration-300" style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}>
              <Upload className="w-5 h-5 mr-2"/>
              เพิ่มไฟล์ PDF
            </label>
            <input id="pdf-upload" type="file" accept=".pdf" multiple className="hidden" onChange={handlePdfChange}/>
          </div>

          {saveError && <div className="text-center p-3 rounded-lg bg-red-100 text-red-700 font-semibold">{saveError}</div>}
          
          <div className="flex justify-between col-span-1 md:col-span-3">
            <div>
              {employee && onDelete && (
                <button 
                  type="button" 
                  onClick={() => {
                    if (window.confirm(`คุณต้องการลบข้อมูลของ ${employee.firstName} ${employee.lastName} หรือไม่?`)) {
                      onDelete(employee);
                      onClose();
                    }
                  }}
                  className="bg-red-600 text-white font-semibold px-6 py-2 rounded-xl hover:bg-red-700 transition-all duration-300"
                >
                  ลบข้อมูล
                </button>
              )}
            </div>
            <div className="flex space-x-4">
              <button type="button" onClick={onClose} className="px-6 py-2 rounded-xl" style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}>
                ยกเลิก
              </button>
              <button type="submit" disabled={!!idError || isSaving} className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-xl disabled:bg-gray-400 disabled:text-gray-200 disabled:shadow-none w-32">
                {isSaving ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </form>
        
        {/* Avatar Picker Modal */}
        <AvatarPicker
          isOpen={showAvatarPicker}
          onClose={() => setShowAvatarPicker(false)}
          onSelect={handleAvatarSelect}
          currentAvatar={imagePreview}
        />
      </div>
    </div>
  );
};

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onAdd: () => void;
  onViewFiles: (employee: Employee) => void;
}

const EmployeeList = ({ employees, onEdit, onAdd, onViewFiles }: EmployeeListProps) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold text-gray-800">จัดการข้อมูลพนักงาน</h1>
      <button 
        onClick={onAdd} 
        className="flex items-center bg-[#e0e5ec] text-indigo-600 font-semibold px-5 py-3 rounded-xl hover:text-indigo-700 transition-all duration-300 active:shadow-[inset_7px_7px_15px_#a3b1c6,_inset_-7px_-7px_15px_#ffffff]" 
        style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}
      >
        <PlusCircle className="h-5 w-5 mr-2" />
        เพิ่มพนักงาน
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 auto-rows-min">
      {employees.map(emp => (
        <EmployeeCard key={emp.id} employee={emp} onEdit={onEdit} onViewFiles={onViewFiles} />
      ))}
    </div>
  </div>
);

// Files Modal Component
interface FilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const FilesModal = ({ isOpen, onClose, employee }: FilesModalProps) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-[#e0e5ec] rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[80vh] overflow-y-auto" style={{boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff'}}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">เอกสารแนบของ {employee.firstName} {employee.lastName}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full text-gray-600 hover:text-gray-800 transition-all duration-300"
            style={{boxShadow: '5px 5px 10px #a3b1c6, -5px -5px 10px #ffffff'}}
          >
            <X className="w-6 h-6"/>
          </button>
        </div>
        
        {employee.files && employee.files.length > 0 ? (
          <div className="space-y-4">
            {employee.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-[#e0e5ec]" style={{boxShadow: 'inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff'}}>
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-blue-600"/>
                  <div>
                    <p className="font-semibold text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">{file.type}</p>
                  </div>
                </div>
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300"
                >
                  <Eye className="w-4 h-4"/>
                  <span>ดู</span>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
            <p className="text-gray-500 text-lg">ไม่มีเอกสารแนบ</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default function EmployeesPage() {
  const { data: employees = [], isError: employeesError } = useEmployees();
  const { data: departments = [], isError: departmentsError } = useDepartments();
  const { data: positions = [], isError: positionsError } = usePositions();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();
  const { toast } = useToast();

  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showFilesModal, setShowFilesModal] = useState(false);
  const [selectedEmployeeForFiles, setSelectedEmployeeForFiles] = useState<Employee | null>(null);

  const allDepartments = [...new Set([...initialDepartments, ...departments.map(d => d.name)])];
  const allPositions = [...new Set([...initialPositions, ...positions.map(p => p.name)])];

  const handleSaveEmployee = async (employeeData: any, imageFile: File | null, pdfFiles: File[]) => {
    try {
      let imageUrl = employeeData.imageUrl;
      
      // Handle image upload
      if (imageFile) {
        imageUrl = await fileToBase64(imageFile);
      } else if (employeeData.imageUrl && !imageFile) {
        // Use the selected avatar from avatar picker
        imageUrl = employeeData.imageUrl;
      }

      // Handle PDF files
      const existingFiles = employeeData.files || [];
      const newFiles = await Promise.all(
        pdfFiles.map(async (file) => ({
          name: file.name,
          url: await fileToBase64(file),
          type: file.type
        }))
      );

      const employeeToSave = {
        ...employeeData,
        imageUrl,
        files: [...existingFiles, ...newFiles]
      };

      console.log('💾 Saving employee data:', employeeToSave);
      
      if (editingEmployee) {
        await updateEmployee.mutateAsync({ id: editingEmployee.id, ...employeeToSave });
        toast({
          title: "สำเร็จ",
          description: "อัปเดตข้อมูลพนักงานเรียบร้อยแล้ว",
        });
      } else {
        // Remove id from data when creating new employee (let server generate it)
        const { id, ...employeeWithoutId } = employeeToSave;
        await createEmployee.mutateAsync(employeeWithoutId);
        toast({
          title: "สำเร็จ",
          description: "เพิ่มพนักงานใหม่เรียบร้อยแล้ว",
        });
      }
      
      setShowEmployeeModal(false);
      setEditingEmployee(null);
    } catch (error: any) {
      console.error('Save employee error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถบันทึกข้อมูลได้",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDeleteEmployee = async (employeeToDelete: Employee) => {
    try {
      console.log('🗑️ Attempting to delete employee:', employeeToDelete.id);
      await deleteEmployee.mutateAsync(employeeToDelete.id);
      toast({
        title: "สำเร็จ",
        description: "ลบข้อมูลพนักงานเรียบร้อยแล้ว",
      });
      console.log('✅ Employee deletion completed');
    } catch (error: any) {
      console.error('Delete employee error:', error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: error.message || "ไม่สามารถลบข้อมูลได้",
        variant: "destructive",
      });
      // Don't re-throw the error to prevent unhandled promise rejection
    }
  };

  const handleViewFiles = (employee: Employee) => {
    setSelectedEmployeeForFiles(employee);
    setShowFilesModal(true);
  };

  return (
    <div className="p-8 bg-[#e0e5ec] min-h-screen">
      <EmployeeList 
        employees={employees} 
        onEdit={(emp) => {
          setEditingEmployee(emp);
          setShowEmployeeModal(true);
        }} 
        onAdd={() => {
          setEditingEmployee(null);
          setShowEmployeeModal(true);
        }}
        onViewFiles={handleViewFiles}
      />
      
      <EmployeeModal 
        isOpen={showEmployeeModal} 
        onClose={() => {
          setShowEmployeeModal(false);
          setEditingEmployee(null);
        }} 
        onSave={handleSaveEmployee} 
        onDelete={handleDeleteEmployee}
        employee={editingEmployee} 
        existingIds={employees.map(e => e.id)} 
        departments={allDepartments} 
        positions={allPositions} 
      />

      <FilesModal 
        isOpen={showFilesModal}
        onClose={() => {
          setShowFilesModal(false);
          setSelectedEmployeeForFiles(null);
        }}
        employee={selectedEmployeeForFiles}
      />
    </div>
  );
}