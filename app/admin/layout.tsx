"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAdminAuth } from "@/hooks/use-admin-auth"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthenticated = useAdminAuth((state) => state.isAuthenticated)
  const isLoginRoute = pathname?.startsWith("/admin/login")

  useEffect(() => {
    if (!isAuthenticated && !isLoginRoute) {
      router.push("/admin/login")
    }
  }, [isAuthenticated, isLoginRoute, router])

  if (!isAuthenticated && !isLoginRoute) {
    return null
  }

  return isAuthenticated ? (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  ) : (
    <div className="min-h-screen bg-background">{children}</div>
  )
}
