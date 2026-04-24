import mongoose, { Schema, Document } from 'mongoose'

export interface IQuestion {
  id: string
  type: 'text' | 'email' | 'phone' | 'number' | 'multiple_choice' | 'checkbox' | 'dropdown' | 'rating' | 'date' | 'statement'
  question: string
  placeholder?: string
  required: boolean
  options?: string[]
}

export interface IForm extends Document {
  user: mongoose.Types.ObjectId
  title: string
  description?: string
  questions: IQuestion[]
  theme: {
    primaryColor: string
    backgroundColor: string
    welcomeMessage: string
  }
  isPublished: boolean
  shareToken: string
  thankYouMessage: string
  notifyEmail?: string
  redirectUrl?: string
  totalResponses: number
  totalViews: number
  createdAt: Date
}

const QuestionSchema = new Schema({
  id: { type: String, required: true },
  type: { type: String, required: true },
  question: { type: String, required: true },
  placeholder: String,
  required: { type: Boolean, default: false },
  options: [String],
})

const FormSchema = new Schema<IForm>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: String,
  questions: [QuestionSchema],
  theme: {
    primaryColor: { type: String, default: '#E53935' },
    backgroundColor: { type: String, default: '#ffffff' },
    welcomeMessage: { type: String, default: 'Hi! 👋 How can we help you today?' },
  },
  isPublished: { type: Boolean, default: false },
  shareToken: { type: String, unique: true },
  thankYouMessage: { type: String, default: '🎉 Thank you! We will get back to you soon.' },
  notifyEmail: String,
  redirectUrl: String,
  totalResponses: { type: Number, default: 0 },
  totalViews: { type: Number, default: 0 },
}, { timestamps: true })

FormSchema.pre('save', function (next) {
  if (!this.shareToken) {
    this.shareToken = Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
  }
  next()
})

export default mongoose.models.Form || mongoose.model<IForm>('Form', FormSchema)