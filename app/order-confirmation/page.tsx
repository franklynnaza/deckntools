"use client"

import { Suspense, useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (sessionId) {
      setOrderDetails({
        sessionId,
        status: "success",
      })
      setLoading(false)
    }
  }, [sessionId])

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {loading ? (
        <div className="text-center">
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      ) : orderDetails?.status === "success" ? (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. We've sent a confirmation email with your order details and tracking
            information.
          </p>
          <div className="bg-muted p-4 rounded-lg mb-8">
            <p className="text-sm text-muted-foreground mb-2">Order ID</p>
            <p className="font-mono font-bold">{orderDetails.sessionId}</p>
          </div>
          <p className="text-muted-foreground mb-8">
            You can track your order status in your email or contact our support team for assistance.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button variant="outline" className="bg-transparent">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-destructive">There was an issue with your order. Please contact support.</p>
        </div>
      )}
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Order Confirmation</h1>
        </div>
      </section>

      <Suspense fallback={<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12"><p className="text-center text-muted-foreground">Loading…</p></div>}>
        <OrderConfirmationContent />
      </Suspense>

      <Footer />
    </div>
  )
}
