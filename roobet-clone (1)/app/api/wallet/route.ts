import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Address required' }, { status: 400 })
  }

  // Simulate balance fetching
  const balance = Math.random() * 10 + 0.1

  return NextResponse.json({
    address,
    balance,
    currency: 'ETH',
    transactions: [
      {
        id: '0x' + Math.random().toString(16).substr(2, 40),
        type: 'deposit',
        amount: Math.random() * 2,
        status: 'confirmed',
        timestamp: new Date().toISOString(),
      },
      {
        id: '0x' + Math.random().toString(16).substr(2, 40),
        type: 'withdrawal',
        amount: Math.random() * 1,
        status: 'confirmed',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
      },
    ]
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, amount, address } = body

    if (action === 'deposit') {
      // Simulate deposit
      return NextResponse.json({
        success: true,
        txHash: '0x' + Math.random().toString(16).substr(2, 64),
        amount,
        status: 'pending',
      })
    }

    if (action === 'withdraw') {
      // Simulate withdrawal
      return NextResponse.json({
        success: true,
        txHash: '0x' + Math.random().toString(16).substr(2, 64),
        amount,
        status: 'pending',
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
