import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message } = await req.json()

  const response = await fetch(
    process.env.N8N_WEBHOOK_URL!,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    }
  )

  if (!response.ok) {
    return NextResponse.json({ error: 'Erreur n8n' }, { status: 500 })
  }

  const data = await response.json()
  return NextResponse.json({ reply: data.reply || data.output || data.text || "Je n'ai pas compris." })
}