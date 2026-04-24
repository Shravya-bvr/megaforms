import mongoose, { Schema, Document } from 'mongoose'

export interface IResponse extends Document {
  form: mongoose.Types.ObjectId
  answers: { questionId: string; question: string; answer: unknown }[]
  visitorName?: string
  visitorEmail?: string
  pageUrl?: string
  isComplete: boolean
  isRead: boolean
  createdAt: Date
}

const ResponseSchema = new Schema<IResponse>({
  form: { type: Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: [{
    questionId: String,
    question: String,
    answer: Schema.Types.Mixed,
  }],
  visitorName: String,
  visitorEmail: String,
  pageUrl: String,
  isComplete: { type: Boolean, default: true },
  isRead: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.models.Response || mongoose.model<IResponse>('Response', ResponseSchema)