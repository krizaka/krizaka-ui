import type { ComponentMeta } from "../meta";

export const meta = {
  title: "Component page",
  summary: "A component's page: its name, summary, status and platforms, the live preview, the import line, its sections, the related components aside.",
  status: "beta",
  category: "templates",
  platforms: "web",
  whenToUse: ["Each page of a design system's documentation.", "A kit's component in a product's docs."],
  whenNotToUse: [
    { when: "For an article without a preview.", use: "docs-article-page" },
    { when: "For the list of components.", use: "catalogue-page" },
  ],
  bestPractices: ["Generate it from the registry: the words live in the component's meta, never here.", "The first example is the preview; the others in their section.", "Words and content arrive as props; the motion is the platform's (`[data-reveal]`, still under reduced motion)."],
  accessibility: {
    keyboard: [],
    notes: ["The name is the `h1`; each section is named by its `h2`.", "The import line has a copy button that says it copied."],
  },
  related: ["detail-layout", "code-block", "catalogue-page"],
  web: {
    imports: ["ComponentPage"],
    examples: [
      { name: "button", title: "Button", description: "The page of the Button, with its preview and its sections.", template: true, purpose: "explain", why: "A builder decides whether a component fits, sees it live and copies it, all on one page." },
    ],
  },
} satisfies ComponentMeta;
