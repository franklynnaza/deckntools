import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <section
        className="relative bg-primary text-primary-foreground py-12 bg-cover bg-center"
        style={{ backgroundImage: "url('/expert-support-customer-service-team.jpg')" }}
      >
        <div className="absolute inset-0 bg-primary/70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Site Under Maintenance</h1>
          <p className="mt-2 text-white/90">We’re performing scheduled updates. Please check back soon.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Thanks for your patience</h2>
          <p className="text-muted-foreground mb-6">
            Our team is working to improve reliability and add new features. In the meantime,
            you can reach us via the contact page.
          </p>
          <Link href="/contact">
            <Button variant="outline">Contact Us</Button>
          </Link>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  )
}