import { workflow, node, trigger, ifElse, splitInBatches, nextBatch, newCredential, expr } from '@n8n/workflow-sdk';

const BASE_ID = 'appdDb5iByVFcctce';
const TBL_RELANCES = 'tblfrQKAyUOgBDzf1';
const TBL_DEVIS = 'tbl59QMw8Ks6K8aRm';
const TBL_DEMANDES = 'tblbUmKumFNflJe1s';

const scheduleTrigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.3,
  config: {
    name: 'Toutes les heures',
    parameters: { rule: { interval: [{ field: 'hours', hoursInterval: 1 }] } }
  },
  output: [{}]
});

const searchDueRelances = node({
  type: 'n8n-nodes-base.airtable',
  version: 2.2,
  credentials: { airtableTokenApi: newCredential('Airtable Personal Access Token account') },
  config: {
    name: 'Relances dues',
    parameters: {
      resource: 'record',
      operation: 'search',
      base: { __rl: true, mode: 'id', value: BASE_ID },
      table: { __rl: true, mode: 'id', value: TBL_RELANCES },
      filterByFormula: 'AND({statut} = "planifiée", OR(IS_BEFORE({date_planifiée}, NOW()), IS_SAME({date_planifiée}, TODAY(), "day")))',
      returnAll: true,
      options: {}
    }
  },
  output: [{ id: 'recRelance1', id_relance: 1, Devis: ['recDevis1'], type_relance: 'J+3', date_planifiée: '2026-06-25', statut: 'planifiée', email_destinataire: 'prospect@example.com', email_sujet: '', email_corps: '' }]
});

const loopRelances = splitInBatches({
  version: 3,
  config: { name: 'Boucle Relances', parameters: { batchSize: 1 } }
});

const getDevis = node({
  type: 'n8n-nodes-base.airtable',
  version: 2.2,
  credentials: { airtableTokenApi: newCredential('Airtable Personal Access Token account') },
  config: {
    name: 'Get Devis',
    parameters: {
      resource: 'record',
      operation: 'get',
      base: { __rl: true, mode: 'id', value: BASE_ID },
      table: { __rl: true, mode: 'id', value: TBL_DEVIS },
      id: expr('{{ $json.Devis[0] }}')
    }
  },
  output: [{ id: 'recDevis1', id_devis: 1, montant_ht: 1389, tva: 139, montant_ttc: 1528, date_validité: '2026-08-14', pdf_url: 'https://example.com/devis.pdf', nb_relances: 0, Demandes: ['recDemande1'] }]
});

const getDemande = node({
  type: 'n8n-nodes-base.airtable',
  version: 2.2,
  credentials: { airtableTokenApi: newCredential('Airtable Personal Access Token account') },
  config: {
    name: 'Get Demande',
    parameters: {
      resource: 'record',
      operation: 'get',
      base: { __rl: true, mode: 'id', value: BASE_ID },
      table: { __rl: true, mode: 'id', value: TBL_DEMANDES },
      id: expr('{{ $("Get Devis").item.json.Demandes[0] }}')
    }
  },
  output: [{ id: 'recDemande1', prenom_prospect: 'Marie', nom_prospect: 'Dupont', ville_depart: 'Lyon', ville_destination: 'Annecy', date_depart: '2026-07-14', nb_passagers: 47 }]
});

const isFirstRelance = ifElse({
  version: 2.3,
  config: {
    name: 'Premiere relance ?',
    parameters: {
      conditions: {
        options: { caseSensitive: true, leftValue: '', typeValidation: 'strict' },
        conditions: [{ leftValue: expr('{{ $("Get Devis").item.json.nb_relances }}'), operator: { type: 'number', operation: 'equals' }, rightValue: 0 }],
        combinator: 'and'
      }
    }
  }
});

