import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zubrflyhzsmqngfbjkpg.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1YnJmbHloenNtcW5nZmJqa3BnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MjA4NjAsImV4cCI6MjA2ODQ5Njg2MH0.SIDLeNDWphs1LxPLO5Mg37oCUB_8eAvfRIz5lCfle8g'

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

console.log('🔗 Supabase Client - URL:', supabaseUrl)
console.log('🔑 Supabase Client - Key available:', !!supabaseAnonKey)

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'User-Agent': 'Employee-Management-System/1.0',
      'X-Client-Info': 'supabase-js-web'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})


export type Database = {
  public: {
    Tables: {
      employees: {
        Row: {
          id: string
          firstName: string
          lastName: string
          email: string
          phone: string
          position: string
          department: string
          imageUrl: string | null
          phoneBrand: string | null
          phoneModel: string | null
          carBrand: string | null
          carPlate: string | null
          carColor: string | null
          startDate: string
          files: any[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          firstName: string
          lastName: string
          email: string
          phone: string
          position: string
          department: string
          imageUrl?: string | null
          phoneBrand?: string | null
          phoneModel?: string | null
          carBrand?: string | null
          carPlate?: string | null
          carColor?: string | null
          startDate: string
          files?: any[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          firstName?: string
          lastName?: string
          email?: string
          phone?: string
          position?: string
          department?: string
          imageUrl?: string | null
          phoneBrand?: string | null
          phoneModel?: string | null
          carBrand?: string | null
          carPlate?: string | null
          carColor?: string | null
          startDate?: string
          files?: any[] | null
          created_at?: string
          updated_at?: string
        }
      }
      departments: {
        Row: {
          id: number
          name: string
          maxCapacity: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          maxCapacity?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          maxCapacity?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      positions: {
        Row: {
          id: number
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      leaveRequests: {
        Row: {
          id: string
          employeeId: string
          employeeName: string
          startDate: string
          endDate: string
          reason: string
          status: string
          requestDate: string
          approvedBy: string | null
          approvedDate: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employeeId: string
          employeeName: string
          startDate: string
          endDate: string
          reason: string
          status?: string
          requestDate?: string
          approvedBy?: string | null
          approvedDate?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employeeId?: string
          employeeName?: string
          startDate?: string
          endDate?: string
          reason?: string
          status?: string
          requestDate?: string
          approvedBy?: string | null
          approvedDate?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      shiftChangeRequests: {
        Row: {
          id: string
          employeeId: string
          employeeName: string
          currentShift: string
          requestedShift: string
          changeDate: string
          reason: string
          status: string
          requestDate: string
          approvedBy: string | null
          approvedDate: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employeeId: string
          employeeName: string
          currentShift: string
          requestedShift: string
          changeDate: string
          reason: string
          status?: string
          requestDate?: string
          approvedBy?: string | null
          approvedDate?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employeeId?: string
          employeeName?: string
          currentShift?: string
          requestedShift?: string
          changeDate?: string
          reason?: string
          status?: string
          requestDate?: string
          approvedBy?: string | null
          approvedDate?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      holidaySchedules: {
        Row: {
          id: string
          name: string
          date: string
          type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          date: string
          type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          date?: string
          type?: string
          created_at?: string
          updated_at?: string
        }
      }
      annualLeaveEntitlements: {
        Row: {
          id: string
          employeeId: string
          year: string
          entitlement: number
          used: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          employeeId: string
          year: string
          entitlement: number
          used?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          employeeId?: string
          year?: string
          entitlement?: number
          used?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      userPermissions: {
        Row: {
          id: number
          userId: string
          permission: string
          granted: boolean | null
          grantedBy: string | null
          grantedAt: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          userId: string
          permission: string
          granted?: boolean | null
          grantedBy?: string | null
          grantedAt?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          userId?: string
          permission?: string
          granted?: boolean | null
          grantedBy?: string | null
          grantedAt?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      permissionCategories: {
        Row: {
          id: number
          name: string
          description: string | null
          permissions: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          permissions: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          permissions?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}