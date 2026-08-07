import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import Bank from '@/models/Bank'

// GET current bank details (returns the most recently updated document or null)
export async function GET() {
  try {
    await connectToDatabase()
    const bank = await Bank.findOne({}).sort({ updatedAt: -1 })
    return NextResponse.json(bank)
  } catch (error) {
    console.error('Error fetching bank details:', error)
    return NextResponse.json({ error: 'Failed to fetch bank details' }, { status: 500 })
  }
}

// POST create or update bank details (single document upsert)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { bankName, accountHolderName, accountNumber, bankAddress, swiftCode, routingNumber } = body

    if (!bankName || !accountHolderName || !accountNumber || !bankAddress) {
      return NextResponse.json(
        { error: 'bankName, accountHolderName, accountNumber, and bankAddress are required' },
        { status: 400 }
      )
    }

    await connectToDatabase()

    const update: Record<string, any> = { bankName, accountHolderName, accountNumber, bankAddress }
    if (typeof swiftCode !== 'undefined') update.swiftCode = swiftCode
    if (typeof routingNumber !== 'undefined') update.routingNumber = routingNumber

    const result = await Bank.findOneAndUpdate(
      {},
      update,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error saving bank details:', error)
    return NextResponse.json({ error: 'Failed to save bank details' }, { status: 500 })
  }
}

// DELETE remove existing bank details (single-record design)
export async function DELETE() {
  try {
    await connectToDatabase()
    await Bank.deleteMany({})
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting bank details:', error)
    return NextResponse.json({ error: 'Failed to delete bank details' }, { status: 500 })
  }
}