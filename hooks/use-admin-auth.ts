import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AdminAuthStore {
  isAuthenticated: boolean
  adminEmail: string | null
  token: string | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAdminAuth = create<AdminAuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      adminEmail: null,
      token: null,
      isLoading: false,
      error: null,
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            set({ isLoading: false, error: data.message || 'Login failed' });
            return false;
          }
          
          set({ 
            isAuthenticated: true, 
            adminEmail: data.admin.email,
            token: data.token,
            isLoading: false,
            error: null
          });
          
          return true;
        } catch (error) {
          set({ 
            isLoading: false, 
            error: 'An error occurred during login' 
          });
          return false;
        }
      },
      logout: () => set({ 
        isAuthenticated: false, 
        adminEmail: null,
        token: null,
        error: null
      }),
    }),
    {
      name: "admin-auth-storage",
    },
  ),
)
