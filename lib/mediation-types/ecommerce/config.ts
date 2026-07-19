import { NewMediationConfig } from '../types'

export const ecommerceConfig: NewMediationConfig = {
  type: 'ecommerce',
  title: 'ODR – E-Commerce & Plattform',
  description:
    'Streit um Online-Käufe, Rücksendungen, Bewertungen oder Plattform-Konten digital beilegen – ohne Anwalt und Gericht.',
  mainHeading: 'E-Commerce- und Plattform-Streit online lösen',
  mainDescription:
    'Ob nicht gelieferte Ware, verweigerte Erstattung, gesperrtes Verkäuferkonto oder Streit um eine Bewertung: Dieses ODR-Verfahren bringt Käufer:in und Händler:in bzw. Plattform strukturiert an einen (virtuellen) Tisch. Gerade bei kleineren Streitwerten ist das schneller und günstiger als jeder Rechtsweg.',
  topics: [
    'Bestellung & Vertragsdaten',
    'Streitgegenstand',
    'Zahlungs- & Lieferstatus',
    'Kommunikationsverlauf',
    'Rückgabe & Erstattung',
    'Bewertungen & Konto',
    'Gewährleistung & Widerruf',
  ],
  relevantData: [
    {
      title: 'Bestellung & Beteiligte',
      fields: [
        'Wer sind die Parteien (Käufer:in, Shop, Plattform, Zahlungsdienst)?',
        'Bestellnummer, Datum, Kaufpreis',
        'Über welche Plattform / welchen Shop lief der Kauf?',
        'Privatkauf oder gewerblich?',
      ],
    },
    {
      title: 'Problem & Verlauf',
      fields: [
        'Was ist passiert (nicht geliefert, defekt, falsch beschrieben, Konto gesperrt)?',
        'Wie und wann wurde reklamiert?',
        'Wie hat die Gegenseite reagiert?',
        'Screenshots, E-Mails, Chat-Verläufe als Belege',
      ],
    },
    {
      title: 'Ziel',
      fields: [
        'Was soll erreicht werden (Erstattung, Ersatzlieferung, Entsperrung, Löschung einer Bewertung)?',
        'Bis wann brauchst du eine Lösung?',
        'Wärst du mit einer Teillösung einverstanden?',
      ],
    },
  ],
  steps: [
    {
      num: '01',
      title: 'Fall schildern',
      text: 'Bestellung, Problem und Belege strukturiert erfassen – die Gegenseite wird digital eingeladen.',
    },
    {
      num: '02',
      title: 'Positionen abgleichen',
      text: 'Beide Seiten legen ihre Sicht dar; die KI strukturiert Streitpunkte und Lösungsoptionen.',
    },
    {
      num: '03',
      title: 'Einigung festhalten',
      text: 'Erstattung, Ersatz oder andere Lösung wird als verbindliche Vereinbarung dokumentiert.',
    },
  ],
  formFields: [
    {
      id: 'beschreibung',
      label: 'Kurze Beschreibung des Problems',
      type: 'textarea',
      placeholder:
        'Beispiel: Online bestellte Möbel kamen beschädigt an. Der Shop reagiert seit drei Wochen nicht auf meine Reklamation, die Zahlung ist bereits abgebucht...',
    },
    {
      id: 'bestellung',
      label: 'Bestellung (Shop/Plattform, Datum, Betrag)',
      type: 'text',
      placeholder: 'z. B. Möbel-Shop XY, 12.06.2026, 899 €',
    },
    {
      id: 'dringlichkeit',
      label: 'Was ist aktuell am dringendsten?',
      type: 'text',
      placeholder: 'z. B. Erstattung, Ersatzlieferung, Konto entsperren',
      mapTo: 'priority',
    },
    {
      id: 'belege',
      label: 'Welche Belege hast du?',
      type: 'textarea',
      placeholder: 'z. B. Bestellbestätigung, Fotos der Ware, E-Mail-/Chat-Verlauf, Zahlungsnachweis...',
    },
  ],
  disclaimer: {
    title: 'Schnelle Lösung statt langer Streit',
    text: 'Dieses Verfahren ersetzt keine Rechtsberatung. Gesetzliche Rechte (Widerruf, Gewährleistung, Chargeback-Fristen) bleiben unberührt – bei laufenden Fristen ggf. parallel absichern.',
  },
}
