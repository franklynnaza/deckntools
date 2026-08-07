import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AdminOrder {
  id: string
  customer: string
  email: string
  amount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: Array<{ name: string; quantity: number; price: number }>
  date: string
  address: string
  city: string
  postcode: string
}

interface AdminOrderStore {
  orders: AdminOrder[]
  updateOrderStatus: (id: string, status: AdminOrder["status"]) => void
  getOrder: (id: string) => AdminOrder | undefined
}

export const useAdminOrders = create<AdminOrderStore>()(
  persist(
    (set, get) => ({
      orders: [
        {
          id: "ORD-001",
          customer: "John Smith",
          email: "john@example.com",
          amount: 450,
          status: "delivered",
          items: [
            { name: "Composite Decking Boards", quantity: 10, price: 45.99 },
            { name: "Stainless Steel Fasteners", quantity: 5, price: 12.99 },
          ],
          date: "2025-10-24",
          address: "123 Main St",
          city: "London",
          postcode: "SW1A 1AA",
        },
        {
          id: "ORD-002",
          customer: "Sarah Johnson",
          email: "sarah@example.com",
          amount: 320,
          status: "processing",
          items: [{ name: "Wooden Joists & Beams", quantity: 4, price: 89.99 }],
          date: "2025-10-23",
          address: "456 Oak Ave",
          city: "Manchester",
          postcode: "M1 1AA",
        },
        {
          id: "ORD-003",
          customer: "Mike Davis",
          email: "mike@example.com",
          amount: 680,
          status: "shipped",
          items: [
            { name: "Composite Decking Boards", quantity: 15, price: 45.99 },
            { name: "Wooden Joists & Beams", quantity: 2, price: 89.99 },
          ],
          date: "2025-10-22",
          address: "789 Pine Rd",
          city: "Birmingham",
          postcode: "B1 1AA",
        },
      ],
      updateOrderStatus: (id, status) =>
        set((state) => ({
          orders: state.orders.map((order) => (order.id === id ? { ...order, status } : order)),
        })),
      getOrder: (id) => {
        const state = get()
        return state.orders.find((order) => order.id === id)
      },
    }),
    {
      name: "admin-orders-storage",
    },
  ),
)
