'use client'

import { useState } from 'react'

export default function Formulaire() {
    const [loading, setLoading] = useState(false)
    const [succes, setSucces] = useState(false)
    const [typeTrajet, setTypeTrajet] = useState('')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const form = e.currentTarget
        const options = []
        if ((form.elements.namedItem('option_guide') as HTMLInputElement).checked) options.push('guide')
        if ((form.elements.namedItem('option_nuit') as HTMLInputElement).checked) options.push('nuit_chauffeur')
        if ((form.elements.namedItem('option_peages') as HTMLInputElement).checked) options.push('peages')

        const data = {
            nom_prospect: (form.elements.namedItem('nom_prospect') as HTMLInputElement).value,
            prenom_prospect: (form.elements.namedItem('prenom_prospect') as HTMLInputElement).value,
            email: (form.elements.namedItem('email') as HTMLInputElement).value,
            telephone: (form.elements.namedItem('telephone') as HTMLInputElement).value,
            type_client: (form.elements.namedItem('type_client') as HTMLSelectElement).value,
            ville_depart: (form.elements.namedItem('ville_depart') as HTMLInputElement).value,
            ville_destination: (form.elements.namedItem('ville_destination') as HTMLInputElement).value,
            date_depart: (form.elements.namedItem('date_depart') as HTMLInputElement).value,
            date_retour: typeTrajet === 'aller-retour' ? (form.elements.namedItem('date_retour') as HTMLInputElement).value : '',
            nb_passagers: (form.elements.namedItem('nb_passagers') as HTMLInputElement).value,
            type_trajet: (form.elements.namedItem('type_trajet') as HTMLSelectElement).value,
            options: options.join(', '),
            date_demande: new Date().toISOString().split('T')[0],
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
            <div className="max-w-xl mx-auto bg-white rounded-xl shadow p-8">
                <h1 className="text-2xl font-semibold mb-6">Demande de transport</h1>
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nom</label>
                            <input name="nom_prospect" required className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Prénom</label>
                            <input name="prenom_prospect" required className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input name="email" type="email" required className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Téléphone</label>
                        <input name="telephone" className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Type de client</label>
                        <select name="type_client" required className="w-full border rounded-lg px-3 py-2 text-sm">
                            <option value="">-- Choisir --</option>
                            <option value="particulier">Particulier</option>
                            <option value="entreprise">Entreprise</option>
                            <option value="association">Association</option>
                            <option value="collectivite">Collectivité</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Ville de départ</label>
                            <input name="ville_depart" required className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Ville de destination</label>
                            <input name="ville_destination" required className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Type de trajet</label>
                        <select
                            name="type_trajet"
                            required
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                            onChange={(e) => setTypeTrajet(e.target.value)}
                        >
                            <option value="">-- Choisir --</option>
                            <option value="simple">Aller simple</option>
                            <option value="aller-retour">Aller-retour</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Date de départ</label>
                        <input name="date_depart" type="date" required className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>

                    {typeTrajet === 'aller-retour' && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Date de retour</label>
                            <input name="date_retour" type="date" required className="w-full border rounded-lg px-3 py-2 text-sm" />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Nombre de passagers</label>
                        <input name="nb_passagers" type="number" min="1" required className="w-full border rounded-lg px-3 py-2 text-sm" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Options</label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" name="option_guide" />
                                Guide / accompagnateur
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" name="option_nuit" />
                                Nuit chauffeur
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                <input type="checkbox" name="option_peages" />
                                Péages
                            </label>
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