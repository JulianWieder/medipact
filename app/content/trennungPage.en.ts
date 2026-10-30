// app/content/trennungPage.en.ts
//
// English content for /en/scheidungsmediation (translated 30.10.2026 from
// trennungPage.de.ts). The shape must stay identical to trennungPage.de.ts
// so MarketingPageTemplate never needs to change. When the German copy
// changes, update this file in the same commit.
//
// Ratgeber articles and the cost calculator exist in German only — links to
// them say so in the label instead of pretending to be English pages.
// German legal terms (Familiengericht, § 114 FamFG, Versorgungsausgleich)
// are translated but keep the statute reference, because the service only
// covers divorces under German law.

import { trennungFactsEn } from "@/app/components/ui/DidYouKnowSection";

export const trennungPageContent = {
  eyebrow: "Separation & maintenance",

  title: "Divorce mediation online.",
  titleHighlight:
    "When a relationship ends, the open questions begin. Settle them fairly – instead of in court.",

  intro:
    "Separation and divorce are not only emotionally draining, they also call for concrete decisions: maintenance, childcare, finances. That is exactly what divorce mediation is for – a structured process that leads both sides to a workable arrangement, even when their ideas are far apart.",

  primaryCta: {
    label: "Assess your conflict",
    href: "#cta",
  },

  secondaryCta: {
    label: "Back to overview",
    href: "/konflikte",
  },

  featuresTitle: "Typical challenges",
  featuresIntro:
    "These are the points that most often make conflicts escalate or get stuck.",

  features: [
    {
      title: "Different expectations",
      text: "Both sides have clear expectations – but no shared basis for what a fair solution could look like.",
    },
    {
      title: "Emotions block the conversation",
      text: "Hurt and disappointment make it hard to talk calmly about maintenance or childcare.",
    },
    {
      title: "Pressure from time and money",
      text: "Financial uncertainty and decisions made in a hurry add even more pressure to the conflict.",
    },
    {
      title: "The children end up in the middle",
      text: "Childcare time becomes a bargaining chip, arrangements fall through at short notice. Children notice immediately – and adapt their behaviour to whatever causes the least trouble.",
    },
    {
      title: "Nobody has the full picture",
      text: "Accounts, insurance, pensions, loans: often one side has handled all of it for years. Without a shared set of figures, every discussion about fairness turns into a conversation about mistrust.",
    },
    {
      title: "Every step creates facts",
      text: "Who moves out, who splits the account, who goes to a lawyer first – much of this is hard to undo later. That is exactly why it pays to settle things before the first decisions are made.",
    },
  ],

  deepDive: {
    eyebrow: "Divorce mediation in detail",
    title: "Divorce mediation: what it settles – and what it doesn't",
    intro:
      "Divorce mediation is not a substitute for couples therapy and not legal advice. It is the process in which you settle the consequences of a separation yourselves instead of having them settled for you. The result is a divorce settlement agreement – a document that does the work at the family court that two lawyers would otherwise negotiate in dispute. These six topics come up almost every time.",
    items: [
      {
        title: "Child and spousal maintenance",
        text: "The amount follows tables and income – there is little to negotiate there. Everything around it is negotiable: how special needs are handled, what happens after a job change or illness, when the figures are recalculated. These are exactly the points court orders usually leave out, and they lead back to court later.",
      },
      {
        title: "Childcare and contact",
        text: "Residence, alternating or nest model is not a legal question but an everyday one: working hours, the way to school, holidays, sick days. Mediation produces a concrete parenting plan instead of an abstract contact arrangement – including how you will communicate with each other in future.",
      },
      {
        title: "The shared home",
        text: "Sell, take over, rent out or keep it until the children have left: each option has tax and financial consequences that can be calculated. Mediation puts the options side by side instead of each side pushing only its own.",
      },
      {
        title: "Accrued gains and pensions",
        text: "The pension rights adjustment (Versorgungsausgleich) generally goes through the court; the equalisation of accrued gains does not. Both depend on a complete statement of assets – and that is exactly where contested proceedings fail most often, because disclosure is forced rather than given.",
      },
      {
        title: "Debts and ongoing contracts",
        text: "Joint loans, leasing, insurance, phone contracts: the bank does not care about the separation, both remain liable. Who takes over which liability and how the other side is protected belongs in the agreement – not in a verbal arrangement.",
      },
      {
        title: "How you will deal with each other in future",
        text: "The most underestimated point. When there are children, the relationship does not end with the divorce, it only changes its form. Agreements on how and about what you communicate prevent more follow-up disputes than any maintenance clause.",
      },
    ],
    bulletsTitle: "When divorce mediation is the better first step",
    bullets: [
      "You want to separate, but not to fight for years – and you both know it.",
      "There are children, and you will inevitably keep meeting.",
      "A property, a business or pension savings are at stake.",
      "You want to know what it will cost before you start.",
      "Both sides are willing to disclose their figures.",
      "You are looking for an arrangement that will still work in five years.",
    ],
    note:
      "Important and often misunderstood: mediation does not replace the divorce. In Germany, a marriage can only be dissolved by the family court, and at least one lawyer is mandatory for the petition (§ 114 FamFG). What mediation replaces is the dispute over the consequences – and with it the second lawyer and the length of the proceedings. What you save is not the court, but the escalation. The cost calculator below works out what that means for your figures.",
    links: [
      { label: "Guide: The 5 phases of mediation (in German)", href: "/ratgeber/5-phasen-der-mediation" },
      { label: "Guide: Divorce with a mediator – costs (in German)", href: "/ratgeber/scheidung-mediator-kosten" },
      { label: "Guide: Proving the separation year (in German)", href: "/ratgeber/trennungsjahr-nachweisen" },
      { label: "Guide: Dividing assets in a divorce (in German)", href: "/ratgeber/vermoegensauseinandersetzung" },
      { label: "Guide: Separating from a narcissist (in German)", href: "/ratgeber/trennung-von-einem-narzissten" },
      { label: "Cost calculator: court or mediation? (in German)", href: "/kostenrechner?art=trennung" },
    ],
  },

  processTitle: "How medipact helps",
  process: [
    {
      title: "Clarify the situation",
      text: "Together you work out which topics really need to be settled – factually and emotionally.",
    },
    {
      title: "Make conversation possible",
      text: "A clear framework helps you talk to each other again – without escalation.",
    },
    {
      title: "Develop a solution",
      text: "The result is a fair, workable basis for your agreements.",
    },
  ],

  trustTitle: "Why this path makes sense",
  trustPoints: [
    {
      title: "Out of court",
      text: "Conflicts can often be resolved faster and at lower cost than in court.",
    },
    {
      title: "Self-determined",
      text: "The solution is not imposed, it is developed together.",
    },
    {
      title: "Lasting",
      text: "Agreements hold better because both sides stand behind them.",
    },
  ],

  didYouKnowFacts: trennungFactsEn,

  faqTitle: "Frequently asked questions about separation and divorce mediation",
  faqs: [
    {
      question: "What does mediation for separation and divorce cost?",
      answer:
        "At medipact, separation mediation costs a flat €299 per party for an uncontested divorce, €399 per party for the purely online process, €499 for the hybrid option with video sessions and €899 for the full service. The price does not depend on how many topics you settle – there is no hourly billing that gets more expensive with every escalation. Details in the price overview.",
    },
    {
      question: "Does mediation replace lawyers and the court?",
      answer:
        "No. In Germany, divorces are granted exclusively by the family court, and legal representation is required for that. Mediation settles the consequences – maintenance, childcare, assets, the home – and records them in an agreement that can be notarised. The court proceedings become much shorter and cheaper as a result, but they do not disappear.",
    },
    {
      question: "Is the agreement legally binding?",
      answer:
        "The final agreement is a binding contract. For certain arrangements – for example on the pension rights adjustment, on property or on post-marital maintenance – notarisation is also required for them to take effect. Have the agreement reviewed by a lawyer before you sign.",
    },
    {
      question: "Does mediation work if we can hardly talk to each other any more?",
      answer:
        "That is exactly what the online process is designed for. Each side first works through the structured case intake separately and in writing – you do not have to sit across from each other as long as that is not possible yet. Writing things down instead of reacting in the heat of the moment leads to more considered wording. Only then are the answers brought together.",
    },
    {
      question: "How good are the chances of success?",
      answer:
        "Surveys by mediation associations regularly report agreement rates of around 80 percent for family and divorce mediation. What matters is that it is voluntary: anyone who engages in mediation is already looking for a solution rather than a ruling. Arrangements people develop themselves are also renegotiated less often than those imposed by a court.",
    },
    {
      question: "When is mediation not the right path in a separation?",
      answer:
        "When violence, threats or stalking are part of the relationship's history, when one side is afraid to speak openly, or when there is well-founded suspicion that assets are being concealed. In those cases you need a protected legal framework, not a shared negotiating table.",
    },
  ],

  finalCtaTitle: "Settle the most important questions before things escalate.",
  finalCtaText:
    "Briefly describe your situation and get a first assessment of how you can proceed.",

  finalCta: {
    label: "Get started",
    href: "/kontakt",
  },
};
