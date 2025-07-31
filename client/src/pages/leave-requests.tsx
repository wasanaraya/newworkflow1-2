import { useState } from "react";
import { useEmployees } from "@/hooks/use-employees";
import { useLeaveRequests, useCreateLeaveRequest, useUpdateLeaveRequest, useDeleteLeaveRequest } from "@/hooks/use-leave-requests";
import { PlusCircle, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeaveRequestSchema } from "@/../../shared/schema";
import { useToast } from "@/hooks/use-toast";
import type { InsertLeaveRequest } from "@/../../shared/schema";

export default function LeaveRequestPage() {
  const { data: employees = [] } = useEmployees();
  const { data: leaveRequests = [] } = useLeaveRequests();
  const createLeaveRequest = useCreateLeaveRequest();
  const updateLeaveRequest = useUpdateLeaveRequest();
  const deleteLeaveRequest = useDeleteLeaveRequest();
  const { toast } = useToast();
  
  const [showLeaveRequestModal, setShowLeaveRequestModal] = useState(false);

  const form = useForm<InsertLeaveRequest>({
    resolver: zodResolver(insertLeaveRequestSchema),
    defaultValues: {
      employeeId: "",
      employeeName: "",
      startDate: "",
      endDate: "",
      reason: "",
      status: "รอดำเนินการ",
      requestDate: new Date().toISOString().split('T')[0]
    },
  });

  const getEmployeeName = (empId: string) => {
    const emp = employees.find(e => e.id === empId);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'ไม่พบชื่อ';
  };

  const formatDate = (dateString: string) => 
    new Date(dateString).toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });

  const statusStyles = { 
    'รอดำเนินการ': 'bg-yellow-100 text-yellow-800', 
    'อนุมัติ': 'bg-green-100 text-green-800', 
    'ไม่อนุมัติ': 'bg-red-100 text-red-800' 
  };

  const onSubmit = async (data: InsertLeaveRequest) => {
    try {
      const selectedEmployee = employees.find(e => e.id === data.employeeId);
      await createLeaveRequest.mutateAsync({
        ...data,
        employeeName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : ""
      });
      
      toast({
        title: "สำเร็จ",
        description: "ยื่นใบลาเรียบร้อยแล้ว",
      });
      
      setShowLeaveRequestModal(false);
      form.reset();
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถยื่นใบลาได้",
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateLeaveRequest.mutateAsync({
        id,
        data: { status, approvedBy: "ผู้จัดการ", approvedDate: new Date().toISOString().split('T')[0] }
      });
      
      toast({
        title: "สำเร็จ",
        description: `${status === 'อนุมัติ' ? 'อนุมัติ' : 'ไม่อนุมัติ'}คำขอลาเรียบร้อยแล้ว`,
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตสถานะได้",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-[#e0e5ec] p-6 rounded-xl space-y-6" style={{boxShadow: '10px 10px 20px #a3b1c6, -10px -10px 20px #ffffff'}}>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800">รายการคำขอลา</h3>
        
        <Dialog open={showLeaveRequestModal} onOpenChange={setShowLeaveRequestModal}>
          <DialogTrigger asChild>
            <button className="flex items-center bg-[#e0e5ec] text-indigo-600 font-semibold px-5 py-3 rounded-xl hover:text-indigo-700 transition-all duration-300 active:shadow-[inset_7px_7px_15px_#a3b1c6,_inset_-7px_-7px_15px_#ffffff]" style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}>
              <PlusCircle className="h-5 w-5 mr-2" /> ยื่นใบลา
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#e0e5ec] border-none" style={{boxShadow: '10px 10px 20px #a3b1c6, -10px -10px 20px #ffffff'}}>
            <DialogHeader>
              <DialogTitle className="text-gray-800">ยื่นใบลา</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>พนักงาน</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]">
                            <SelectValue placeholder="เลือกพนักงาน" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.firstName} {employee.lastName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>วันที่เริ่มลา</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>วันที่สิ้นสุด</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เหตุผล</FormLabel>
                      <FormControl>
                        <Textarea
                          className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
                          placeholder="ระบุเหตุผลการลา"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowLeaveRequestModal(false)}
                    className="bg-[#e0e5ec] border-none shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff]"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="submit"
                    disabled={createLeaveRequest.isPending}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {createLeaveRequest.isPending ? "กำลังบันทึก..." : "บันทึก"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-[#d1d9e6]">
            <tr>
              <th scope="col" className="px-6 py-3">พนักงาน</th>
              <th scope="col" className="px-6 py-3">ประเภทการลา</th>
              <th scope="col" className="px-6 py-3">วันที่</th>
              <th scope="col" className="px-6 py-3">เหตุผล</th>
              <th scope="col" className="px-6 py-3">สถานะ</th>
              <th scope="col" className="px-6 py-3 text-center">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-10 bg-[#e0e5ec]">
                  ไม่มีคำขอลาในขณะนี้
                </td>
              </tr>
            )}
            {leaveRequests.map(req => (
              <tr key={req.id} className="bg-[#e0e5ec] border-b border-[#d1d9e6]">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {getEmployeeName(req.employeeId)}
                </td>
                <td className="px-6 py-4">ลาพักผ่อน</td>
                <td className="px-6 py-4">
                  {formatDate(req.startDate)} - {formatDate(req.endDate)}
                </td>
                <td className="px-6 py-4 max-w-xs truncate">{req.reason}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 font-semibold leading-tight rounded-full text-xs ${statusStyles[req.status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {req.status === 'รอดำเนินการ' && (
                    <div className="flex justify-center space-x-2">
                      <button 
                        onClick={() => handleUpdateStatus(req.id, 'อนุมัติ')} 
                        className="p-2 rounded-full text-green-500 hover:bg-green-100"
                        disabled={updateLeaveRequest.isPending}
                      >
                        <CheckCircle size={18}/>
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(req.id, 'ไม่อนุมัติ')} 
                        className="p-2 rounded-full text-red-500 hover:bg-red-100"
                        disabled={updateLeaveRequest.isPending}
                      >
                        <XCircle size={18}/>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}