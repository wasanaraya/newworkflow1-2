import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle, XCircle, Loader2, Database } from 'lucide-react';

export default function DatabaseStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Test connection function
  const testConnection = async () => {
    console.log('🔍 Testing Supabase connection...')
    console.log('🔗 Supabase URL:', supabase.supabaseUrl)
    console.log('🔑 API Key status:', supabase.supabaseKey ? 'Available' : 'Missing')
    
    try {
      console.log('📡 Attempting to connect to employees table...')
      
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout after 10 seconds')), 10000);
      });
      
      const queryPromise = supabase
        .from('employees')
        .select('id, firstName, lastName')
        .limit(1);
      
      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;
      
      if (error) {
        console.error('❌ Supabase error:', error)
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        
        if (error.message.includes('Invalid API key')) {
          setErrorMessage('API Key ไม่ถูกต้อง - กรุณาตรวจสอบ API Key ใน Supabase Dashboard')
        } else {
          setErrorMessage(`${error.message} ${error.code ? `(${error.code})` : ''}`)
        }
        return false;
      }
      
      console.log('✅ Supabase connected successfully!')
      console.log('📊 Found', data?.length || 0, 'employee records')
      if (data && data.length > 0) {
        console.log('👤 Sample data:', data[0])
      }
      setErrorMessage('')
      return true;
    } catch (error: any) {
      console.error('❌ Connection failed:', error)
      if (error.message.includes('timeout')) {
        setErrorMessage('Connection timeout - กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต')
      } else {
        setErrorMessage(`Connection failed: ${error.message || 'Network error'}`)
      }
      return false;
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      setIsLoading(true);
      setErrorMessage('');
      
      try {
        const connected = await testConnection();
        setIsConnected(connected);
      } catch (error: any) {
        console.error('Connection test failed:', error);
        setIsConnected(false);
        if (error.message.includes('timeout')) {
          setErrorMessage('Connection timeout - กรุณาลองใหม่อีกครั้ง');
        } else {
          setErrorMessage(`Test failed: ${error.message || 'Unknown error'}`);
        }
      }
      
      setIsLoading(false);
    };

    // Add a small delay to prevent immediate execution
    const timer = setTimeout(checkConnection, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRetryConnection = async () => {
    setIsLoading(true);
    try {
      const connected = await testConnection();
      setIsConnected(connected);
    } catch (error: any) {
      console.error('Retry connection failed:', error);
      setIsConnected(false);
      setErrorMessage(`Retry failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    if (isLoading) return 'text-blue-500';
    return isConnected ? 'text-green-500' : 'text-red-500';
  };

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="w-4 h-4 animate-spin" />;
    return isConnected ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (isLoading) return 'กำลังตรวจสอบการเชื่อมต่อ...';
    return isConnected ? 'เชื่อมต่อฐานข้อมูลสำเร็จ' : 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between p-4 rounded-lg bg-[#e0e5ec]" 
           style={{
             boxShadow: 'inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff',
             background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
           }}>
        <div className="flex items-center space-x-3">
          <Database className="w-5 h-5 text-gray-600" />
          <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>
        
        {!isConnected && !isLoading && (
          <button
            onClick={handleRetryConnection}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            ลองใหม่
          </button>
        )}
      </div>
      
      {/* Connection Details */}
      <div className="p-3 rounded-lg bg-[#e0e5ec] text-xs text-gray-600"
           style={{
             boxShadow: 'inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff',
             background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
           }}>
        <div className="space-y-1">
          <div><strong>Supabase URL:</strong> https://zubrflyhzsmqngfbjkpg.supabase.co</div>
          <div><strong>Project ID:</strong> zubrflyhzsmqngfbjkpg</div>
          {errorMessage && (
            <div className="text-red-600 mt-2">
              <strong>Error:</strong> {errorMessage}
            </div>
          )}
        </div>
      </div>
      
      {/* Manual SQL Instructions */}
      {!isConnected && !isLoading && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-red-50 border-l-4 border-red-400">
            <h4 className="font-bold text-red-800 mb-2">⚠️ ไม่สามารถเชื่อมต่อ Supabase ได้</h4>
            <p className="text-sm text-red-700 mb-2">กรุณาตรวจสอบ:</p>
            <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
              <li>โปรเจกต์ Supabase ยังทำงานอยู่หรือไม่</li>
              <li>API Key ยังใช้งานได้หรือไม่</li>
              <li>ตารางถูกสร้างแล้วหรือยัง</li>
            </ul>
          </div>
          
          <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-400">
            <h4 className="font-bold text-blue-800 mb-2">🔧 วิธีสร้างตารางใน Supabase:</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>ไปที่ <a href="https://supabase.com/dashboard/project/zubrflyhzsmqngfbjkpg" target="_blank" rel="noopener noreferrer" className="underline font-medium">Supabase Dashboard</a></li>
              <li>คลิก "SQL Editor" ในเมนูซ้าย</li>
              <li>Copy โค้ด SQL จากไฟล์ <code className="bg-blue-100 px-1 rounded">supabase/migrations/create_all_tables.sql</code></li>
              <li>Paste และกด "Run" เพื่อสร้างตารางทั้งหมด</li>
              <li>กลับมาที่หน้านี้และกดปุ่ม "ลองใหม่"</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}