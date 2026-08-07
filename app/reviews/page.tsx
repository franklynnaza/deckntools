"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Star, ThumbsUp } from "lucide-react"

interface Review {
  id: number
  author: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
  helpful: number
  product?: string
}

const reviews: Review[] = [
  {
    id: 1,
    author: "James Mitchell",
    rating: 5,
    title: "Exceptional Quality and Service",
    content:
      "Built my deck using their premium composite boards and couldn't be happier. The materials arrived on time, quality was outstanding, and the installation guide was incredibly detailed. Highly recommend!",
    date: "2 weeks ago",
    verified: true,
    helpful: 24,
    product: "Premium Composite Decking Boards",
  },
  {
    id: 2,
    author: "Sarah Thompson",
    rating: 5,
    title: "Custom Kit Made Everything Easy",
    content:
      "Used their custom deck kit designer to plan my 16x20 deck. The process was intuitive, pricing was transparent, and everything arrived perfectly packaged. Best investment for my garden!",
    date: "1 month ago",
    verified: true,
    helpful: 18,
    product: "Custom Deck Kit",
  },
  {
    id: 3,
    author: "David Chen",
    rating: 4,
    title: "Great Products, Fast Shipping",
    content:
      "Ordered pressure-treated joists and stainless steel fasteners. Quality is excellent and shipping was faster than expected. Only minor issue with packaging, but everything arrived intact.",
    date: "1 month ago",
    verified: true,
    helpful: 12,
    product: "Pressure-Treated Joists",
  },
  {
    id: 4,
    author: "Emma Wilson",
    rating: 5,
    title: "Professional Support Made the Difference",
    content:
      "Had questions about material selection and the team was incredibly helpful. They provided personalized recommendations based on my climate and budget. Fantastic customer service!",
    date: "6 weeks ago",
    verified: true,
    helpful: 31,
    product: "General Service",
  },
  {
    id: 5,
    author: "Michael Roberts",
    rating: 4,
    title: "Solid Materials, Good Value",
    content:
      "Built a small deck with their cedar boards. Quality is solid and the price is competitive. Would have given 5 stars but delivery took a bit longer than expected.",
    date: "2 months ago",
    verified: true,
    helpful: 9,
    product: "Cedar Decking Boards",
  },
  {
    id: 6,
    author: "Lisa Anderson",
    rating: 5,
    title: "Worth Every Penny",
    content:
      "Invested in the PVC decking option and it's been maintenance-free for over a year now. No staining, no sealing, just beautiful. The LED lighting kit they included is a nice touch too.",
    date: "3 months ago",
    verified: true,
    helpful: 27,
    product: "PVC Decking Boards",
  },
]

export default function ReviewsPage() {
  const [sortBy, setSortBy] = useState("helpful")
  const [filterRating, setFilterRating] = useState(0)
  const [helpfulReviews, setHelpfulReviews] = useState<number[]>([])

  const filteredReviews = reviews
    .filter((r) => (filterRating === 0 ? true : r.rating === filterRating))
    .sort((a, b) => {
      if (sortBy === "helpful") return b.helpful - a.helpful
      if (sortBy === "recent") return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === "rating") return b.rating - a.rating
      return 0
    })

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: Math.round((reviews.filter((r) => r.rating === rating).length / reviews.length) * 100),
  }))

  const toggleHelpful = (id: number) => {
    if (helpfulReviews.includes(id)) {
      setHelpfulReviews(helpfulReviews.filter((rid) => rid !== id))
    } else {
      setHelpfulReviews([...helpfulReviews, id])
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Customer Reviews</h1>
          <p className="text-lg opacity-90">See what our customers say about DeckMaterials</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Rating Summary</h2>

              {/* Average Rating */}
              <div className="mb-8 pb-8 border-b border-border">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold text-primary">{averageRating}</span>
                  <span className="text-muted-foreground">/5</span>
                </div>
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(Number.parseFloat(averageRating))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-3">
                {ratingDistribution.map((dist) => (
                  <button
                    key={dist.rating}
                    onClick={() => setFilterRating(filterRating === dist.rating ? 0 : dist.rating)}
                    className={`w-full text-left p-2 rounded transition ${
                      filterRating === dist.rating ? "bg-primary/10" : "hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{dist.rating} stars</span>
                      <span className="text-xs text-muted-foreground">({dist.count})</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition"
                        style={{ width: `${dist.percentage}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Reset Filter */}
              {filterRating > 0 && (
                <Button variant="outline" className="w-full mt-6 bg-transparent" onClick={() => setFilterRating(0)}>
                  Clear Filter
                </Button>
              )}
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? "s" : ""}
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="helpful">Most Helpful</option>
                <option value="recent">Most Recent</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Reviews */}
            <div className="space-y-6">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-card border border-border rounded-lg p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{review.author}</h3>
                        {review.verified && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="font-semibold text-lg mb-2">{review.title}</h4>

                  {/* Product */}
                  {review.product && (
                    <p className="text-sm text-muted-foreground mb-3">
                      Product: <span className="font-medium">{review.product}</span>
                    </p>
                  )}

                  {/* Content */}
                  <p className="text-foreground mb-4">{review.content}</p>

                  {/* Helpful Button */}
                  <button
                    onClick={() => toggleHelpful(review.id)}
                    className={`flex items-center gap-2 text-sm px-3 py-2 rounded transition ${
                      helpfulReviews.includes(review.id)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful + (helpfulReviews.includes(review.id) ? 1 : 0)})
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Testimonials</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "DeckMaterials transformed my backyard. The quality is unmatched and the team was incredibly helpful throughout the process.",
                author: "James Mitchell",
                role: "Homeowner",
              },
              {
                quote:
                  "As a contractor, I recommend DeckMaterials to all my clients. Reliable, professional, and competitive pricing.",
                author: "David Chen",
                role: "Professional Contractor",
              },
              {
                quote:
                  "The custom kit designer made planning my deck so easy. Everything arrived on time and in perfect condition.",
                author: "Sarah Thompson",
                role: "DIY Enthusiast",
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
