"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart, Star } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"

interface Product {
  id: string | number
  name: string
  price: number
  image: string
  category: string
  rating: number
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-muted h-48">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition duration-300"
          />
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
            {product.category}
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/products/${product.id}`} className="block">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({product.rating})</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">£{product.price.toFixed(2)}</span>
          <Button
            size="sm"
            className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
