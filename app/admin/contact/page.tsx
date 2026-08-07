"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type ContactDetails = {
  phoneNumber: string
  email: string
  address: string
}

export default function AdminContactPage() {
  const [form, setForm] = useState<ContactDetails>({
    phoneNumber: "",
    email: "",
    address: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [contact, setContact] = useState<any | null>(null)

  useEffect(() => {
    const fetchContact = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/contact', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load contact details')
        const data = await res.json()
        if (data) {
          setForm({
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            address: data.address || "",
          })
          setContact(data)
          setEditing(false)
        } else {
          setEditing(true)
        }
        setError(null)
      } catch (e: any) {
        setError(e.message || 'Error loading contact details')
      } finally {
        setLoading(false)
      }
    }
    fetchContact()
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/admin/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to save contact details')
      }
      const saved = await res.json()
      setContact(saved)
      setSuccess('Contact details saved successfully')
      setEditing(false)
    } catch (e: any) {
      setError(e.message || 'Failed to save contact details')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!confirm('Delete contact details?')) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/admin/contact', { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to delete contact details')
      }
      setContact(null)
      setForm({ phoneNumber: '', email: '', address: '' })
      setSuccess('Contact details deleted')
      setEditing(true)
    } catch (e: any) {
      setError(e.message || 'Failed to delete contact details')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (date?: string) => {
    if (!date) return '—'
    try {
      return new Date(date).toLocaleDateString()
    } catch {
      return '—'
    }
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Admin contact details shown across the site</CardDescription>
          {!loading && contact && !editing && (
            <CardAction>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setEditing(true)}>Edit Details</Button>
                <Button variant="destructive" onClick={onDelete}>Delete</Button>
              </div>
            </CardAction>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : !editing && contact ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
                <p className="mb-2"><span className="text-muted-foreground">Phone Number:</span> <span className="font-medium">{contact.phoneNumber}</span></p>
                <p className="mb-2"><span className="text-muted-foreground">Email:</span> <span className="font-medium">{contact.email}</span></p>
                <p className="mb-2"><span className="text-muted-foreground">Address:</span> <span className="font-medium">{contact.address}</span></p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Metadata</h3>
                <p className="mb-2"><span className="text-muted-foreground">Created:</span> <span className="font-medium">{formatDate(contact.createdAt)}</span></p>
                <p className="mb-2"><span className="text-muted-foreground">Last Updated:</span> <span className="font-medium">{formatDate(contact.updatedAt)}</span></p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={onChange} placeholder="e.g. +44 1234 567890" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={onChange} placeholder="e.g. admin@example.com" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" name="address" value={form.address} onChange={onChange} placeholder="Street, City, Postcode" rows={3} required />
                </div>
              </div>
              {error && <p className="text-red-600">{error}</p>}
              {success && <p className="text-green-600">{success}</p>}
              <CardFooter className="px-0 flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving…' : contact ? 'Save Changes' : 'Save Contact Details'}
                </Button>
                {contact && (
                  <Button type="button" variant="outline" onClick={() => { setEditing(false); setForm({
                    phoneNumber: contact.phoneNumber || '',
                    email: contact.email || '',
                    address: contact.address || '',
                  }) }}>Cancel</Button>
                )}
              </CardFooter>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}