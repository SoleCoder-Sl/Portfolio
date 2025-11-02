import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json()

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment parameters' },
        { status: 400 }
      )
    }

    // Check if Razorpay secret is configured
    if (!process.env.RAZORPAY_SECRET) {
      console.error('RAZORPAY_SECRET is not set in environment variables')
      return NextResponse.json(
        { success: false, error: 'Razorpay is not configured. Please set RAZORPAY_SECRET in your environment variables.' },
        { status: 500 }
      )
    }

    // Create the signature body
    const body = razorpay_order_id + '|' + razorpay_payment_id

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest('hex')

    // Verify the signature
    const isAuthentic = expectedSignature === razorpay_signature

    if (isAuthentic) {
      // Payment is authentic.
      // Here, you would typically save payment details to your database.
      
      // For this example, just return success.
      return NextResponse.json({ 
        success: true, 
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { success: false, error: 'Error verifying payment' },
      { status: 500 }
    )
  }
}

