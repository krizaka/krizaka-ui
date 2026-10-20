import { PageIndex } from "@krizaka/ui/page-index";

// A documentation's sidebar as a book's index: the current entry marked in the margin, the page numbers aligned.
export default function PageIndexDocs() {
  return (
    <PageIndex
      className="max-w-xs pl-6"
      groups={[
        {
          title: "Actions",
          entries: [
            { label: "Button", href: "/components/button", page: 42, current: true },
            { label: "Confirm button", href: "/components/confirm-button", page: 43 },
            { label: "Continue prompt", href: "/components/continue-prompt", page: 44 },
          ],
        },
        {
          title: "Inputs & forms",
          entries: [
            { label: "Checkbox", href: "/components/checkbox", page: 52 },
            { label: "Date picker", href: "/components/date-picker", page: 54 },
          ],
        },
      ]}
    />
  );
}