const relance1Html =
  '<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">' +
  '<div style="background:#1a1a1a;color:#fff;padding:20px;text-align:center;font-weight:bold;letter-spacing:0.05em">NEOTRAVEL</div>' +
  '<div style="padding:24px">' +
  '<p>Bonjour {{ $("Get Demande").item.json.prenom_prospect }} {{ $("Get Demande").item.json.nom_prospect }},</p>' +
  '<p>Il y a quelques jours, nous vous avons envoyé un devis pour votre projet. Nous voulions prendre de vos nouvelles.</p>' +
  '<div style="border:1px solid #e0e0e0;border-radius:8px;padding:16px;background:#fafafa;margin:16px 0">' +
  '<p style="margin:4px 0"><strong>Trajet :</strong> {{ $("Get Demande").item.json.ville_depart }} → {{ $("Get Demande").item.json.ville_destination }}</p>' +
  '<p style="margin:4px 0"><strong>Date de départ :</strong> {{ $("Get Demande").item.json.date_depart }}</p>' +
  '<p style="margin:4px 0"><strong>Passagers :</strong> {{ $("Get Demande").item.json.nb_passagers }} personnes</p>' +
  '<p style="margin:8px 0 0;font-size:18px;font-weight:bold;color:#1D9E75;text-align:right">{{ $("Get Devis").item.json.montant_ttc }} € TTC</p>' +
  '</div>' +
  '<p style="text-align:center"><a href="{{ $(\"Get Devis\").item.json.pdf_url }}" style="display:inline-block;background:#1D9E75;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:600">Consulter mon devis PDF</a></p>' +
  '<p>Votre devis expire le {{ $("Get Devis").item.json.date_validité }}.</p>' +
  '<p>Cordialement,<br><strong>L\'équipe NeoTravel</strong></p>' +
  '</div></div>';

const relance2Html =
  '<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">' +
  '<div style="background:#1a1a1a;color:#fff;padding:20px;text-align:center;font-weight:bold;letter-spacing:0.05em">NEOTRAVEL</div>' +
  '<div style="padding:24px">' +
  '<p>Bonjour {{ $("Get Demande").item.json.prenom_prospect }} {{ $("Get Demande").item.json.nom_prospect }},</p>' +
  '<p>C\'est notre dernier rappel. Si votre projet a évolué, nous le comprenons.</p>' +
  '<div style="border:1px solid #e0e0e0;border-radius:8px;padding:16px;background:#fafafa;margin:16px 0">' +
  '<p style="margin:4px 0"><strong>Trajet :</strong> {{ $("Get Demande").item.json.ville_depart }} → {{ $("Get Demande").item.json.ville_destination }}</p>' +
  '<p style="margin:4px 0"><strong>Date de départ :</strong> {{ $("Get Demande").item.json.date_depart }}</p>' +
  '<p style="margin:4px 0"><strong>Passagers :</strong> {{ $("Get Demande").item.json.nb_passagers }} personnes</p>' +
  '<p style="margin:8px 0 0;font-size:18px;font-weight:bold;color:#1D9E75;text-align:right">{{ $("Get Devis").item.json.montant_ttc }} € TTC</p>' +
  '</div>' +
  '<p style="text-align:center"><a href="{{ $(\"Get Devis\").item.json.pdf_url }}" style="display:inline-block;background:#cc2929;color:#fff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:600">Accéder à mon devis</a></p>' +
  '<p>Après cette date, nous clôturerons votre dossier.</p>' +
  '<p>Cordialement,<br><strong>L\'équipe NeoTravel</strong></p>' +
  '</div></div>';

const sendRelance1 = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  credentials: { smtp: newCredential('Gmail SMTP NeoTravel') },
  config: {
    name: 'Envoyer Relance 1',
    parameters: {
      fromEmail: '"NeoTravel" <neotravel.devis@gmail.com>',
      toEmail: expr('{{ $("Relances dues").item.json.email_destinataire }}'),
      subject: "Votre devis NeoTravel — Avez-vous eu le temps d'y réfléchir ?",
      emailFormat: 'html',
      html: expr(relance1Html),
      options: { appendAttribution: false }
    }
  },
  output: [{ messageId: '<msg1@gmail.com>' }]
});

const sendRelance2 = node({
  type: 'n8n-nodes-base.emailSend',
  version: 2.1,
  credentials: { smtp: newCredential('Gmail SMTP NeoTravel') },
  config: {
    name: 'Envoyer Relance 2',
    parameters: {
      fromEmail: '"NeoTravel" <neotravel.devis@gmail.com>',
      toEmail: expr('{{ $("Relances dues").item.json.email_destinataire }}'),
      subject: 'Dernière relance — Votre devis NeoTravel expire bientôt',
      emailFormat: 'html',
      html: expr(relance2Html),
      options: { appendAttribution: false }
    }
  },
  output: [{ messageId: '<msg2@gmail.com>' }]
});

