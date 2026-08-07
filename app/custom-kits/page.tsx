"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"
import { ShoppingCart, Plus, Minus } from "lucide-react"

interface DeckConfig {
  size: string
  material: string
  railing: boolean
  lighting: boolean
  stain: boolean
  quantity: number
}

const deckSizes = [
  { id: "small", label: "Small (8x10)", sqft: 80, price: 450 },
  { id: "medium", label: "Medium (12x16)", sqft: 192, price: 950 },
  { id: "large", label: "Large (16x20)", sqft: 320, price: 1450 },
  { id: "xlarge", label: "Extra Large (20x24)", sqft: 480, price: 1950 },
]

const materials = [
  { id: "composite", label: "Premium Composite", price: 0, description: "Weather-resistant, low maintenance" },
  { id: "cedar", label: "Natural Cedar", price: -150, description: "Beautiful grain, natural look" },
  { id: "pvc", label: "PVC (Maintenance-Free)", price: 200, description: "Longest lifespan, premium option" },
]

const addOns = [
  { id: "railing", label: "Safety Railing", price: 300, description: "Code-compliant railing system" },
  { id: "lighting", label: "LED Lighting Kit", price: 250, description: "12 solar-powered LED lights" },
  { id: "stain", label: "Professional Stain & Seal", price: 150, description: "5-year protection finish" },
]

export default function CustomKitsPage() {
  const { addItem } = useCart()
  const [config, setConfig] = useState<DeckConfig>({
    size: "medium",
    material: "composite",
    railing: false,
    lighting: false,
    stain: false,
    quantity: 1,
  })

  const selectedSize = deckSizes.find((s) => s.id === config.size)!
  const selectedMaterial = materials.find((m) => m.id === config.material)!

  const calculatePrice = () => {
    let price = selectedSize.price + selectedMaterial.price
    if (config.railing) price += 300
    if (config.lighting) price += 250
    if (config.stain) price += 150
    return price
  }

  const totalPrice = calculatePrice()

  const handleAddToCart = () => {
    const kitName = `Custom Deck Kit - ${selectedSize.label} (${selectedMaterial.label})`
    addItem({
      id: Math.random(),
      name: kitName,
      price: totalPrice,
      image: "/composite-decking-boards.jpg",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section
        className="relative bg-primary text-primary-foreground py-12 bg-cover bg-center"
        style={{ backgroundImage: "url('/premium-quality-materials-timber-decking.jpg')" }}
      >
        <div className="absolute inset-0 bg-primary/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Custom Deck Kits</h1>
          <p className="text-lg opacity-90">Design your perfect deck with our interactive builder</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Designer Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Size Selection */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">1. Choose Your Deck Size</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {deckSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setConfig({ ...config, size: size.id })}
                    className={`p-4 rounded-lg border-2 transition text-left ${
                      config.size === size.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                  >
                    <h3 className="font-semibold">{size.label}</h3>
                    <p className="text-sm text-muted-foreground">{size.sqft} sq ft</p>
                    <p className="text-primary font-bold mt-2">£{size.price}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Material Selection */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">2. Select Material</h2>
              <div className="space-y-3">
                {materials.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => setConfig({ ...config, material: material.id })}
                    className={`w-full p-4 rounded-lg border-2 transition text-left ${
                      config.material === material.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{material.label}</h3>
                        <p className="text-sm text-muted-foreground">{material.description}</p>
                      </div>
                      <span className="text-primary font-bold">
                        {material.price > 0
                          ? `+£${material.price}`
                          : material.price < 0
                            ? `-£${Math.abs(material.price)}`
                            : "Included"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">3. Add Optional Features</h2>
              <div className="space-y-3">
                {addOns.map((addon) => (
                  <button
                    key={addon.id}
                    onClick={() => {
                      const key = addon.id as keyof Omit<DeckConfig, "size" | "material" | "quantity">
                      setConfig({ ...config, [key]: !config[key] })
                    }}
                    className={`w-full p-4 rounded-lg border-2 transition text-left flex items-center justify-between ${
                      config[addon.id as keyof DeckConfig]
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div>
                      <h3 className="font-semibold">{addon.label}</h3>
                      <p className="text-sm text-muted-foreground">{addon.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-primary font-bold">+£{addon.price}</span>
                      <div
                        className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                          config[addon.id as keyof DeckConfig] ? "bg-primary border-primary" : "border-border"
                        }`}
                      >
                        {config[addon.id as keyof DeckConfig] && (
                          <span className="text-primary-foreground text-sm">✓</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Specifications Summary */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Your Deck Specifications</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground">Size</span>
                  <span className="font-semibold">{selectedSize.label}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground">Material</span>
                  <span className="font-semibold">{selectedMaterial.label}</span>
                </div>
                {config.railing && (
                  <div className="flex justify-between pb-3 border-b border-border">
                    <span className="text-muted-foreground">Safety Railing</span>
                    <span className="font-semibold">Included</span>
                  </div>
                )}
                {config.lighting && (
                  <div className="flex justify-between pb-3 border-b border-border">
                    <span className="text-muted-foreground">LED Lighting</span>
                    <span className="font-semibold">Included</span>
                  </div>
                )}
                {config.stain && (
                  <div className="flex justify-between pb-3 border-b border-border">
                    <span className="text-muted-foreground">Stain & Seal</span>
                    <span className="font-semibold">Included</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-6">Order Summary</h3>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{selectedSize.label}</span>
                  <span>£{selectedSize.price}</span>
                </div>
                {selectedMaterial.price !== 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{selectedMaterial.label}</span>
                    <span>
                      {selectedMaterial.price > 0 ? "+" : ""}£{selectedMaterial.price}
                    </span>
                  </div>
                )}
                {config.railing && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Safety Railing</span>
                    <span>+£300</span>
                  </div>
                )}
                {config.lighting && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">LED Lighting</span>
                    <span>+£250</span>
                  </div>
                )}
                {config.stain && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Stain & Seal</span>
                    <span>+£150</span>
                  </div>
                )}
              </div>

              {/* Quantity */}
              <div className="mb-6 pb-6 border-b border-border">
                <label className="block text-sm font-medium mb-3">Quantity</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setConfig({ ...config, quantity: Math.max(1, config.quantity - 1) })}
                    className="p-2 hover:bg-muted rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={config.quantity}
                    onChange={(e) =>
                      setConfig({ ...config, quantity: Math.max(1, Number.parseInt(e.target.value) || 1) })
                    }
                    className="w-12 text-center border border-border rounded px-2 py-1"
                  />
                  <button
                    onClick={() => setConfig({ ...config, quantity: config.quantity + 1 })}
                    className="p-2 hover:bg-muted rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-muted-foreground">Unit Price</span>
                  <span className="text-2xl font-bold text-primary">£{totalPrice}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-3xl font-bold text-primary">£{(totalPrice * config.quantity).toFixed(2)}</span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button className="w-full gap-2 mb-4" onClick={handleAddToCart}>
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>

              {/* Request Quote Button */}
              <Link href="/contact" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Request Quote
                </Button>
              </Link>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground">
                  All kits include delivery, installation guide, and 2-year warranty on materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
