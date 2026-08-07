import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AdminCustomer {
  id: number
  name: string
  email: string
  phone: string
  city: string
  postcode: string
  totalOrders: number
  totalSpent: number
  joinDate: string
  lastOrder: string
  status: "active" | "inactive"
}

interface AdminCustomerStore {
  customers: AdminCustomer[]
  getCustomer: (id: number) => AdminCustomer | undefined
}

export const useAdminCustomers = create<AdminCustomerStore>()(
  persist(
    (set, get) => ({
      customers: [
        {
          id: 1,
          name: "John Smith",
          email: "john@example.com",
          phone: "+44 20 7946 0958",
          city: "London",
          postcode: "SW1A 1AA",
          totalOrders: 5,
          totalSpent: 2450,
          joinDate: "2024-01-15",
          lastOrder: "2025-10-24",
          status: "active",
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah@example.com",
          phone: "+44 161 496 0000",
          city: "Manchester",
          postcode: "M1 1AA",
          totalOrders: 3,
          totalSpent: 1280,
          joinDate: "2024-03-22",
          lastOrder: "2025-10-23",
          status: "active",
        },
        {
          id: 3,
          name: "Mike Davis",
          email: "mike@example.com",
          phone: "+44 121 236 3000",
          city: "Birmingham",
          postcode: "B1 1AA",
          totalOrders: 8,
          totalSpent: 4560,
          joinDate: "2023-11-10",
          lastOrder: "2025-10-22",
          status: "active",
        },
        {
          id: 4,
          name: "Emma Wilson",
          email: "emma@example.com",
          phone: "+44 113 242 8283",
          city: "Leeds",
          postcode: "LS1 1AA",
          totalOrders: 2,
          totalSpent: 890,
          joinDate: "2024-06-05",
          lastOrder: "2025-09-15",
          status: "inactive",
        },
        {
          id: 5,
          name: "David Brown",
          email: "david@example.com",
          phone: "+44 117 922 3000",
          city: "Bristol",
          postcode: "BS1 1AA",
          totalOrders: 6,
          totalSpent: 3120,
          joinDate: "2024-02-14",
          lastOrder: "2025-10-20",
          status: "active",
        },
      ],
      getCustomer: (id) => {
        const state = get()
        return state.customers.find((c) => c.id === id)
      },
    }),
    {
      name: "admin-customers-storage",
    },
  ),
)
