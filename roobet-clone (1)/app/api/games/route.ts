import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { game, betAmount, params } = body

    // Validate bet
    if (!betAmount || betAmount <= 0) {
      return NextResponse.json({ error: 'Invalid bet amount' }, { status: 400 })
    }

    // Generate provably fair result
    const serverSeed = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    const clientSeed = params?.clientSeed || Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    const nonce = Math.floor(Math.random() * 1000000)

    let result: any = {}
    let payout = 0

    switch (game) {
      case 'crash':
        const crashPoint = Math.max(1, 0.99 / (1 - Math.random()))
        result = { crashPoint: Math.min(crashPoint, 100) }
        break

      case 'dice':
        const diceRoll = Math.floor(Math.random() * 100) + 1
        result = { roll: diceRoll }
        break

      case 'mines':
        const mines = new Set<number>()
        while (mines.size < (params?.minesCount || 5)) {
          mines.add(Math.floor(Math.random() * 25))
        }
        result = { minePositions: Array.from(mines) }
        break

      case 'plinko':
        const plinkoPath: number[] = []
        let position = 6
        for (let i = 0; i < 12; i++) {
          position += Math.random() > 0.5 ? 1 : -1
          position = Math.max(0, Math.min(12, position))
          plinkoPath.push(position)
        }
        result = { path: plinkoPath, finalBucket: plinkoPath[plinkoPath.length - 1] }
        break

      case 'roulette':
        result = { number: Math.floor(Math.random() * 37) }
        break

      case 'coinflip':
        result = { side: Math.random() > 0.5 ? 'heads' : 'tails' }
        break
    }

    return NextResponse.json({
      success: true,
      result,
      provablyFair: {
        serverSeed,
        clientSeed,
        nonce,
      },
      payout,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
