'use client'

import { useState } from 'react'

export default function Formulaire() {
  const [loading, setLoading] = useState(false)
  const [succes, setSucces] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const data = {
      nom: (form.elements.namedItem('nom') as HTMLInputElement).value,
      prenom: (form.elements.namedItem('prenom') as HTMLInputElement).value,
    }

    const res = await fetch('/api/demande', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    setLoading(false)
    if (res.ok) setSucces(true)
  }

  if (succes) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-green-600 text-xl font-medium">Demande envoyée avec succès ✓</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-600 py-12 px-4 text-black">
      <div className="max-w-xl mx-auto bg-gray-50 rounded-xl shadow p-8">
        <h1 className="text-2xl font-semibold mb-6">Demande de transport</h1>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input name="nom" required className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prénom</label>
              <input name="prenom" required className="w-full border rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-lg py-2.5 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
          </button>

        </form>
      </div>
    </div>
  )
}