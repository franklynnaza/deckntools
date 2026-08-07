"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"
const COLORS = ["#4B3B2A", "#2F5233", "#E67E22", "#8E44AD", "#16A085", "#C0392B", "#2980B9"]

export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to fetch orders')
        const data = await res.json()
        setOrders(Array.isArray(data) ? data : [])
      } catch (e: any) {
        setError(e.message || 'Error fetching orders')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + Number(o.amount || 0), 0), [orders])
  const totalOrders = orders.length
  const totalCustomers = useMemo(() => new Set(orders.map((o) => o.email)).size, [orders])

  // Current vs previous month revenue change
  const now = new Date()
  const currMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  const inMonth = (d: Date, start: Date, end: Date) => d >= start && d <= end
  const revenueCurrentMonth = orders.reduce((sum, o) => {
    const d = new Date(o.createdAt)
    return inMonth(d, currMonthStart, now) ? sum + Number(o.amount || 0) : sum
  }, 0)
  const revenuePreviousMonth = orders.reduce((sum, o) => {
    const d = new Date(o.createdAt)
    return inMonth(d, prevMonthStart, prevMonthEnd) ? sum + Number(o.amount || 0) : sum
  }, 0)
  const pctChange = (current: number, prev: number) => {
    if (prev === 0) return current > 0 ? 100 : 0
    return ((current - prev) / prev) * 100
  }
  const revenueChange = pctChange(revenueCurrentMonth, revenuePreviousMonth)

  const metrics = [
    { title: "Total Revenue", value: `£${totalRevenue.toFixed(2)}`, change: `${revenueChange.toFixed(1)}%`, icon: DollarSign, color: "bg-secondary" },
    { title: "Total Orders", value: String(totalOrders), change: "", icon: ShoppingCart, color: "bg-accent" },
    { title: "Total Customers", value: String(totalCustomers), change: "", icon: Users, color: "bg-primary" },
    { title: "Growth Rate", value: `${revenueChange.toFixed(1)}%`, change: "", icon: TrendingUp, color: "bg-secondary" },
  ]

  // Last 6 months revenue and orders
  const revenueData = useMemo(() => {
    const arr: { month: string; revenue: number; orders: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthStart = new Date(d.getFullYear(), d.getMonth(), 1)
      const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0)
      let revenue = 0
      let ordersCount = 0
      for (const o of orders) {
        const od = new Date(o.createdAt)
        if (od >= monthStart && od <= monthEnd) {
          revenue += Number(o.amount || 0)
          ordersCount += 1
        }
      }
      const monthLabel = d.toLocaleString(undefined, { month: 'short' })
      arr.push({ month: monthLabel, revenue, orders: ordersCount })
    }
    return arr
  }, [orders])

  // Product revenue share (top 6)
  const categoryData = useMemo(() => {
    const revenueByProduct: Record<string, number> = {}
    for (const o of orders) {
      for (const it of o.items || []) {
        const name = String(it.name || 'Unknown')
        const rev = Number(it.price || 0) * Number(it.quantity || 0)
        revenueByProduct[name] = (revenueByProduct[name] || 0) + rev
      }
    }
    const entries = Object.entries(revenueByProduct).sort((a, b) => b[1] - a[1]).slice(0, 6)
    const total = entries.reduce((sum, [, v]) => sum + v, 0)
    return entries.map(([name, v], idx) => ({ name, value: total > 0 ? Math.round((v / total) * 100) : 0, fill: COLORS[idx % COLORS.length] }))
  }, [orders])

  const recentOrders = useMemo(() => {
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4).map((o: any) => ({
      id: o.orderId,
      customer: `${o.firstName} ${o.lastName}`.trim(),
      amount: `£${Number(o.amount || 0).toFixed(2)}`,
      status: o.status || 'processing',
      date: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '',
    }))
  }, [orders])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
      </div>

      {loading && (
        <Card><CardContent className="pt-6"><p className="text-muted-foreground">Loading dashboard…</p></CardContent></Card>
      )}
      {error && (
        <Card><CardContent className="pt-6"><p className="text-destructive">{error}</p></CardContent></Card>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.title}</p>
                    <p className="text-2xl font-bold mt-2">{metric.value}</p>
                    {metric.change && (
                      <p className="text-xs text-green-600 mt-1">{metric.change} from last month</p>
                    )}
                  </div>
                  <div className={`${metric.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue & Orders</CardTitle>
            <CardDescription>Monthly revenue and order count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#2F5233" name="Revenue (£)" />
                <Bar dataKey="orders" fill="#E67E22" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
            <CardDescription>Product category breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">{order.id}</p>
                  <p className="text-sm text-muted-foreground">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.amount}</p>
                  <p
                    className={`text-xs font-medium ${
                      order.status === "delivered"
                        ? "text-green-600"
                        : order.status === "processing"
                          ? "text-blue-600"
                          : order.status === "shipped"
                            ? "text-purple-600"
                            : order.status === "pending"
                              ? "text-yellow-600"
                              : "text-red-600"
                    }`}
                  >
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
