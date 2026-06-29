'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function Formulaire() {
    const [loading, setLoading] = useState(false)
    const [succes, setSucces] = useState(false)
    const [typeTrajet, setTypeTrajet] = useState('')
    const [guideChecked, setGuideChecked] = useState(false)
    const [nuitChecked, setNuitChecked] = useState(false)
    const [peagesChecked, setPeagesChecked] = useState(false)

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
            nb_jours_guide: guideChecked ? (form.elements.namedItem('nb_jours_guide') as HTMLInputElement).value : '0',
            nb_nuits_chauffeur: nuitChecked ? (form.elements.namedItem('nb_nuits_chauffeur') as HTMLInputElement).value : '0',
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
            <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 text-xl">✓</span>
                </div>
                <p className="text-gray-900 text-xl font-semibold">Demande envoyée avec succès</p>
                <p className="text-gray-500 text-sm">Nous reviendrons vers vous très prochainement.</p>
                <Link href="/">
                    <button className="mt-4 px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition">
                        Retour à l'accueil
                    </button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">
            {/* HEADER — identique à la page d'accueil */}
            <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
                <div className="font-bold text-xl tracking-tight">Neotravel</div>
                <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-500">
                    <a href="#" className="hover:text-gray-900">Services</a>
                    <a href="#" className="hover:text-gray-900">À propos</a>
                    <a href="#" className="hover:text-gray-900">Contact</a>
                </nav>
                <button className="px-4 py-2 border border-blue-200 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition">
                    Se connecter
                </button>
            </header>

            <main className="max-w-xl mx-auto px-4 py-12">
                {/* Lien retour vers le chat */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition">
                    <ArrowLeft className="w-4 h-4" />
                    Retour au chat
                </Link>

                <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Formulaire de demande</h1>
                <p className="text-sm text-gray-500 mb-8">Remplissez les informations ci-dessous et nous vous enverrons un devis rapidement.</p>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-gray-700">Nom</label>
                                <input name="nom_prospect" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-gray-700">Prénom</label>
                                <input name="prenom_prospect" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700">Email</label>
                            <input name="email" type="email" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700">Téléphone <span className="text-gray-400 font-normal">(facultatif)</span></label>
                            <input name="telephone" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700">Type de client</label>
                            <select name="type_client" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition bg-white">
                                <option value="">-- Choisir --</option>
                                <option value="particulier">Particulier</option>
                                <option value="entreprise">Entreprise</option>
                                <option value="association">Association</option>
                                <option value="collectivite">Collectivité</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-gray-700">Ville de départ</label>
                                <input name="ville_depart" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-gray-700">Ville de destination</label>
                                <input name="ville_destination" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700">Type de trajet</label>
                            <select
                                name="type_trajet"
                                required
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition bg-white"
                                onChange={(e) => setTypeTrajet(e.target.value)}
                            >
                                <option value="">-- Choisir --</option>
                                <option value="simple">Aller simple</option>
                                <option value="aller-retour">Aller-retour</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700">Date de départ</label>
                            <input name="date_depart" type="date" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition" />
                        </div>

                        {typeTrajet === 'aller-retour' && (
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-gray-700">Date de retour</label>
                                <input name="date_retour" type="date" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition" />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700">Nombre de passagers</label>
                            <input name="nb_passagers" type="number" min="1" required className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-300 transition" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700">Options <span className="text-gray-400 font-normal">(facultatif)</span></label>
                            <div className="space-y-3 mt-1">

                                <div>
                                    <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="option_guide"
                                            className="w-4 h-4 rounded border-gray-300"
                                            onChange={(e) => setGuideChecked(e.target.checked)}
                                        />
                                        Guide / accompagnateur
                                    </label>
                                    {guideChecked && (
                                        <div className="mt-2 ml-7">
                                            <label className="block text-xs text-gray-500 mb-1">Nombre de jours</label>
                                            <input
                                                name="nb_jours_guide"
                                                type="number"
                                                min="1"
                                                defaultValue={1}
                                                className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-300 transition"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="option_nuit"
                                            className="w-4 h-4 rounded border-gray-300"
                                            onChange={(e) => setNuitChecked(e.target.checked)}
                                        />
                                        Nuit chauffeur
                                    </label>
                                    {nuitChecked && (
                                        <div className="mt-2 ml-7">
                                            <label className="block text-xs text-gray-500 mb-1">Nombre de nuits</label>
                                            <input
                                                name="nb_nuits_chauffeur"
                                                type="number"
                                                min="1"
                                                defaultValue={1}
                                                className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-blue-300 transition"
                                            />
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="option_peages"
                                            className="w-4 h-4 rounded border-gray-300"
                                            onChange={(e) => setPeagesChecked(e.target.checked)}
                                        />
                                        Péages
                                    </label>
                                    <p className="text-xs text-gray-400 mt-1 ml-7">
                                        {peagesChecked
                                            ? "✓ Les péages seront inclus dans votre devis."
                                            : "Si non coché, les péages seront à régler directement le jour du trajet."}
                                    </p>
                                </div>

                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#1A528A] text-white rounded-xl py-3 text-sm font-medium hover:bg-blue-800 transition disabled:opacity-50 mt-2"
                        >
                            {loading ? 'Envoi en cours...' : 'Envoyer la demande'}
                        </button>

                    </form>
                </div>

                <p className="text-xs text-gray-400 text-center mt-6">
                    En continuant, vous acceptez nos CGU et notre Politique de confidentialité.
                </p>
            </main>
        </div>
    )
}