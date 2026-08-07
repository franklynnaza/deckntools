import mongoose, { Document, Schema } from 'mongoose'

export interface IContact extends Document {
  phoneNumber: string
  email: string
  address: string
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<IContact>({
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
}, {
  timestamps: true,
})

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema)