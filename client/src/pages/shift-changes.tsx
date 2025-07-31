import { useState } from "react";
import { useEmployees } from "@/hooks/use-employees";
import { useShiftChangeRequests, useCreateShiftChangeRequest, useUpdateShiftChangeRequest, useDeleteShiftChangeRequest } from "@/hooks/use-shift-changes";
import { Repeat, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertShiftChangeRequestSchema } from "@/../../shared/schema";
import { useToast } from "@/hooks/use-toast";
import type { InsertShiftChangeRequest } from "@/../../shared/schema";

export default function ShiftChanges() {
  const { data: employees = [] } = useEmployees();
  const { data: requests = [] } = useShiftChangeRequests();
  const createShiftChangeRequest = useCreateShiftChangeRequest();
  const updateShiftChangeRequest = useUpdateShiftChangeRequest();
  const deleteShiftChangeRequest = useDeleteShiftChangeRequest();
  const { toast } = useToast();
  
  const [showShiftChangeModal, setShowShiftChangeModal] = useState(false);

  const form = useForm<InsertShiftChangeRequest>({
    resolver: zodResolver(insertShiftChangeRequestSchema),
    defaultValues: {
      employeeId: "",
      employeeName: "",
      reason: "",
      currentShift: "",
      requestedShift: "",
      changeDate: "",
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

  const handleShiftChangeSubmit = async (shiftChangeData: InsertShiftChangeRequest) => {
    try {
      const selectedEmployee = employees.find(e => e.id === shiftChangeData.employeeId);
      await createShiftChangeRequest.mutateAsync({
        ...shiftChangeData,
        employeeName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : ""
      });
      
      toast({
        title: "สำเร็จ",
        description: "ยื่นขอเปลี่ยนเวรเรียบร้อยแล้ว",
      });
      
      setShowShiftChangeModal(false);
      form.reset();
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถยื่นขอเปลี่ยนเวรได้",
        variant: "destructive",
      });
    }
  };

  const handleAction = async (request: any, action: 'approve' | 'reject' | 'delete') => {
    try {
      if (action === 'delete') {
        await deleteShiftChangeRequest.mutateAsync(request.id);
        toast({
          title: "สำเร็จ",
          description: "ลบคำขอเปลี่ยนเวรเรียบร้อยแล้ว",
        });
      } else {
        const status = action === 'approve' ? 'อนุมัติ' : 'ไม่อนุมัติ';
        await updateShiftChangeRequest.mutateAsync({
          id: request.id,
          shiftChangeRequest: { 
            status, 
            approvedBy: "ผู้จัดการ", 
            approvedDate: new Date().toISOString().split('T')[0] 
          }
        });
        toast({
          title: "สำเร็จ",
          description: `${status}คำขอเปลี่ยนเวรเรียบร้อยแล้ว`,
        });
      }
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดำเนินการได้",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-[#e0e5ec] p-6 rounded-xl space-y-6" style={{boxShadow: '10px 10px 20px #a3b1c6, -10px -10px 20px #ffffff'}}>
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-gray-800">รายการคำขอเปลี่ยนเวร</h3>
        
        <Dialog open={showShiftChangeModal} onOpenChange={setShowShiftChangeModal}>
          <DialogTrigger asChild>
            <button className="flex items-center bg-[#e0e5ec] text-indigo-600 font-semibold px-5 py-3 rounded-xl hover:text-indigo-700 transition-all duration-300 active:shadow-[inset_7px_7px_15px_#a3b1c6,_inset_-7px_-7px_15px_#ffffff]" style={{boxShadow: '7px 7px 15px #a3b1c6, -7px -7px 15px #ffffff'}}>
              <Repeat className="h-5 w-5 mr-2" /> ยื่นขอเปลี่ยนเวร
            </button>
          </DialogTrigger>
          <DialogContent className="bg-[#e0e5ec] border-none" style={{boxShadow: '10px 10px 20px #a3b1c6, -10px -10px 20px #ffffff'}}>
            <DialogHeader>
              <DialogTitle className="text-gray-800">ยื่นขอเปลี่ยนเวร</DialogTitle>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleShiftChangeSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ผู้ขอเปลี่ยน</FormLabel>
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
                    name="currentShift"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>เวรปัจจุบัน</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]">
                              <SelectValue placeholder="เลือกเวรปัจจุบัน" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="เช้า">เช้า (08:00-16:00)</SelectItem>
                            <SelectItem value="บ่าย">บ่าย (16:00-00:00)</SelectItem>
                            <SelectItem value="ดึก">ดึก (00:00-08:00)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="requestedShift"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>เวรที่ต้องการ</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]">
                              <SelectValue placeholder="เลือกเวรที่ต้องการ" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="เช้า">เช้า (08:00-16:00)</SelectItem>
                            <SelectItem value="บ่าย">บ่าย (16:00-00:00)</SelectItem>
                            <SelectItem value="ดึก">ดึก (00:00-08:00)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="changeDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>วันที่เปลี่ยน</FormLabel>
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
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เหตุผล</FormLabel>
                      <FormControl>
                        <Textarea
                          className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
                          placeholder="ระบุเหตุผลการขอเปลี่ยนเวร"
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
                    onClick={() => setShowShiftChangeModal(false)}
                    className="bg-[#e0e5ec] border-none shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff]"
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    type="submit"
                    disabled={createShiftChangeRequest.isPending}
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    {createShiftChangeRequest.isPending ? "กำลังบันทึก..." : "บันทึก"}
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
              <th scope="col" className="px-6 py-3">ผู้ขอเปลี่ยน</th>
              <th scope="col" className="px-6 py-3">เวรปัจจุบัน</th>
              <th scope="col" className="px-6 py-3">เวรที่ต้องการ</th>
              <th scope="col" className="px-6 py-3">วันที่เปลี่ยน</th>
              <th scope="col" className="px-6 py-3">เหตุผล</th>
              <th scope="col" className="px-6 py-3">สถานะ</th>
              <th scope="col" className="px-6 py-3 text-center">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-10 bg-[#e0e5ec]">
                  ไม่มีคำขอเปลี่ยนเวรในขณะนี้
                </td>
              </tr>
            )}
            {requests.map(req => (
              <tr key={req.id} className="bg-[#e0e5ec] border-b border-[#d1d9e6]">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {getEmployeeName(req.employeeId)}
                </td>
                <td className="px-6 py-4">{req.currentShift}</td>
                <td className="px-6 py-4">{req.requestedShift}</td>
                <td className="px-6 py-4">{formatDate(req.changeDate)}</td>
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
                        onClick={() => handleAction(req, 'approve')} 
                        className="p-2 rounded-full text-green-500 hover:bg-green-100"
                        title="อนุมัติ"
                        disabled={updateShiftChangeRequest.isPending}
                      >
                        <CheckCircle size={18}/>
                      </button>
                      <button 
                        onClick={() => handleAction(req, 'reject')} 
                        className="p-2 rounded-full text-red-500 hover:bg-red-100"
                        title="ไม่อนุมัติ"
                        disabled={updateShiftChangeRequest.isPending}
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