# Documentation de passation — Module Emails (P5)

## 1. Pour un repreneur technique

### Ce que fait ce module
Le module `emails/` envoie les emails transactionnels du cycle commercial NeoTravel :
1. **Devis envoyé** — quand `calculer_devis()` a produit un résultat et que le PDF est généré
2. **Relance 1** — J+2 (urgent) ou J+3 (standard) si pas de réponse
3. **Relance 2** — J+5 (urgent) ou J+7 (standard), dernière relance
4. **Cas complexe** — escalade HITL (>85 passagers, multi-véhicules, trajet atypique)

### Ce que ce module NE fait PAS
- Il ne calcule aucun prix (voir le tool `calculer_devis()`, hors périmètre P5)
- Il ne décide pas quand envoyer un email — c'est l'orchestrateur n8n (Schedule Trigger + AI Agent) qui appelle `sendEmail()` au bon moment avec les bonnes variables
- Il ne stocke rien — chaque appel est sans état (stateless)

### Point d'entrée
```js
const { sendEmail } = require('./emails/send');

await sendEmail({
  type: 'devis',           // 'devis' | 'relance_1' | 'relance_2' | 'cas_complexe'
  to: 'prospect@email.com',
  variables: { prenom, nom, ref_devis, ville_depart, ville_destination,
               date_depart, nb_passagers, montant_ht, tva, montant_ttc,
               date_validite, pdf_url }
});
```

Depuis n8n : un nœud Code appelle ce module (ou reproduit la même logique côté SMTP natif n8n) avec un payload `{ type, to, variables }` construit à partir des tables Airtable `Devis` / `Demandes`.

### Variables d'environnement
| Variable | Description |
|---|---|
| `GMAIL_USER` | Adresse Gmail du groupe (expéditeur) |
| `GMAIL_APP_PASSWORD` | App Password Gmail 16 caractères, **sans espaces** (différent du mot de passe du compte) |

⚠️ Le fichier `.env` n'est jamais commité (voir `.gitignore`). Toujours partir de `.env.example`.

### Comment faire évoluer ce module
- **Ajouter un nouveau type d'email** : créer le template HTML dans `emails/templates/`, ajouter un handler dans `emails/send.js` (fonction `sendXxx` + entrée dans l'objet `handlers` de `sendEmail()`).
- **Changer une variable de template** : éditer le HTML (`{{nom_variable}}`) et s'assurer que l'appelant (n8n) passe bien cette clé dans `variables`.
- **Changer de fournisseur SMTP** : modifier uniquement la config `nodemailer.createTransport()` en haut de `send.js` — le reste du module ne change pas.

### Limites connues du prototype
- Pas de retry automatique en cas d'échec d'envoi (à ajouter côté n8n si besoin en prod)
- Pas de tracking d'ouverture/clic
- Templates HTML inline (pas de framework de templating type Handlebars/MJML) — suffisant pour le MVP mais à industrialiser si le projet continue après la soutenance

## 2. Pour les équipes NeoTravel (usage quotidien)

Les équipes commerciales n'interagissent **pas directement** avec ce module — il fonctionne en arrière-plan, déclenché automatiquement par le workflow n8n quand :
- un devis est calculé et généré → email de devis envoyé automatiquement
- un devis reste sans réponse au-delà du délai prévu → relance envoyée automatiquement
- une demande est trop complexe pour l'automatisation → email informant le prospect qu'un conseiller va le recontacter, **et notification interne au commercial assigné**

### Ce qu'un commercial doit savoir
- Chaque email envoyé est traçable dans la Table `Relances` (Airtable) : statut, date d'envoi, destinataire
- Maximum 2 relances par devis — après ça, le dossier passe automatiquement en statut `clôturé`
- Si un prospect répond directement à un email (devis ou relance), la réponse arrive sur la boîte Gmail du groupe (`neotravel.devis@gmail.com`) — pas de réponse automatique, c'est à un commercial de prendre le relais

### Que faire en cas de problème
- Email non reçu par un prospect : vérifier dans Airtable (Table Devis/Relances) si le statut indique "envoyée" — si oui, le problème est côté réception (spam, adresse invalide), pas côté système
- Échec de connexion SMTP : exécuter `npm run test:email` en local pour vérifier que le App Password Gmail est toujours valide (un mot de passe régénéré côté Google invalide l'ancien)
