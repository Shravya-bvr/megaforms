import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  password?: string
  googleId?: string
  avatar?: string
  plan: 'free' | 'lite' | 'standard' | 'unlimited'
  responsesUsedThisMonth: number
  isVerified: boolean
  createdAt: Date
  comparePassword(password: string): Promise<boolean>
  getResponseLimit(): number
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6, select: false },
  googleId: String,
  avatar: { type: String, default: '' },
  plan: {
    type: String,
    enum: ['free', 'lite', 'standard', 'unlimited'],
    default: 'free',
  },
  responsesUsedThisMonth: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true })

UserSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return
  this.password = await bcrypt.hash(this.password, 12)
})

UserSchema.methods.comparePassword = async function (entered: string) {
  return bcrypt.compare(entered, this.password)
}

UserSchema.methods.getResponseLimit = function () {
  const limits: Record<string, number> = {
    free: 100,
    lite: 1000,
    standard: Infinity,
    unlimited: Infinity,
  }
  return limits[this.plan]
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)