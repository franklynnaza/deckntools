"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const [contact, setContact] = useState<{ phoneNumber: string; email: string; address: string } | null>(null)
  const [contactLoading, setContactLoading] = useState(true)
  const [contactError, setContactError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
    deckSize: "",
    budget: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setContactLoading(true)
        const res = await fetch('/api/admin/contact', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load contact details')
        const data = await res.json()
        setContact(data || null)
        setContactError(null)
      } catch (e: any) {
        setContactError(e.message || 'Failed to load contact details')
      } finally {
        setContactLoading(false)
      }
    }
    fetchContact()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitted(true)
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "general",
        message: "",
        deckSize: "",
        budget: "",
      })
      setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsLoading(false)
    }
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
          <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-lg opacity-90">Get in touch with our team for quotes and support</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Phone */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Phone</h3>
                  <p className="text-muted-foreground">
                    {contactLoading ? 'Loading…' : (contact?.phoneNumber || '+44 (0) 123 456 7890')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Mon-Fri, 9am-5pm GMT</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-muted-foreground">
                    {contactLoading ? 'Loading…' : (contact?.email || 'info@deckmaterials.co.uk')}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">We respond within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Address</h3>
                  {contactLoading ? (
                    <p className="text-muted-foreground">Loading…</p>
                  ) : (
                    <p className="text-muted-foreground whitespace-pre-line">
                      {(contact?.address || '123 Trade Street\nLondon, UK')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Business Hours</h3>
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday: 9am - 5pm
                    <br />
                    Saturday: 10am - 3pm
                    <br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    Thank you! We've received your message and will get back to you soon.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="John Doe"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="+44 (0) 123 456 7890"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="quote">Request a Quote</option>
                    <option value="support">Technical Support</option>
                    <option value="bulk">Bulk Order</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Conditional Fields for Quote */}
                {formData.subject === "quote" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Estimated Deck Size</label>
                      <select
                        name="deckSize"
                        value={formData.deckSize}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select size...</option>
                        <option value="small">Small (8x10)</option>
                        <option value="medium">Medium (12x16)</option>
                        <option value="large">Large (16x20)</option>
                        <option value="xlarge">Extra Large (20x24+)</option>
                        <option value="custom">Custom Size</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Budget Range</label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select range...</option>
                        <option value="under500">Under £500</option>
                        <option value="500-1000">£500 - £1,000</option>
                        <option value="1000-2000">£1,000 - £2,000</option>
                        <option value="2000-5000">£2,000 - £5,000</option>
                        <option value="over5000">Over £5,000</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {contactError && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{contactError}</p>
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "What is your delivery timeframe?",
                a: "Standard delivery is 5-7 business days. Express delivery (2-3 days) is available for an additional fee.",
              },
              {
                q: "Do you offer installation services?",
                a: "We provide detailed installation guides with all kits. Professional installation services are available upon request.",
              },
              {
                q: "What warranty do you provide?",
                a: "All materials come with a 2-year warranty. Custom kits include extended warranty options.",
              },
              {
                q: "Can I return products?",
                a: "Yes, we offer 30-day returns on unopened products. Custom kits may have different return policies.",
              },
              {
                q: "Do you offer bulk discounts?",
                a: "Yes! Contact our sales team for bulk orders of 5+ kits for special pricing.",
              },
              {
                q: "How do I track my order?",
                a: "You'll receive a tracking number via email once your order ships. Track it directly on the carrier's website.",
              },
            ].map((faq, i) => (
              <div key={i} className="bg-card border border-border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
