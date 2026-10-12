import { Button } from "@krizaka/ui/button";
import { Meter } from "@krizaka/ui/meter";
import { PricingPage } from "@krizaka/ui/pricing-page";

// TEMPLATE — plans and credits (Orazaka): the plans side by side, the featured one lifted; the comparison scrolls on a
// phone; what a credit buys; the questions people ask, folded.
export default function PricingPageCredits() {
  return (
    <PricingPage
      brand="orazaka"
      eyebrow="Pricing"
      title="Pay once for what was done"
      lead="Credits buy answers, images and minutes of video — never a seat you do not use."
      plansLabel="Plans"
      plans={[
        { id: "community", name: "Community", price: "Free", unit: "self-hosted", features: ["Every feature", "Your hardware"], action: <Button variant="secondary" shape="cut" className="w-full">Install</Button> },
        { id: "workspace", name: "Workspace", price: "CA$29", unit: "per month · 12,000 credits", features: ["Packs & Studios", "Shared workspaces"], featured: true, badge: "Most chosen", action: <Button variant="primary" shape="cut" shimmer className="w-full">Choose Workspace</Button> },
        { id: "sovereign", name: "Sovereign", price: "Custom", unit: "on your servers", features: ["Installed with you", "A named engineer"], action: <Button variant="secondary" shape="cut" className="w-full">Talk to us</Button> },
      ]}
      compare={{
        caption: "Compare the plans",
        columns: ["Community", "Workspace", "Sovereign"],
        rows: [
          { feature: "Local models", cells: ["✓", "✓", "✓"] },
          { feature: "Shared workspaces", cells: ["—", "✓", "✓"] },
          { feature: "Support", cells: ["Community", "Email", "Named engineer"] },
        ],
      }}
      credits={{ title: "What a credit buys", children: <div className="max-w-md"><Meter label="Credits this month" value={3800} max={12000} valueText="3,800 of 12,000 used" showLabel /><p className="mt-3 text-sm text-fg-secondary">1 credit ≈ a chat answer · 4 an image · 30 a minute of video.</p></div> }}
      faq={{ title: "Questions", items: [{ question: "What happens when credits run out?", answer: "Nothing breaks: requests wait until the next month or a top-up." }, { question: "Do credits expire?", answer: "Unused credits roll over for one month." }] }}
    />
  );
}
