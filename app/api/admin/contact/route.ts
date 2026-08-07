import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Contact from '@/models/Contact'

// GET current contact details (returns the most recently updated document or null)
export async function GET() {
  try {
    await connectToDatabase()
    const contact = await Contact.findOne({}).sort({ updatedAt: -1 })
    return NextResponse.json(contact)
  } catch (error) {
    console.error('Error fetching contact details:', error)
    return NextResponse.json({ error: 'Failed to fetch contact details' }, { status: 500 })
  }
}

// POST create or update contact details (single document upsert)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phoneNumber, email, address } = body

    if (!phoneNumber || !email || !address) {
      return NextResponse.json(
        { error: 'phoneNumber, email, and address are required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const result = await Contact.findOneAndUpdate(
      {},
      { phoneNumber, email, address },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error saving contact details:', error)
    return NextResponse.json({ error: 'Failed to save contact details' }, { status: 500 })
  }
}

// DELETE remove existing contact details (single-record design)
export async function DELETE() {
  try {
    await connectToDatabase()
    await Contact.deleteMany({})
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact details:', error)
    return NextResponse.json({ error: 'Failed to delete contact details' }, { status: 500 })
  }
}