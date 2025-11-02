import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(req: Request) {
  try {
    const { amount } = await req.json()

    // Validate amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount. Amount must be a positive number in paise.' },
        { status: 400 }
      )
    }

    // Debug: Log environment variable status
    console.log('Environment check in create-order:', {
      hasKeyId: !!process.env.RAZORPAY_KEY_ID,
      hasSecret: !!process.env.RAZORPAY_SECRET,
      keyIdLength: process.env.RAZORPAY_KEY_ID?.length || 0,
      secretLength: process.env.RAZORPAY_SECRET?.length || 0,
      keyIdPrefix: process.env.RAZORPAY_KEY_ID?.substring(0, 8) || 'not set',
    })

    // Check if Razorpay credentials are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
      console.error('Razorpay credentials are not set in environment variables')
      console.error('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID ? 'Set' : 'NOT SET')
      console.error('RAZORPAY_SECRET:', process.env.RAZORPAY_SECRET ? 'Set' : 'NOT SET')
      return NextResponse.json(
        { 
          error: 'Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_SECRET in your environment variables.',
          debug: {
            hasKeyId: !!process.env.RAZORPAY_KEY_ID,
            hasSecret: !!process.env.RAZORPAY_SECRET,
            tip: 'Make sure you have restarted your development server after creating/updating .env.local'
          }
        },
        { status: 500 }
      )
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    })

    const options = {
      amount: amount, // amount in the smallest currency unit (paise)
      currency: 'INR',
      receipt: `receipt_order_${new Date().getTime()}`,
    }

    const order = await razorpay.orders.create(options)
    
    return NextResponse.json(order)
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)
    
    // Return more specific error messages
    let errorMessage = 'Error creating order'
    if (error?.error?.description) {
      errorMessage = error.error.description
    } else if (error?.message) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error },
      { status: 500 }
    )
  }
}

