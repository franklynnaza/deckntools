"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export function AddToCartButton({
  id,
  name,
  price,
  image,
  className,
}: {
  id: string
  name: string
  price: number
  image: string
  className?: string
}) {
  const { addItem } = useCart()

  return (
    <Button
      className={className ?? "gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"}
      onClick={() => addItem({ id, name, price, image })}
    >
      <ShoppingCart className="w-4 h-4" />
      Add to Cart
    </Button>
  )
}