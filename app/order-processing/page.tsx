'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader, CheckCircle } from 'lucide-react'

function OrderProcessingContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id') || ''
  const [trackId, setTrackId] = useState(orderId)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setTrackId(orderId)
  }, [orderId])

  const fetchStatus = async (id: string) => {
    setLoading(true)
    setError(null)
    setStatus(null)
    try {
      const res = await fetch(`/api/orders?orderId=${encodeURIComponent(id)}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Order not found')
      const data = await res.json()
      setStatus(data.status || 'processing')
    } catch (e: any) {
      setError(e.message || 'Unable to fetch order')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (orderId) fetchStatus(orderId)
  }, [orderId])

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Your order is being processed</CardTitle>
          <CardDescription>Keep your order number for tracking updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">Order Number</p>
            <p className="font-mono font-bold">{orderId || '—'}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Track your order</label>
            <div className="flex gap-2">
              <Input value={trackId} onChange={(e) => setTrackId(e.target.value)} placeholder="Enter order number" />
              <Button onClick={() => fetchStatus(trackId)} disabled={!trackId || loading}>
                {loading ? <span className="flex items-center gap-2"><Loader className="animate-spin" /> Checking</span> : 'Track'}
              </Button>
            </div>
            {status && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="size-4" />
                Status: {status}
              </div>
            )}
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center">
        <Button variant="outline" asChild>
          <a href="/products">Continue Shopping</a>
        </Button>
        <Button asChild>
          <a href="/">Return Home</a>
        </Button>
      </div>
    </div>
  )
}

export default function OrderProcessingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Order Processing</h1>
        </div>
      </section>

      <Suspense fallback={<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><Card><CardContent className="py-8 text-center">Loading…</CardContent></Card></div>}>
        <OrderProcessingContent />
      </Suspense>

      <Footer />
    </div>
  )
}