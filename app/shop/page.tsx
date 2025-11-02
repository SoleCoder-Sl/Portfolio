'use client'

import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'

export const dynamic = 'force-dynamic'

// Helper function to wait for Razorpay to load
const waitForRazorpay = (maxAttempts = 20, interval = 100): Promise<boolean> => {
  return new Promise((resolve) => {
    let attempts = 0
    const checkRazorpay = () => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) {
        resolve(true)
      } else if (attempts < maxAttempts) {
        attempts++
        setTimeout(checkRazorpay, interval)
      } else {
        resolve(false)
      }
    }
    checkRazorpay()
  })
}

// Define a product type
type Product = {
  id: string
  title: string
  description: string
  imageUrl: string
  priceDisplay: string // e.g., "₹999"
  amount: number // e.g., 99900 (for ₹999.00 in paise)
}

// Create placeholder product data
const products: Product[] = [
  {
    id: 'n8n-email-marketing',
    title: 'Automated Email Marketing Workflow',
    description: 'A comprehensive n8n workflow that automates email marketing campaigns. Features include personalized email sending based on user behavior, CRM integration, automated triggers, and detailed analytics reporting.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    priceDisplay: '₹3,999',
    amount: 399900, // ₹3,999.00 in paise
  },
  {
    id: 'n8n-data-sync',
    title: 'Data Synchronization Workflow',
    description: 'A powerful n8n workflow that synchronizes data between multiple platforms including databases, APIs, and cloud services. Ensures data consistency across systems with error handling and retry logic.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    priceDisplay: '₹5,999',
    amount: 599900, // ₹5,999.00 in paise
  },
  {
    id: 'n8n-customer-onboarding',
    title: 'Customer Onboarding Automation',
    description: 'Complete customer onboarding workflow using n8n. Automatically handles new user registration, sends personalized welcome emails, creates accounts in various services, and tracks onboarding progress.',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=600&fit=crop',
    priceDisplay: '₹4,499',
    amount: 449900, // ₹4,499.00 in paise
  },
  {
    id: 'nextjs-ecommerce-template',
    title: 'Premium E-Commerce Template',
    description: 'A modern, fully-featured e-commerce website template built with Next.js 14 and TypeScript. Includes product catalog, shopping cart, payment integration, and admin dashboard.',
    imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800&h=600&fit=crop',
    priceDisplay: '₹11,999',
    amount: 1199900, // ₹11,999.00 in paise
  },
  {
    id: 'nextjs-portfolio-template',
    title: 'Stunning Portfolio Website Template',
    description: 'A beautiful portfolio website template with smooth animations, responsive design, and optimized performance. Built with Next.js, Framer Motion, and Tailwind CSS.',
    imageUrl: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
    priceDisplay: '₹7,999',
    amount: 799900, // ₹7,999.00 in paise
  },
  {
    id: 'nextjs-dashboard-template',
    title: 'Corporate Dashboard Template',
    description: 'An enterprise-level dashboard template for managing business operations. Features include analytics dashboards, reporting tools, user management interface, and real-time data visualization.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    priceDisplay: '₹14,999',
    amount: 1499900, // ₹14,999.00 in paise
  },
]

export default function ShopPage() {
  const [isRazorpayReady, setIsRazorpayReady] = useState(false)
  const [razorpayKeyId, setRazorpayKeyId] = useState<string | null>(null)

  // Fetch Razorpay key from server on mount
  useEffect(() => {
    // Try to get key from env first (client-side)
    const clientKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    
    if (clientKey) {
      setRazorpayKeyId(clientKey)
      console.log('✅ Razorpay key found in client env')
    } else {
      // If not available client-side, fetch from API
      fetch('/api/razorpay-key')
        .then((res) => res.json())
        .then((data) => {
          if (data.keyId) {
            setRazorpayKeyId(data.keyId)
            console.log('✅ Razorpay key fetched from API')
          } else {
            console.error('❌ Razorpay key not found:', data)
          }
        })
        .catch((error) => {
          console.error('❌ Error fetching Razorpay key:', error)
        })
    }
    
    // Check if Razorpay script is loaded
    waitForRazorpay().then((loaded) => {
      setIsRazorpayReady(loaded)
      if (!loaded) {
        console.error('Razorpay script failed to load. Make sure the script is included in layout.tsx')
      }
    })
  }, [])

  // Create the checkout handler
  const handleCheckout = async (product: Product) => {
    try {
      // Wait for Razorpay to be available
      const razorpayLoaded = await waitForRazorpay()
      if (!razorpayLoaded) {
        alert('Razorpay is still loading. Please wait a moment and try again.')
        console.error('Razorpay script not loaded after waiting')
        return
      }

      // Check if Razorpay key is available
      if (!razorpayKeyId) {
        alert('Razorpay is not configured. Please:\n1. Set NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.local\n2. Restart your development server\n3. Clear browser cache and reload')
        console.error('Razorpay key ID is not set')
        console.log('Debug: razorpayKeyId =', razorpayKeyId)
        return
      }

      // A. Create the order
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: product.amount }),
      })

      if (!orderRes.ok) {
        const errorData = await orderRes.json().catch(() => ({ error: 'Unknown error' }))
        console.error('Order creation failed:', errorData)
        alert(`Failed to create order: ${errorData.error || 'Unknown error'}`)
        return
      }

      const order = await orderRes.json()

      if (!order.id) {
        console.error('Order response missing ID:', order)
        alert('Error creating order. Order ID is missing.')
        return
      }

      // B. Configure Razorpay options
      const options = {
        key: razorpayKeyId, // Public Key
        amount: order.amount,
        currency: 'INR',
        name: 'My Portfolio Shop',
        description: `Purchase: ${product.title}`,
        order_id: order.id,
        
        // C. Define the payment handler
        handler: async function (response: any) {
          try {
            // D. Verify the payment
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              // Payment successful!
              // You could redirect to a success page here
              alert('Payment Successful! Your payment ID is ' + verifyData.paymentId)
              // Optionally redirect to success page
              // window.location.href = '/shop/success?payment_id=' + verifyData.paymentId
            } else {
              // Payment failed
              console.error('Payment verification failed:', verifyData)
              alert(`Payment verification failed: ${verifyData.error || 'Unknown error'}`)
            }
          } catch (error) {
            console.error('Error verifying payment:', error)
            alert('Error verifying payment. Please contact support with your payment ID: ' + response.razorpay_payment_id)
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
        },
        theme: {
          color: '#6366f1', // Indigo color matching the gradient theme
        },
        modal: {
          ondismiss: function () {
            // Handle modal dismissal
            console.log('Payment modal dismissed')
          },
        },
      }

      // E. Open the Razorpay modal
      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response)
        alert(`Payment failed: ${response.error?.description || 'Please try again'}`)
      })
      rzp.open()
    } catch (error: any) {
      console.error('Checkout error:', error)
      alert(`Failed to start checkout: ${error?.message || 'Unknown error'}. Please check the console for details.`)
    }
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
      <div className="w-full max-w-7xl">
        {/* Title */}
        <h1 className="text-5xl font-bold text-white tracking-tight text-center drop-shadow-lg">
          Shop My Projects
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-xl text-gray-200 text-center drop-shadow-md">
          Purchase my templates and workflows to accelerate your development.
        </p>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              description={product.description}
              imageUrl={product.imageUrl}
              priceDisplay={product.priceDisplay}
              onPurchase={() => handleCheckout(product)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
