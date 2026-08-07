"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

type BankDetails = {
  bankName: string
  accountHolderName: string
  accountNumber: string
  bankAddress: string
  swiftCode?: string
  routingNumber?: string
}

export default function AdminBankPage() {
  const [form, setForm] = useState<BankDetails>({
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    bankAddress: "",
    swiftCode: "",
    routingNumber: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [bank, setBank] = useState<any | null>(null)

  useEffect(() => {
    const fetchBank = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/bank', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load bank details')
        const data = await res.json()
        if (data) {
          setForm({
            bankName: data.bankName || "",
            accountHolderName: data.accountHolderName || "",
            accountNumber: data.accountNumber || "",
            bankAddress: data.bankAddress || "",
            swiftCode: data.swiftCode || "",
            routingNumber: data.routingNumber || "",
          })
          setBank(data)
          setEditing(false)
        } else {
          setEditing(true)
        }
        setError(null)
      } catch (e: any) {
        setError(e.message || 'Error loading bank details')
      } finally {
        setLoading(false)
      }
    }
    fetchBank()
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
      const res = await fetch('/api/admin/bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to save bank details')
      }
      const saved = await res.json()
      setBank(saved)
      setSuccess('Bank details saved successfully')
      setEditing(false)
    } catch (e: any) {
      setError(e.message || 'Failed to save bank details')
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!confirm('Delete bank details?')) return
    setSaving(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('/api/admin/bank', { method: 'DELETE' })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Failed to delete bank details')
      }
      setBank(null)
      setForm({ bankName: '', accountHolderName: '', accountNumber: '', bankAddress: '', swiftCode: '', routingNumber: '' })
      setSuccess('Bank details deleted')
      setEditing(true)
    } catch (e: any) {
      setError(e.message || 'Failed to delete bank details')
    } finally {
      setSaving(false)
    }
  }

  const maskAccount = (num: string) => {
    if (!num) return ''
    const last4 = num.slice(-4)
    return `*****${last4}`
  }

  const maskRouting = (num: string) => {
    if (!num) return ''
    const last4 = num.slice(-4)
    return `*****${last4}`
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
          <CardTitle>Bank Account Information</CardTitle>
          <CardDescription>Current bank details on file</CardDescription>
          {!loading && bank && !editing && (
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
          ) : !editing && bank ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Bank Information</h3>
                <p className="mb-2"><span className="text-muted-foreground">Bank Name:</span> <span className="font-medium">{bank.bankName}</span></p>
                <p className="mb-2"><span className="text-muted-foreground">Account Holder:</span> <span className="font-medium">{bank.accountHolderName}</span></p>
                <p className="mb-2"><span className="text-muted-foreground">Account Number:</span> <span className="font-medium">{maskAccount(bank.accountNumber)}</span></p>
                {bank.swiftCode && (
                  <p className="mb-2"><span className="text-muted-foreground">Swift Code:</span> <span className="font-medium">{bank.swiftCode}</span></p>
                )}
                {bank.routingNumber && (
                  <p className="mb-2"><span className="text-muted-foreground">Routing Number:</span> <span className="font-medium">{maskRouting(bank.routingNumber)}</span></p>
                )}
                <p className="mb-2"><span className="text-muted-foreground">Address:</span> <span className="font-medium">{bank.bankAddress}</span></p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Additional Details</h3>
                <p className="mb-2"><span className="text-muted-foreground">Created:</span> <span className="font-medium">{formatDate(bank.createdAt)}</span></p>
                <p className="mb-2"><span className="text-muted-foreground">Last Updated:</span> <span className="font-medium">{formatDate(bank.updatedAt)}</span></p>
              </div>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input id="bankName" name="bankName" value={form.bankName} onChange={onChange} placeholder="e.g. First National Bank" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">Account Holder Name</Label>
                  <Input id="accountHolderName" name="accountHolderName" value={form.accountHolderName} onChange={onChange} placeholder="e.g. Jane Doe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input id="accountNumber" name="accountNumber" value={form.accountNumber} onChange={onChange} placeholder="e.g. 1234567890" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="swiftCode">Swift Code (optional)</Label>
                  <Input id="swiftCode" name="swiftCode" value={form.swiftCode || ''} onChange={onChange} placeholder="e.g. ABCDGB2L" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="routingNumber">Routing Number (optional)</Label>
                  <Input id="routingNumber" name="routingNumber" value={form.routingNumber || ''} onChange={onChange} placeholder="e.g. 110000000" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bankAddress">Bank Address</Label>
                  <Textarea id="bankAddress" name="bankAddress" value={form.bankAddress} onChange={onChange} placeholder="Street, City, State, ZIP" rows={3} required />
                </div>
              </div>
              {error && <p className="text-red-600">{error}</p>}
              {success && <p className="text-green-600">{success}</p>}
              <CardFooter className="px-0 flex gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving…' : bank ? 'Save Changes' : 'Save Bank Details'}
                </Button>
                {bank && (
                  <Button type="button" variant="outline" onClick={() => { setEditing(false); setForm({
                    bankName: bank.bankName || '',
                    accountHolderName: bank.accountHolderName || '',
                    accountNumber: bank.accountNumber || '',
                    bankAddress: bank.bankAddress || '',
                    swiftCode: bank.swiftCode || '',
                    routingNumber: bank.routingNumber || '',
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