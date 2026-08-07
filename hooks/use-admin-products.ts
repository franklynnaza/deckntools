import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface AdminProduct {
  _id: string
  name: string
  category: string
  price: number
  stock: number
  images: string[]
  description: string
}

interface AdminProductStore {
  products: AdminProduct[]
  isLoading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  addProduct: (product: Omit<AdminProduct, "_id">) => Promise<void>
  updateProduct: (id: string, product: Partial<AdminProduct>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  getProduct: (id: string) => AdminProduct | undefined
}

export const useAdminProducts = create<AdminProductStore>()(
  persist(
    (set, get) => ({
      products: [],
      isLoading: false,
      error: null,
      
      fetchProducts: async () => {
        try {
          set({ isLoading: true, error: null })
          const response = await fetch('/api/admin/products')
          
          if (!response.ok) {
            throw new Error('Failed to fetch products')
          }
          
          const data = await response.json()
          set({ products: data, isLoading: false })
        } catch (error) {
          console.error('Error fetching products:', error)
          set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false })
        }
      },
      
      addProduct: async (product) => {
        try {
          set({ isLoading: true, error: null })
          const response = await fetch('/api/admin/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
          })
          
          if (!response.ok) {
            throw new Error('Failed to add product')
          }
          
          const newProduct = await response.json()
          set((state) => ({ 
            products: [...state.products, newProduct],
            isLoading: false 
          }))
        } catch (error) {
          console.error('Error adding product:', error)
          set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false })
        }
      },
      
      updateProduct: async (id, updates) => {
        try {
          set({ isLoading: true, error: null })
          const response = await fetch(`/api/admin/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
          })
          
          if (!response.ok) {
            throw new Error('Failed to update product')
          }
          
          const updatedProduct = await response.json()
          set((state) => ({
            products: state.products.map((p) => (p._id === id ? updatedProduct : p)),
            isLoading: false
          }))
        } catch (error) {
          console.error('Error updating product:', error)
          set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false })
        }
      },
      
      deleteProduct: async (id) => {
        try {
          set({ isLoading: true, error: null })
          const response = await fetch(`/api/admin/products/${id}`, {
            method: 'DELETE'
          })
          
          if (!response.ok) {
            throw new Error('Failed to delete product')
          }
          
          set((state) => ({
            products: state.products.filter((p) => p._id !== id),
            isLoading: false
          }))
        } catch (error) {
          console.error('Error deleting product:', error)
          set({ error: error instanceof Error ? error.message : 'An error occurred', isLoading: false })
        }
      },
      
      getProduct: (id) => {
        const state = get()
        return state.products.find((p) => p._id === id)
      },
    }),
    {
      name: "admin-products-storage",
    },
  ),
)
