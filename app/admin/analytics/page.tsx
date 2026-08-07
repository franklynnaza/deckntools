"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, ShoppingCart } from "lucide-react"
export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7days")
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
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
    loadOrders()
  }, [])

  const rangeDays = useMemo(() => {
    switch (timeRange) {
      case '7days': return 7
      case '30days': return 30
      case '90days': return 90
      case '1year': return 365
      default: return 7
    }
  }, [timeRange])

  const now = new Date()
  const startOfRange = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  startOfRange.setDate(startOfRange.getDate() - (rangeDays - 1))

  const inRange = (dateStr: string | Date | undefined) => {
    if (!dateStr) return false
    const d = new Date(dateStr)
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    return day >= startOfRange && day <= now
  }

  const ordersInRange = useMemo(() => orders.filter(o => inRange(o.createdAt)), [orders, rangeDays])

  const previousStart = new Date(startOfRange)
  previousStart.setDate(previousStart.getDate() - rangeDays)
  const previousEnd = new Date(startOfRange)
  previousEnd.setDate(previousEnd.getDate() - 1)

  const inPrevRange = (dateStr: string | Date | undefined) => {
    if (!dateStr) return false
    const d = new Date(dateStr)
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    return day >= previousStart && day <= previousEnd
  }

  const ordersPrevRange = useMemo(() => orders.filter(o => inPrevRange(o.createdAt)), [orders, rangeDays])

  const totalRevenue = useMemo(() => ordersInRange.reduce((sum, o) => sum + Number(o.amount || 0), 0), [ordersInRange])
  const totalOrders = ordersInRange.length
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
  const uniqueCustomers = useMemo(() => new Set(ordersInRange.map(o => o.email)).size, [ordersInRange])

  const prevRevenue = useMemo(() => ordersPrevRange.reduce((sum, o) => sum + Number(o.amount || 0), 0), [ordersPrevRange])
  const prevOrders = ordersPrevRange.length
  const prevAOV = prevOrders > 0 ? prevRevenue / prevOrders : 0

  const pctChange = (current: number, prev: number) => {
    if (prev === 0) return current > 0 ? 100 : 0
    return ((current - prev) / prev) * 100
  }

  const metrics = [
    {
      title: "Total Revenue",
      value: `£${totalRevenue.toFixed(2)}`,
      change: `${pctChange(totalRevenue, prevRevenue).toFixed(1)}%`,
      trend: totalRevenue >= prevRevenue ? "up" : "down",
      icon: TrendingUp,
    },
    {
      title: "Total Orders",
      value: String(totalOrders),
      change: `${pctChange(totalOrders, prevOrders).toFixed(1)}%`,
      trend: totalOrders >= prevOrders ? "up" : "down",
      icon: ShoppingCart,
    },
    {
      title: "New Customers",
      value: String(uniqueCustomers),
      change: "",
      trend: "up",
      icon: TrendingUp,
    },
    {
      title: "Avg. Order Value",
      value: `£${avgOrderValue.toFixed(2)}`,
      change: `${pctChange(avgOrderValue, prevAOV).toFixed(1)}%`,
      trend: avgOrderValue >= prevAOV ? "up" : "down",
      icon: TrendingDown,
    },
  ]

  const dailyRevenueData = useMemo(() => {
    const map: Record<string, { date: string, revenue: number, orders: number, customers: number }> = {}
    for (let i = 0; i < rangeDays; i++) {
      const d = new Date(startOfRange)
      d.setDate(startOfRange.getDate() + i)
      const key = d.toISOString().slice(0,10)
      map[key] = { date: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), revenue: 0, orders: 0, customers: 0 }
    }
    const customersByDay: Record<string, Set<string>> = {}
    ordersInRange.forEach(o => {
      const d = new Date(o.createdAt)
      const key = d.toISOString().slice(0,10)
      if (!map[key]) return
      map[key].revenue += Number(o.amount || 0)
      map[key].orders += 1
      customersByDay[key] = customersByDay[key] || new Set<string>()
      customersByDay[key].add(String(o.email || ''))
    })
    Object.keys(map).forEach(k => {
      map[k].customers = customersByDay[k]?.size || 0
    })
    return Object.keys(map).sort().map(k => map[k])
  }, [ordersInRange, rangeDays])

  const productPerformanceData = useMemo(() => {
    const perf: Record<string, { name: string, sales: number, revenue: number }> = {}
    ordersInRange.forEach(o => {
      (o.items || []).forEach((it: any) => {
        const name = String(it.name || 'Unknown')
        const qty = Number(it.quantity || 0)
        const revenue = Number(it.price || 0) * qty
        if (!perf[name]) perf[name] = { name, sales: 0, revenue: 0 }
        perf[name].sales += qty
        perf[name].revenue += revenue
      })
    })
    return Object.values(perf).sort((a, b) => b.revenue - a.revenue).slice(0, 12)
  }, [ordersInRange])

  const topProductsData = useMemo(() => {
    const total = productPerformanceData.reduce((sum, p) => sum + p.revenue, 0)
    return productPerformanceData.slice(0, 5).map((p, idx) => ({
      rank: idx + 1,
      name: p.name,
      units: p.sales,
      revenue: p.revenue,
      pct: total > 0 ? (p.revenue / total) * 100 : 0,
    }))
  }, [productPerformanceData])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">Detailed business insights and performance metrics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="90days">Last 90 Days</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <Card><CardContent className="pt-6"><p className="text-muted-foreground">Loading analytics…</p></CardContent></Card>
      )}
      {error && (
        <Card><CardContent className="pt-6"><p className="text-destructive">{error}</p></CardContent></Card>
      )}

      {/* Key Metrics */}
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
                    {metric.change !== "" && (
                      <p className={`text-xs mt-1 ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {metric.change} from previous period
                      </p>
                    )}
                  </div>
                  <div className={`${metric.trend === "up" ? "bg-green-100" : "bg-red-100"} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Revenue Trend</CardTitle>
            <CardDescription>Revenue and order count over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dailyRevenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F5233" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2F5233" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#2F5233" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Product Performance</CardTitle>
            <CardDescription>Sales and revenue by product</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#E67E22" name="Units Sold" />
                <Bar dataKey="revenue" fill="#2F5233" name="Revenue (£)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Orders Trend</CardTitle>
            <CardDescription>Daily order count</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="#2F5233" strokeWidth={2} name="Orders" />
                <Line type="monotone" dataKey="customers" stroke="#E67E22" strokeWidth={2} name="New Customers" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Products</CardTitle>
          <CardDescription>Best selling products by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Rank</th>
                  <th className="text-left py-3 px-4 font-medium">Product Name</th>
                  <th className="text-left py-3 px-4 font-medium">Units Sold</th>
                  <th className="text-left py-3 px-4 font-medium">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {topProductsData.map((product, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">#{product.rank}</td>
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">{product.units}</td>
                    <td className="py-3 px-4 font-medium">£{product.revenue.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div className="bg-secondary h-2 rounded-full" style={{ width: `${product.pct.toFixed(1)}%` }} />
                        </div>
                        <span className="text-sm font-medium">{product.pct.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
