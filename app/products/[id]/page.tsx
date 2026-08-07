import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { headers } from "next/headers"
import { AddToCartButton } from "@/components/add-to-cart-button"
import SecurePayments from "@/components/secure-payments"

function formatPrice(value: number) {
  try {
    return `£${Number(value).toFixed(2)}`
  } catch {
    return `£${value}`
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // Build absolute origin from request headers to avoid relative fetch issues
  const hdrs = await headers()
  const proto = hdrs.get("x-forwarded-proto") ?? "http"
  const host = hdrs.get("host") ?? "localhost:3000"
  const origin = `${proto}://${host}`

  // Prefer env origin, fallback to header-derived origin
  const envOrigin = process.env.NEXT_PUBLIC_BASE_URL
  const base = envOrigin && envOrigin.length > 0 ? envOrigin : origin

  // Fetch product by ID from API (no-store for freshness)
  const res = await fetch(`${base}/api/admin/products/${id}`, { cache: "no-store" })

  if (!res.ok) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">We couldn’t find a product with ID: {id}.</p>
          <Link href="/products" className="underline">Back to products</Link>
        </div>
      </div>
    )
  }

  const product = await res.json()

  const image = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : "/placeholder.svg"

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <section className="relative bg-primary text-primary-foreground py-10 bg-cover bg-center" style={{ backgroundImage: "url('/products-header-background.jpg')" }}>
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm opacity-90">
            {/* <Link href="/" className="underline">Home</Link> */}
            {/* <span className="mx-2">/</span> */}
            {/* <Link href="/products" className="underline">Products</Link> */}
            {/* <span className="mx-2">/</span> */}
            <span className="font-semibold">{product.name}</span>
          </nav>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div>
            <div className="bg-card border border-border rounded-lg overflow-hidden mb-4">
              <img src={image} alt={product.name} className="w-full h-[420px] object-cover" />
            </div>
            {Array.isArray(product.images) && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 8).map((img: string, idx: number) => (
                  <div key={idx} className="border border-border rounded-lg overflow-hidden bg-muted">
                    <img src={img || "/placeholder.svg"} alt={`${product.name} ${idx + 1}`} className="w-full h-20 object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            {product.category && (
              <p className="text-sm text-muted-foreground mb-6">Category: {product.category}</p>
            )}

            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-primary">{formatPrice(product.price)}</span>
              {typeof product.stock === 'number' && (
                <span className="text-sm px-3 py-1 rounded-full border border-border">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
              )}
            </div>

            {product.description && product.description.length > 0 && (
              <div className="prose prose-sm max-w-none mb-8 text-muted-foreground">
                <p>{product.description}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 items-center">
              <AddToCartButton id={String(product._id ?? id)} name={product.name} price={Number(product.price)} image={image} />
              <Link href="/products" className="px-4 py-2 border border-border rounded bg-transparent">Back</Link>
            </div>
          </div>
        </div>

        {/* Secure Payments */}
        <SecurePayments className="mt-12" />
      </div>

      <Footer />
    </div>
  )
}