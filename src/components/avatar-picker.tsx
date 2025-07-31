import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

// Import avatar images
import avatar1 from '@assets/OIP_1751040880493.jpg';
import avatar2 from '@assets/Screenshot 2025-06-18 024939_1751040880493.png';
import avatar3 from '@assets/Screenshot 2025-06-18 194604_1751040880493.png';
import avatar4 from '@assets/Screenshot 2025-06-18 194631_1751040880493.png';
import avatar5 from '@assets/Screenshot 2025-06-18 194707_1751040880494.png';
import avatar6 from '@assets/Screenshot 2025-06-18 194749_1751040880494.png';
import avatar7 from '@assets/Screenshot 2025-06-18 194859_1751040880494.png';
import avatar8 from '@assets/Screenshot 2025-06-18 195141_1751040880494.png';
import avatar9 from '@assets/Screenshot 2025-06-18 195240_1751040880494.png';
import avatar10 from '@assets/Screenshot 2025-06-18 195341_1751040880495.png';
import avatar11 from '@assets/Screenshot 2025-06-18 195407_1751040880495.png';
import avatar12 from '@assets/Screenshot 2025-06-18 195457_1751040880495.png';

const avatarOptions = [
  { id: 'avatar1', src: avatar1, name: 'ชาย - แว่นตา' },
  { id: 'avatar2', src: avatar2, name: 'ชาย - แว่นตา 2' },
  { id: 'avatar3', src: avatar3, name: 'ชาย - สูท' },
  { id: 'avatar4', src: avatar4, name: 'ชาย - เสื้อกันหนาว' },
  { id: 'avatar5', src: avatar5, name: 'ชาย - ฮู้ด' },
  { id: 'avatar6', src: avatar6, name: 'ชาย - หมวก' },
  { id: 'avatar7', src: avatar7, name: 'ชาย - แว่นตา 3' },
  { id: 'avatar8', src: avatar8, name: 'หญิง - เสื้อเขียว' },
  { id: 'avatar9', src: avatar9, name: 'หญิง - สูท' },
  { id: 'avatar10', src: avatar10, name: 'หญิง - เสื้อเขียว 2' },
  { id: 'avatar11', src: avatar11, name: 'หญิง - แว่นตา' },
  { id: 'avatar12', src: avatar12, name: 'หญิง - สูท 2' },
];

interface AvatarPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatarUrl: string) => void;
  currentAvatar?: string;
}

export default function AvatarPicker({ isOpen, onClose, onSelect, currentAvatar }: AvatarPickerProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || '');

  if (!isOpen) return null;

  const handleSelect = () => {
    onSelect(selectedAvatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-4xl mx-4 p-8 rounded-3xl"
        style={{
          background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
          boxShadow: `
            20px 20px 40px #a3b1c6,
            -20px -20px 40px #ffffff,
            inset 2px 2px 8px #ffffff80,
            inset -2px -2px 8px #a3b1c680
          `,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">เลือกรูปโปรไฟล์</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)',
              boxShadow: `6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff`,
            }}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Avatar Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6 max-h-96 overflow-y-auto">
          {avatarOptions.map((avatar) => (
            <div
              key={avatar.id}
              className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
                selectedAvatar === avatar.src ? 'ring-4 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedAvatar(avatar.src)}
            >
              <div 
                className="p-3 rounded-2xl"
                style={{
                  background: selectedAvatar === avatar.src 
                    ? 'linear-gradient(145deg, #dae1e7, #e6ebf0)' 
                    : 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
                  boxShadow: selectedAvatar === avatar.src
                    ? `inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff`
                    : `6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff`,
                }}
              >
                <img
                  src={avatar.src}
                  alt={avatar.name}
                  className="w-20 h-20 object-cover rounded-xl mx-auto"
                />
                <p className="text-xs text-center mt-2 text-gray-600 font-medium">
                  {avatar.name}
                </p>
                
                {/* Selected Indicator */}
                {selectedAvatar === avatar.src && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-medium text-gray-600 transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)',
              boxShadow: `6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff`,
            }}
          >
            ยกเลิก
          </button>
          <button
            onClick={handleSelect}
            disabled={!selectedAvatar}
            className={`px-6 py-3 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 ${
              !selectedAvatar ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            style={{
              background: selectedAvatar 
                ? 'linear-gradient(145deg, #3b82f6, #2563eb)' 
                : 'linear-gradient(145deg, #9ca3af, #6b7280)',
              boxShadow: selectedAvatar
                ? `6px 6px 12px #1e40af40, -6px -6px 12px #60a5fa40`
                : `6px 6px 12px #00000020, -6px -6px 12px #ffffff20`,
            }}
          >
            เลือก
          </button>
        </div>
      </div>
    </div>
  );
}