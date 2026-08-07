import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export function ReviewsPreview() {
  const reviews = [
    {
      author: "James Mitchell",
      profileImage: "/professional-man-headshot.png",
      rating: 5,
      title: "Exceptional Quality and Service",
      content: "Built my deck using their premium composite boards and couldn't be happier. Highly recommend!",
    },
    {
      author: "Sarah Thompson",
      profileImage: "/professional-woman-headshot.png",
      rating: 5,
      title: "Custom Kit Made Everything Easy",
      content: "The process was intuitive, pricing was transparent, and everything arrived perfectly packaged.",
    },
    {
      author: "David Chen",
      profileImage: "/professional-man-headshot.png",
      rating: 4,
      title: "Great Products, Fast Shipping",
      content: "Quality is excellent and shipping was faster than expected. Everything arrived intact.",
    },
  ]

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">What Our Customers Say</h2>
          <p className="text-muted-foreground text-lg">Join thousands of satisfied customers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {reviews.map((review, i) => (
            <div key={i} className="bg-background border border-border rounded-lg p-6">
              <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${
                      j < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <h3 className="font-semibold text-lg mb-2">{review.title}</h3>
              <p className="text-muted-foreground mb-4">{review.content}</p>
              <div className="flex items-center gap-3">
                <Image
                  src={review.profileImage}
                  alt={`${review.author} profile`}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
                <p className="text-sm font-medium">— {review.author}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/reviews">
            <Button variant="outline" className="bg-transparent">
              Read All Reviews
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
