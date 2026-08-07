"use client"

import { Suspense, useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"

// Products are loaded from the database via /api/admin/products

function ProductsContent() {
  const searchParams = useSearchParams()
  const rawSearch = (searchParams.get("search") || "").trim()
  const normalizedSearch = rawSearch.toLowerCase()
  const [selectedCategory, setSelectedCategory] = useState("All Products")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState([0, 300])
  const [showFilters, setShowFilters] = useState(false)
  const [products, setProducts] = useState<Array<{ id: string; name: string; price: number; image: string; category: string; rating: number }>>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const res = await fetch('/api/admin/products')
        if (!res.ok) throw new Error('Failed to fetch products')
        const data = await res.json()
        const mapped = (Array.isArray(data) ? data : []).map((p: any) => ({
          id: String(p._id ?? p.id ?? ''),
          name: p.name,
          price: Number(p.price ?? 0),
          image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '/placeholder.svg',
          category: p.category ?? 'General',
          rating: 4.6, // default rating since DB schema has no rating
        }))
        setProducts(mapped)
      } catch (err) {
        console.error('Error loading products:', err)
        setError(err instanceof Error ? err.message : 'Error loading products')
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)))
    return ['All Products', ...cats]
  }, [products])

  const filteredProducts = useMemo(() => {
    let filtered = products

    // Text search from header
    if (normalizedSearch.length > 0) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(normalizedSearch) ||
        p.category.toLowerCase().includes(normalizedSearch)
      )
    }

    // Filter by category
    if (selectedCategory !== "All Products") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Filter by price
    filtered = filtered.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Sort
    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating)
    }

    return filtered
  }, [products, selectedCategory, sortBy, priceRange])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:block ${showFilters ? "block" : "hidden"}`}>
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h3 className="font-bold text-lg mb-6">Filters</h3>

              {/* Categories */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4">Category</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`block w-full text-left px-3 py-2 rounded transition ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-semibold mb-4">Price Range</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Min: £{priceRange[0]}</label>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Max: £{priceRange[1]}</label>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Filters */}
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setSelectedCategory("All Products")
                  setSortBy("featured")
                  setPriceRange([0, 300])
                }}
              >
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-muted-foreground">
                {isLoading
                  ? 'Loading products…'
                  : error
                  ? `Error: ${error}`
                  : normalizedSearch
                  ? `Showing ${filteredProducts.length} results for "${rawSearch}"`
                  : `Showing ${filteredProducts.length} products`}
              </p>
              <div className="flex gap-4 items-center">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                  <ChevronDown className="w-4 h-4" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="text-center py-12">Loading products…</div>
            ) : error ? (
              <div className="text-center py-12 text-red">{error}</div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
              </div>
            )}
          </div>
      </div>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section
        className="bg-primary text-primary-foreground py-12 bg-cover bg-center relative"
        style={{
          backgroundImage: "url(/premium-quality-materials-timber-decking.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-primary/70"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-bold mb-2">Products</h1>
          <p className="text-lg opacity-90">Browse our complete selection of decking materials and tools</p>
        </div>
      </section>

      <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">Loading products…</div>}>
        <ProductsContent />
      </Suspense>

      <Footer />
    </div>
  )
}
