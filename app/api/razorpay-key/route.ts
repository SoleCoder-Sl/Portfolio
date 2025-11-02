import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID
    
    console.log('Environment check:', {
      hasNextPublic: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      hasRegular: !!process.env.RAZORPAY_KEY_ID,
      nextPublicValue: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? 'Set (hidden)' : 'Not set',
      regularValue: process.env.RAZORPAY_KEY_ID ? 'Set (hidden)' : 'Not set',
    })
    
    if (!keyId) {
      return NextResponse.json(
        { 
          error: 'Razorpay key not configured',
          details: 'Please set NEXT_PUBLIC_RAZORPAY_KEY_ID or RAZORPAY_KEY_ID in your .env.local file',
          debug: {
            hasNextPublic: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            hasRegular: !!process.env.RAZORPAY_KEY_ID,
          }
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ keyId })
  } catch (error) {
    console.error('Error getting Razorpay key:', error)
    return NextResponse.json(
      { error: 'Failed to get Razorpay key', details: error },
      { status: 500 }
    )
  }
}

