import { Glossary } from "@krizaka/ui/glossary";

export default function ShopTerms() {
  return <Glossary title="Les mots du commerce" terms={[{ id: "gross", term: "Ventes TTC", definition: "Les ventes, toutes taxes comprises." }, { id: "margin", term: "Marge brute", definition: "Les ventes moins le coût des produits vendus." }]} />;
}
