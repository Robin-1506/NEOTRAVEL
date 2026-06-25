// emails/send.js
// NeoTravel — Envoi email via Gmail SMTP + Nodemailer
// Variables .env : GMAIL_USER + GMAIL_APP_PASSWORD (sans espaces)

require('dotenv').config();
const nodemailer = require('nodemailer');
const fs         = require('fs');
const path       = require('path');

// ── Connexion SMTP Gmail ──────────────────────
const transporter = nodemailer.createTransport({
  host:   'smtp.gmail.com',
  port:   465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ── Vérification connexion ────────────────────
async function verifyConnection() {
  try {
    await transporter.verify();
    console.log('✅ Connexion SMTP Gmail OK');
    return true;
  } catch (err) {
    console.error('❌ Connexion SMTP échouée :', err.message);
    console.error('→ Vérifier GMAIL_USER et GMAIL_APP_PASSWORD dans .env');
    return false;
  }
}

// ── Injection variables dans template ─────────
// Remplace {{prenom}} par "Marie" etc.
function injectVariables(html, variables) {
  return Object.entries(variables).reduce((result, [key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    return result.replace(regex, value ?? '');
  }, html);
}

// ── Chargement template HTML ──────────────────
function loadTemplate(templateName) {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template introuvable : ${templateName}.html`);
  }
  return fs.readFileSync(templatePath, 'utf-8');
}

// ── Fonction d'envoi générique ────────────────
async function send({ to, subject, templateName, variables }) {
  const rawHtml = loadTemplate(templateName);
  const html    = injectVariables(rawHtml, variables);
  const info    = await transporter.sendMail({
    from:    `"NeoTravel" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
  console.log(`📧 Email envoyé → ${to} | MessageId: ${info.messageId}`);
  return info;
}

// ── EMAIL 1 — Devis envoyé ────────────────────
// Déclenché : quand calculer_devis() retourne un résultat + PDF généré
// Relance planifiée après : J+3 (standard) ou J+2 (urgente DD_PRIORITAIRE/DD_URGENT)
async function sendDevis(to, variables) {
  return send({
    to,
    subject:      `Votre devis NeoTravel — Réf. ${variables.ref_devis}`,
    templateName: 'devis-envoye',
    variables,
  });
}

// ── EMAIL 2 — Relance 1 ───────────────────────
// Déclenché : J+2 (DD_PRIORITAIRE/DD_URGENT) ou J+3 (DD_NORMAL/DD_3MOISETPLUS)
async function sendRelance1(to, variables) {
  return send({
    to,
    subject:      `Votre devis NeoTravel — Avez-vous eu le temps d'y réfléchir ?`,
    templateName: 'relance-1',
    variables,
  });
}

// ── EMAIL 3 — Relance 2 — DERNIÈRE ───────────
// Déclenché : J+5 (urgent) ou J+7 (standard)
// Après : statut demande → clôturé, plus de relances
async function sendRelance2(to, variables) {
  return send({
    to,
    subject:      `Dernière relance — Votre devis NeoTravel expire bientôt`,
    templateName: 'relance-2',
    variables,
  });
}

// ── EMAIL 4 — Cas complexe / escalade HITL ───
// Déclenché : nb_passagers > 85 OU multi-véhicules OU trajet atypique
async function sendCasComplexe(to, variables) {
  return send({
    to,
    subject:      `Votre demande NeoTravel — Un conseiller vous contacte sous 24h`,
    templateName: 'cas-complexe',
    variables,
  });
}

// ── Router principal — appelé par n8n ─────────
// Payload depuis nœud Code n8n :
// { type: "devis"|"relance_1"|"relance_2"|"cas_complexe", to: "email", variables: {...} }
async function sendEmail({ type, to, variables }) {
  const handlers = {
    devis:        () => sendDevis(to, variables),
    relance_1:    () => sendRelance1(to, variables),
    relance_2:    () => sendRelance2(to, variables),
    cas_complexe: () => sendCasComplexe(to, variables),
  };
  if (!handlers[type]) {
    throw new Error(`Type inconnu : "${type}". Valides : ${Object.keys(handlers).join(', ')}`);
  }
  return handlers[type]();
}

module.exports = { sendEmail, sendDevis, sendRelance1, sendRelance2, sendCasComplexe, verifyConnection };

// ── TEST LOCAL — décommenter puis : node emails/send.js ──
/*
(async () => {
  await verifyConnection();
  await sendEmail({
    type: 'devis',
    to:   'ton.adresse.test@gmail.com',
    variables: {
      prenom: 'Marie', nom: 'Dupont',
      ref_devis: 'DEV-2026-001',
      ville_depart: 'Lyon', ville_destination: 'Annecy',
      date_depart: '14 juillet 2026',
      nb_passagers: '47',
      montant_ht: '1 389', tva: '139', montant_ttc: '1 528',
      date_validite: '14 août 2026',
      pdf_url: 'https://example.com/devis-DEV-2026-001.pdf',
    }
  });
})();
*/
