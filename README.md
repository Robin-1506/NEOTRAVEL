This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Module Emails (P5 — feature/emails)

Gère l'envoi des emails transactionnels (devis, relances, escalade HITL) via Gmail SMTP + Nodemailer. Aucun calcul ni décision métier ici — ce module envoie uniquement ce qu'on lui demande.

### Variables d'environnement requises

```bash
GMAIL_USER=adresse.gmail.du.groupe@gmail.com
GMAIL_APP_PASSWORD=app_password_16_caracteres_sans_espaces
```

Voir `.env.example` pour la liste complète. Le mot de passe est un **App Password Gmail** (16 caractères, sans espaces), pas le mot de passe du compte.

### Commandes

```bash
npm run test:email   # vérifie la connexion SMTP
npm run test:send    # envoie un email de test (décommenter le bloc en bas de emails/send.js)
```

### Architecture

```
emails/
├── templates/          # 4 templates HTML (devis, relance-1, relance-2, cas-complexe)
└── send.js             # connexion SMTP + injection de variables + router sendEmail()
```

`sendEmail({ type, to, variables })` est le point d'entrée appelé depuis n8n (nœud Code) avec `type` parmi `devis | relance_1 | relance_2 | cas_complexe`.

Voir [docs/passation.md](docs/passation.md) pour la documentation de passation complète (L3).
