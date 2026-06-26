import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message, session_id } = await req.json()

  const response = await fetch(
    process.env.N8N_WEBHOOK_URL!,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id }),
    }
  )

  if (!response.ok) {
    return NextResponse.json({ error: 'Erreur n8n' }, { status: 500 })
  }

  const raw = await response.text()
  let data: { reply?: string; output?: string; text?: string } = {}
  try {
    data = raw ? JSON.parse(raw) : {}
  } catch {
    console.error('Reponse n8n non-JSON:', raw)
  }

  return NextResponse.json({ reply: data.reply || data.output || data.text || "Je n'ai pas compris." })
}