import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Settings, Shield, User, Plus, Trash2, Check, X, Users, Eye, Edit, Save, UserCog, Lock, Unlock } from "lucide-react";
import DefaultAvatarSVG from "@/components/default-avatar";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
  imageUrl: string | null;
}

interface UserPermission {
  id: number;
  userId: string;
  permission: string;
  granted: boolean;
  grantedBy: string | null;
  grantedAt: Date;
}

interface PermissionCategory {
  id: number;
  name: string;
  description: string | null;
  permissions: string[];
}

export default function UserPermissions() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    permissions: [] as string[]
  });
  const [newPermission, setNewPermission] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<PermissionCategory[]>({
    queryKey: ["/api/permission-categories"],
  });

  const { data: userPermissions = [], isLoading: permissionsLoading } = useQuery<UserPermission[]>({
    queryKey: ["/api/users", selectedUser?.id, "permissions"],
    enabled: !!selectedUser,
  });

  const createPermissionMutation = useMutation({
    mutationFn: async (data: { permission: string; granted: boolean }) => {
      await apiRequest("POST", `/api/users/${selectedUser?.id}/permissions`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", selectedUser?.id, "permissions"] });
      toast({ title: "สำเร็จ", description: "เพิ่มสิทธิ์เรียบร้อยแล้ว" });
    },
    onError: () => {
      toast({ title: "ผิดพลาด", description: "ไม่สามารถเพิ่มสิทธิ์ได้", variant: "destructive" });
    },
  });

  const updatePermissionMutation = useMutation({
    mutationFn: async (data: { id: number; granted: boolean }) => {
      await apiRequest("PUT", `/api/permissions/${data.id}`, { granted: data.granted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", selectedUser?.id, "permissions"] });
      toast({ title: "สำเร็จ", description: "อัพเดตสิทธิ์เรียบร้อยแล้ว" });
    },
    onError: () => {
      toast({ title: "ผิดพลาด", description: "ไม่สามารถอัพเดตสิทธิ์ได้", variant: "destructive" });
    },
  });

  const deletePermissionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/permissions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", selectedUser?.id, "permissions"] });
      toast({ title: "สำเร็จ", description: "ลบสิทธิ์เรียบร้อยแล้ว" });
    },
    onError: () => {
      toast({ title: "ผิดพลาด", description: "ไม่สามารถลบสิทธิ์ได้", variant: "destructive" });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: typeof newCategory) => {
      await apiRequest("POST", "/api/permission-categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/permission-categories"] });
      setNewCategory({ name: "", description: "", permissions: [] });
      setShowCategoryDialog(false);
      toast({ title: "สำเร็จ", description: "สร้างหมวดหมู่สิทธิ์เรียบร้อยแล้ว" });
    },
    onError: () => {
      toast({ title: "ผิดพลาด", description: "ไม่สามารถสร้างหมวดหมู่สิทธิ์ได้", variant: "destructive" });
    },
  });

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGrantPermission = (permission: string) => {
    const existingPermission = userPermissions.find(p => p.permission === permission);
    
    if (existingPermission) {
      updatePermissionMutation.mutate({
        id: existingPermission.id,
        granted: !existingPermission.granted
      });
    } else {
      createPermissionMutation.mutate({
        permission,
        granted: true
      });
    }
  };

  const handleAddCustomPermission = () => {
    if (newPermission.trim()) {
      createPermissionMutation.mutate({
        permission: newPermission.trim(),
        granted: true
      });
      setNewPermission("");
      setShowPermissionDialog(false);
    }
  };

  const hasPermission = (permission: string) => {
    const userPerm = userPermissions.find(p => p.permission === permission);
    return userPerm ? userPerm.granted : false;
  };

  if (usersLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#e0e5ec]">
        <div className="text-xl text-gray-800">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-[#e0e5ec]">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-[#e0e5ec] p-8 rounded-3xl relative overflow-hidden"
             style={{
               boxShadow: '25px 25px 50px #a3b1c6, -25px -25px 50px #ffffff',
               background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
             }}>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-white/10 pointer-events-none"></div>
          <div className="absolute top-8 right-8 w-4 h-4 bg-white/20 rounded-full"></div>
          <div className="absolute bottom-8 left-8 w-2 h-2 bg-white/30 rounded-full"></div>
          
          <div className="text-center relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 rounded-full bg-[#e0e5ec] transition-all duration-500 hover:scale-110 hover:rotate-12"
                   style={{
                     boxShadow: '12px 12px 24px #a3b1c6, -12px -12px 24px #ffffff, inset 2px 2px 4px #ffffff, inset -2px -2px 4px #a3b1c6',
                     background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                   }}>
                <Shield className="h-10 w-10 text-indigo-600" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 tracking-wide bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                การจัดการสิทธิ์ผู้ใช้
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              กำหนดและจัดการสิทธิ์การเข้าถึงระบบสำหรับแต่ละบุคคล
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* User List */}
          <div className="lg:col-span-1">
            <div className="bg-[#e0e5ec] rounded-3xl p-6 h-fit"
                 style={{
                   boxShadow: '20px 20px 40px #a3b1c6, -20px -20px 40px #ffffff',
                   background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                 }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full bg-[#e0e5ec]"
                     style={{
                       boxShadow: '8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff',
                       background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                     }}>
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">รายชื่อผู้ใช้</h3>
              </div>
              
              <div className="mb-4">
                <Input
                  placeholder="ค้นหาผู้ใช้..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
                />
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedUser?.id === user.id
                        ? 'shadow-[inset_8px_8px_16px_#a3b1c6,_inset_-8px_-8px_16px_#ffffff]'
                        : 'shadow-[8px_8px_16px_#a3b1c6,_-8px_-8px_16px_#ffffff] hover:shadow-[12px_12px_24px_#a3b1c6,_-12px_-12px_24px_#ffffff]'
                    }`}
                    style={{
                      background: selectedUser?.id === user.id 
                        ? 'linear-gradient(145deg, #dae1e7, #e6ebf0)' 
                        : 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                    }}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#e0e5ec] p-1 flex-shrink-0"
                           style={{
                             boxShadow: '4px 4px 8px #a3b1c6, -4px -4px 8px #ffffff',
                             background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                           }}>
                        <div className="w-full h-full rounded-full overflow-hidden bg-[#e0e5ec]"
                             style={{boxShadow: 'inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff'}}>
                          {user.imageUrl ? (
                            <img src={user.imageUrl} className="w-full h-full object-cover" alt={user.firstName} />
                          ) : (
                            <DefaultAvatarSVG />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {user.position}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.department}
                        </p>
                      </div>
                      {selectedUser?.id === user.id && (
                        <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Permissions Management */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <div className="bg-[#e0e5ec] rounded-3xl p-6"
                   style={{
                     boxShadow: '20px 20px 40px #a3b1c6, -20px -20px 40px #ffffff',
                     background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                   }}>
                
                <Tabs defaultValue="permissions" className="space-y-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-[#e0e5ec] p-2"
                           style={{
                             boxShadow: '8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff',
                             background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                           }}>
                        <div className="w-full h-full rounded-full overflow-hidden bg-[#e0e5ec]"
                             style={{boxShadow: 'inset 4px 4px 8px #a3b1c6, inset -4px -4px 8px #ffffff'}}>
                          {selectedUser.imageUrl ? (
                            <img src={selectedUser.imageUrl} className="w-full h-full object-cover" alt={selectedUser.firstName} />
                          ) : (
                            <DefaultAvatarSVG />
                          )}
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {selectedUser.firstName} {selectedUser.lastName}
                        </h2>
                        <p className="text-gray-600">{selectedUser.position}</p>
                        <p className="text-sm text-gray-500">{selectedUser.department}</p>
                      </div>
                    </div>
                    
                    <TabsList className="bg-[#e0e5ec] p-2 rounded-xl"
                             style={{
                               boxShadow: 'inset 6px 6px 12px #a3b1c6, inset -6px -6px 12px #ffffff',
                               background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
                             }}>
                      <TabsTrigger 
                        value="permissions" 
                        className="data-[state=active]:bg-[#e0e5ec] data-[state=active]:shadow-[6px_6px_12px_#a3b1c6,_-6px_-6px_12px_#ffffff] data-[state=active]:text-indigo-600"
                      >
                        สิทธิ์ปัจจุบัน
                      </TabsTrigger>
                      <TabsTrigger 
                        value="categories" 
                        className="data-[state=active]:bg-[#e0e5ec] data-[state=active]:shadow-[6px_6px_12px_#a3b1c6,_-6px_-6px_12px_#ffffff] data-[state=active]:text-indigo-600"
                      >
                        หมวดหมู่สิทธิ์
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="permissions">
                    <div className="space-y-6">
                      
                      {/* Add Permission Button */}
                      <div className="flex justify-end">
                        <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
                          <DialogTrigger asChild>
                            <button className="flex items-center bg-[#e0e5ec] text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:text-indigo-700 transition-all duration-300 hover:scale-105"
                                    style={{boxShadow: '8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff'}}>
                              <Plus className="h-5 w-5 mr-2" />
                              เพิ่มสิทธิ์
                            </button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#e0e5ec] border-none"
                                         style={{boxShadow: '20px 20px 40px #a3b1c6, -20px -20px 40px #ffffff'}}>
                            <DialogHeader>
                              <DialogTitle className="text-gray-800">เพิ่มสิทธิ์ใหม่</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="permission">ชื่อสิทธิ์</Label>
                                <Input
                                  id="permission"
                                  value={newPermission}
                                  onChange={(e) => setNewPermission(e.target.value)}
                                  placeholder="เช่น employee.create"
                                  className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
                                />
                              </div>
                              <div className="flex justify-end gap-3">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setShowPermissionDialog(false)}
                                  className="bg-[#e0e5ec] border-none shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff]"
                                >
                                  ยกเลิก
                                </Button>
                                <Button 
                                  onClick={handleAddCustomPermission}
                                  className="bg-indigo-600 hover:bg-indigo-700"
                                >
                                  เพิ่ม
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {permissionsLoading ? (
                        <div className="text-center py-12 text-gray-600">กำลังโหลด...</div>
                      ) : (
                        <div className="space-y-6">
                          {categories.map((category) => (
                            <div key={category.id} 
                                 className="bg-[#e0e5ec] p-6 rounded-2xl"
                                 style={{
                                   boxShadow: 'inset 8px 8px 16px #a3b1c6, inset -8px -8px 16px #ffffff',
                                   background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
                                 }}>
                              <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-[#e0e5ec]"
                                     style={{
                                       boxShadow: '4px 4px 8px #a3b1c6, -4px -4px 8px #ffffff',
                                       background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                                     }}>
                                  <UserCog className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>
                                  {category.description && (
                                    <p className="text-gray-600 text-sm">{category.description}</p>
                                  )}
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {category.permissions.map((permission) => {
                                  const hasThisPermission = hasPermission(permission);
                                  const userPerm = userPermissions.find(p => p.permission === permission);
                                  
                                  return (
                                    <div
                                      key={permission}
                                      className="flex items-center justify-between p-4 rounded-xl bg-[#e0e5ec]"
                                      style={{
                                        boxShadow: '6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff',
                                        background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                                      }}
                                    >
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          {hasThisPermission ? (
                                            <Unlock className="w-4 h-4 text-green-600" />
                                          ) : (
                                            <Lock className="w-4 h-4 text-red-600" />
                                          )}
                                          <p className="text-gray-800 font-medium text-sm">{permission}</p>
                                        </div>
                                        {userPerm && (
                                          <p className="text-xs text-gray-500">
                                            อัพเดตล่าสุด: {new Date(userPerm.grantedAt).toLocaleDateString('th-TH')}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="relative">
                                          <Switch
                                            checked={hasThisPermission}
                                            onCheckedChange={() => handleGrantPermission(permission)}
                                            className="data-[state=checked]:bg-green-500"
                                          />
                                        </div>
                                        {userPerm && (
                                          <button
                                            onClick={() => deletePermissionMutation.mutate(userPerm.id)}
                                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300"
                                            style={{
                                              boxShadow: '3px 3px 6px #a3b1c6, -3px -3px 6px #ffffff',
                                              background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                                            }}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                          
                          {/* Custom permissions not in categories */}
                          {userPermissions.filter(p => 
                            !categories.some(cat => cat.permissions.includes(p.permission))
                          ).length > 0 && (
                            <div className="bg-[#e0e5ec] p-6 rounded-2xl"
                                 style={{
                                   boxShadow: 'inset 8px 8px 16px #a3b1c6, inset -8px -8px 16px #ffffff',
                                   background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
                                 }}>
                              <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-[#e0e5ec]"
                                     style={{
                                       boxShadow: '4px 4px 8px #a3b1c6, -4px -4px 8px #ffffff',
                                       background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                                     }}>
                                  <Settings className="h-5 w-5 text-gray-600" />
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg">สิทธิ์อื่นๆ</h3>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {userPermissions
                                  .filter(p => !categories.some(cat => cat.permissions.includes(p.permission)))
                                  .map((userPerm) => (
                                    <div
                                      key={userPerm.id}
                                      className="flex items-center justify-between p-4 rounded-xl bg-[#e0e5ec]"
                                      style={{
                                        boxShadow: '6px 6px 12px #a3b1c6, -6px -6px 12px #ffffff',
                                        background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                                      }}
                                    >
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                          {userPerm.granted ? (
                                            <Unlock className="w-4 h-4 text-green-600" />
                                          ) : (
                                            <Lock className="w-4 h-4 text-red-600" />
                                          )}
                                          <p className="text-gray-800 font-medium text-sm">{userPerm.permission}</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                          อัพเดตล่าสุด: {new Date(userPerm.grantedAt).toLocaleDateString('th-TH')}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <Switch
                                          checked={userPerm.granted}
                                          onCheckedChange={() => updatePermissionMutation.mutate({
                                            id: userPerm.id,
                                            granted: !userPerm.granted
                                          })}
                                          className="data-[state=checked]:bg-green-500"
                                        />
                                        <button
                                          onClick={() => deletePermissionMutation.mutate(userPerm.id)}
                                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-300"
                                          style={{
                                            boxShadow: '3px 3px 6px #a3b1c6, -3px -3px 6px #ffffff',
                                            background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="categories">
                    <div className="space-y-6">
                      
                      {/* Add Category Button */}
                      <div className="flex justify-end">
                        <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                          <DialogTrigger asChild>
                            <button className="flex items-center bg-[#e0e5ec] text-purple-600 font-semibold px-6 py-3 rounded-xl hover:text-purple-700 transition-all duration-300 hover:scale-105"
                                    style={{boxShadow: '8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff'}}>
                              <Plus className="h-5 w-5 mr-2" />
                              เพิ่มหมวดหมู่
                            </button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#e0e5ec] border-none max-w-md"
                                         style={{boxShadow: '20px 20px 40px #a3b1c6, -20px -20px 40px #ffffff'}}>
                            <DialogHeader>
                              <DialogTitle className="text-gray-800">สร้างหมวดหมู่สิทธิ์ใหม่</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="categoryName">ชื่อหมวดหมู่</Label>
                                <Input
                                  id="categoryName"
                                  value={newCategory.name}
                                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                                  placeholder="เช่น การจัดการพนักงาน"
                                  className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
                                />
                              </div>
                              <div>
                                <Label htmlFor="categoryDescription">คำอธิบาย</Label>
                                <Textarea
                                  id="categoryDescription"
                                  value={newCategory.description}
                                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                                  placeholder="อธิบายหมวดหมู่สิทธิ์นี้"
                                  className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
                                />
                              </div>
                              <div>
                                <Label>สิทธิ์ในหมวดหมู่</Label>
                                <div className="flex gap-2 mt-2">
                                  <Input
                                    placeholder="เพิ่มสิทธิ์"
                                    className="bg-[#e0e5ec] border-none shadow-[inset_5px_5px_10px_#a3b1c6,_inset_-5px_-5px_10px_#ffffff]"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                                        setNewCategory(prev => ({
                                          ...prev,
                                          permissions: [...prev.permissions, e.currentTarget.value.trim()]
                                        }));
                                        e.currentTarget.value = '';
                                      }
                                    }}
                                  />
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {newCategory.permissions.map((perm, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2 px-3 py-1 bg-[#e0e5ec] rounded-lg cursor-pointer hover:bg-red-50 transition-colors"
                                      style={{boxShadow: '3px 3px 6px #a3b1c6, -3px -3px 6px #ffffff'}}
                                      onClick={() => setNewCategory(prev => ({
                                        ...prev,
                                        permissions: prev.permissions.filter((_, i) => i !== index)
                                      }))}
                                    >
                                      <span className="text-sm text-gray-700">{perm}</span>
                                      <X className="w-3 h-3 text-red-500" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-end gap-3">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setShowCategoryDialog(false)}
                                  className="bg-[#e0e5ec] border-none shadow-[5px_5px_10px_#a3b1c6,_-5px_-5px_10px_#ffffff]"
                                >
                                  ยกเลิก
                                </Button>
                                <Button 
                                  onClick={() => createCategoryMutation.mutate(newCategory)}
                                  className="bg-purple-600 hover:bg-purple-700"
                                >
                                  สร้าง
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="space-y-4">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className="p-6 rounded-2xl bg-[#e0e5ec] transition-all duration-300 hover:scale-[1.02]"
                            style={{
                              boxShadow: '12px 12px 24px #a3b1c6, -12px -12px 24px #ffffff',
                              background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="p-2 rounded-lg bg-[#e0e5ec]"
                                       style={{
                                         boxShadow: '4px 4px 8px #a3b1c6, -4px -4px 8px #ffffff',
                                         background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                                       }}>
                                    <Shield className="h-5 w-5 text-indigo-600" />
                                  </div>
                                  <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>
                                </div>
                                {category.description && (
                                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  {category.permissions.map((permission) => (
                                    <div
                                      key={permission}
                                      className="px-3 py-1 bg-[#e0e5ec] rounded-lg text-sm text-gray-700"
                                      style={{
                                        boxShadow: 'inset 3px 3px 6px #a3b1c6, inset -3px -3px 6px #ffffff',
                                        background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
                                      }}
                                    >
                                      {permission}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="bg-[#e0e5ec] rounded-3xl p-12"
                   style={{
                     boxShadow: '20px 20px 40px #a3b1c6, -20px -20px 40px #ffffff',
                     background: 'linear-gradient(145deg, #e6ebf0, #dae1e7)'
                   }}>
                <div className="text-center">
                  <div className="p-8 rounded-full bg-[#e0e5ec] w-32 h-32 mx-auto mb-6 flex items-center justify-center"
                       style={{
                         boxShadow: 'inset 12px 12px 24px #a3b1c6, inset -12px -12px 24px #ffffff',
                         background: 'linear-gradient(145deg, #dae1e7, #e6ebf0)'
                       }}>
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">เลือกผู้ใช้เพื่อจัดการสิทธิ์</h3>
                  <p className="text-gray-600">กรุณาเลือกผู้ใช้จากรายการทางซ้ายเพื่อเริ่มจัดการสิทธิ์</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}