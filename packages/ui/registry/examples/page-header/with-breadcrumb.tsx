import { Button } from "@krizaka/ui/button";
import { PageHeader } from "@krizaka/ui/page-header";

// The breadcrumb is a slot: the product's own `<nav aria-label>`.
export default function PageHeaderWithBreadcrumb() {
  return (
    <PageHeader
      title="Payouts"
      description="Your earnings are paid every Monday to the account on file."
      actions={<Button variant="primary">Withdraw</Button>}
      breadcrumb={
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5">
            <li>
              <a href="#studio" className="hover:text-fg">
                Studio
              </a>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page">Payouts</li>
          </ol>
        </nav>
      }
    />
  );
}
