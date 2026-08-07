import mongoose, { Document, Schema } from 'mongoose'

export interface IOrderItem {
  name: string
  quantity: number
  price: number
  image?: string
}

export interface IOrder extends Document {
  orderId: string
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  postcode: string
  amount: number
  status: 'processing' | 'pending' | 'shipped' | 'delivered' | 'cancelled'
  items: IOrderItem[]
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String },
})

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  postcode: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['processing','pending','shipped','delivered','cancelled'], default: 'processing' },
  items: { type: [OrderItemSchema], required: true },
}, { timestamps: true })

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)