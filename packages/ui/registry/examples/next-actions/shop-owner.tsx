import { NextActions } from "@krizaka/ui/next-actions";

export default function ShopOwner() {
  return <NextActions title="Que faire maintenant" actions={[{ id: "invoice", title: "Relancer une facture", why: "Elle est échue depuis cinq jours.", urgency: "high", urgencyLabel: "Urgent", action: <a href="/invoices/41">Voir la facture</a> }, { id: "stock", title: "Commander du stock", why: "Il reste moins d’une semaine de produits.", urgency: "medium", urgencyLabel: "Bientôt", action: <button type="button">Préparer la commande</button> }, { id: "close", title: "Fermer le mois", why: "Les ventes sont prêtes à être vérifiées.", urgency: "low", urgencyLabel: "Quand possible", action: <code>shop close-month</code> }]} />;
}
