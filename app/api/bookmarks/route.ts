import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Bookmark from '@/lib/models/Bookmark'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

// Helper to extract and verify JWT token
function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split('Bearer ')[1]

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded.userId
  } catch {
    return null
  }
}

// GET - Fetch all bookmarks for current user
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const bookmarks = await Bookmark.find({ userId }).sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      bookmarks,
    })
  } catch (error) {
    console.error('Get bookmarks error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add a bookmark
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, description, link, image, source, category, sentiment } =
      await request.json()

    if (!title || !link) {
      return NextResponse.json(
        { error: 'Title and link are required' },
        { status: 400 }
      )
    }

    // Check if bookmark already exists
    const existingBookmark = await Bookmark.findOne({
      userId,
      link,
    })

    if (existingBookmark) {
      return NextResponse.json(
        { error: 'Bookmark already exists' },
        { status: 409 }
      )
    }

    // Create new bookmark
    const bookmark = await Bookmark.create({
      userId,
      title,
      description,
      link,
      image,
      source,
      category,
      sentiment,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Bookmark added successfully',
        bookmark,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Add bookmark error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a bookmark
export async function DELETE(request: NextRequest) {
  try {
    await connectDB()

    const userId = verifyToken(request)
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const bookmarkId = searchParams.get('id')

    if (!bookmarkId) {
      return NextResponse.json(
        { error: 'Bookmark ID is required' },
        { status: 400 }
      )
    }

    const bookmark = await Bookmark.findOneAndDelete({
      _id: bookmarkId,
      userId,
    })

    if (!bookmark) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Bookmark removed successfully',
    })
  } catch (error) {
    console.error('Delete bookmark error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
