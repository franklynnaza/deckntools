import mongoose, { Document, Schema } from 'mongoose'

export interface IBank extends Document {
  bankName: string
  accountHolderName: string
  accountNumber: string
  bankAddress: string
  swiftCode?: string
  routingNumber?: string
  createdAt: Date
  updatedAt: Date
}

const BankSchema = new Schema<IBank>({
  bankName: { type: String, required: true },
  accountHolderName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  bankAddress: { type: String, required: true },
  swiftCode: { type: String },
  routingNumber: { type: String },
}, {
  timestamps: true,
})

// Ensure schema updates are picked up during dev hot-reload
// If the model already exists, delete and recreate with the latest schema.
if (mongoose.models.Bank) {
  try {
    mongoose.deleteModel('Bank')
  } catch (e) {
    // ignore if deleteModel not available or fails
  }
}

export default mongoose.model<IBank>('Bank', BankSchema)