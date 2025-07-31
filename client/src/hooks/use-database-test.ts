import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function useDatabaseTest() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const testConnection = async () => {
    setIsLoading(true);
    try {
      // Test basic connection
      const { data: connectionTest, error: connectionError } = await supabase
        .from('employees')
        .select('count(*)')
        .limit(1);

      if (connectionError) {
        throw connectionError;
      }

      // Test data retrieval
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('id, firstName, lastName')
        .limit(5);

      if (employeesError) {
        throw employeesError;
      }

      toast({
        title: "✅ การเชื่อมต่อสำเร็จ",
        description: `พบข้อมูลพนักงาน ${employees?.length || 0} คน`,
      });

      return { success: true, data: employees };
    } catch (error: any) {
      console.error('Database test failed:', error);
      toast({
        title: "❌ การเชื่อมต่อล้มเหลว",
        description: error.message || "ไม่สามารถเชื่อมต่อฐานข้อมูลได้",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const testCRUD = async () => {
    setIsLoading(true);
    try {
      // Test Create
      const testEmployee = {
        firstName: 'ทดสอบ',
        lastName: 'การเชื่อมต่อ',
        email: 'test@example.com',
        phone: '0800000000',
        position: 'พนักงานทดสอบ',
        department: 'แผนกทดสอบ',
        startDate: new Date().toISOString().split('T')[0]
      };

      const { data: created, error: createError } = await supabase
        .from('employees')
        .insert(testEmployee)
        .select()
        .single();

      if (createError) throw createError;

      // Test Update
      const { data: updated, error: updateError } = await supabase
        .from('employees')
        .update({ firstName: 'ทดสอบอัปเดต' })
        .eq('id', created.id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Test Delete
      const { error: deleteError } = await supabase
        .from('employees')
        .delete()
        .eq('id', created.id);

      if (deleteError) throw deleteError;

      toast({
        title: "✅ ทดสอบ CRUD สำเร็จ",
        description: "สามารถสร้าง อ่าน อัปเดต และลบข้อมูลได้",
      });

      return { success: true };
    } catch (error: any) {
      console.error('CRUD test failed:', error);
      toast({
        title: "❌ ทดสอบ CRUD ล้มเหลว",
        description: error.message || "ไม่สามารถดำเนินการกับข้อมูลได้",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    testConnection,
    testCRUD,
    isLoading
  };
}