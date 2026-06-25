import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const data = await req.json()

    const response = await fetch(
        `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_DEMANDES}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fields: {
                    nom_prospect: data.nom_prospect,
                    prenom_prospect: data.prenom_prospect,
                    email: data.email,
                    telephone: data.telephone,
                    type_client: data.type_client,
                    ville_depart: data.ville_depart,
                    ville_destination: data.ville_destination,
                    date_depart: data.date_depart,
                    ...(data.date_retour ? { date_retour: data.date_retour } : {}),
                    nb_passagers: parseInt(data.nb_passagers),
                    type_trajet: data.type_trajet,
                    options: data.options ? data.options.split(', ').filter(Boolean) : [],
                    date_demande: data.date_demande,
                    statut: 'nouveau',
                },
            }),
        }
    )

    if (!response.ok) {
        const error = await response.json()
        console.error('Erreur Airtable complète:', JSON.stringify(error, null, 2))
        console.error('URL appelée:', `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_DEMANDES}`)
        console.error('Clé API (5 premiers caractères):', process.env.AIRTABLE_API_KEY?.slice(0, 5))
        return NextResponse.json({ error: 'Erreur Airtable' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}