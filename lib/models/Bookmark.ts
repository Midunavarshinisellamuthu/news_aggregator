import mongoose, { Schema, Document } from 'mongoose'

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  description: string
  link: string
  image: string
  source: string
  category: string
  sentiment: string
  createdAt: Date
  updatedAt: Date
}

const bookmarkSchema = new Schema<IBookmark>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    link: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    source: {
      type: String,
    },
    category: {
      type: String,
    },
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral'],
    },
  },
  { timestamps: true }
)

// Create compound index to prevent duplicate bookmarks
bookmarkSchema.index({ userId: 1, link: 1 }, { unique: true })

export default mongoose.models.Bookmark || mongoose.model<IBookmark>('Bookmark', bookmarkSchema)