const updateRelanceEnvoyee1 = node({
  type: 'n8n-nodes-base.airtable',
  version: 2.2,
  credentials: { airtableTokenApi: newCredential('Airtable Personal Access Token account') },
  config: {
    name: 'Maj Relance envoyee (1)',
    parameters: {
      resource: 'record',
      operation: 'update',
      base: { __rl: true, mode: 'id', value: BASE_ID },
      table: { __rl: true, mode: 'id', value: TBL_RELANCES },
      columns: {
        mappingMode: 'defineBelow',
        matchingColumns: ['id'],
        value: {
          id: expr('{{ $("Relances dues").item.json.id }}'),
          statut: 'envoyée',
          date_envoyée: expr('{{ $now.toISO() }}')
        }
      },
      options: { typecast: true }
    }
  },
  output: [{ id: 'recRelance1', statut: 'envoyée' }]
});

const updateDevisNbRelances1 = node({
  type: 'n8n-nodes-base.airtable',
  version: 2.2,
  credentials: { airtableTokenApi: newCredential('Airtable Personal Access Token account') },
  config: {
    name: 'Maj Devis nb_relances (1)',
    parameters: {
      resource: 'record',
      operation: 'update',
      base: { __rl: true, mode: 'id', value: BASE_ID },
      table: { __rl: true, mode: 'id', value: TBL_DEVIS },
      columns: {
        mappingMode: 'defineBelow',
        matchingColumns: ['id'],
        value: { id: expr('{{ $("Get Devis").item.json.id }}'), nb_relances: 1 }
      },
      options: { typecast: true }
    }
  },
  output: [{ id: 'recDevis1', nb_relances: 1 }]
});

const updateRelanceEnvoyee2 = node({
  type: 'n8n-nodes-base.airtable',
  version: 2.2,
  credentials: { airtableTokenApi: newCredential('Airtable Personal Access Token account') },
  config: {
    name: 'Maj Relance envoyee (2)',
    parameters: {
      resource: 'record',
      operation: 'update',
      base: { __rl: true, mode: 'id', value: BASE_ID },
      table: { __rl: true, mode: 'id', value: TBL_RELANCES },
      columns: {
        mappingMode: 'defineBelow',
        matchingColumns: ['id'],
        value: {
          id: expr('{{ $("Relances dues").item.json.id }}'),
          statut: 'envoyée',
          date_envoyée: expr('{{ $now.toISO() }}')
        }
      },
      options: { typecast: true }
    }
  },
  output: [{ id: 'recRelance1', statut: 'envoyée' }]
});

const updateDevisNbRelances2 = node({
  type: 'n8n-nodes-base.airtable',
  version: 2.2,
  credentials: { airtableTokenApi: newCredential('Airtable Personal Access Token account') },
  config: {
    name: 'Maj Devis nb_relances (2)',
    parameters: {
      resource: 'record',
      operation: 'update',
      base: { __rl: true, mode: 'id', value: BASE_ID },
      table: { __rl: true, mode: 'id', value: TBL_DEVIS },
      columns: {
        mappingMode: 'defineBelow',
        matchingColumns: ['id'],
        value: { id: expr('{{ $("Get Devis").item.json.id }}'), nb_relances: 2 }
      },
      options: { typecast: true }
    }
  },
  output: [{ id: 'recDevis1', nb_relances: 2 }]
});

const updateDemandeCloture = node({
  type: 'n8n-nodes-base.airtable',
  version: 2.2,
  credentials: { airtableTokenApi: newCredential('Airtable Personal Access Token account') },
  config: {
    name: 'Maj Demande cloturee',
    parameters: {
      resource: 'record',
      operation: 'update',
      base: { __rl: true, mode: 'id', value: BASE_ID },
      table: { __rl: true, mode: 'id', value: TBL_DEMANDES },
      columns: {
        mappingMode: 'defineBelow',
        matchingColumns: ['id'],
        value: { id: expr('{{ $("Get Demande").item.json.id }}'), statut: 'clôturé' }
      },
      options: { typecast: true }
    }
  },
  output: [{ id: 'recDemande1', statut: 'clôturé' }]
});

export default workflow('relances-automatiques', 'Relances Automatiques NeoTravel')
  .add(scheduleTrigger)
  .to(searchDueRelances)
  .to(
    loopRelances.onEachBatch(
      getDevis.to(
        getDemande.to(
          isFirstRelance
            .onTrue(
              sendRelance1
                .to(updateRelanceEnvoyee1)
                .to(updateDevisNbRelances1)
                .to(nextBatch(loopRelances))
            )
            .onFalse(
              sendRelance2
                .to(updateRelanceEnvoyee2)
                .to(updateDevisNbRelances2)
                .to(updateDemandeCloture)
                .to(nextBatch(loopRelances))
            )
        )
      )
    )
  );
