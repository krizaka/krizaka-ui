import { Card } from "@krizaka/ui/card";
import { Doodle } from "@krizaka/ui/doodle";
import { Page } from "@krizaka/ui/page";
import { Stuck } from "@krizaka/ui/stuck";

// In the page margin, beside the block, from 1360 px; below that the doodles are not displayed.
export default function DoodleMargin() {
  return (
    <Page size="full">
      <Stuck className="w-full" hold="tape-corners" seed="margin" doodle={<><Doodle kind="arrow" top="16px" /><Doodle kind="star" side="right" top="40px" /></>}>
        <Card.Root className="p-5">
          <p className="m-0">Nothing here depends on the doodles: they are only a margin note drawn by hand.</p>
        </Card.Root>
      </Stuck>
    </Page>
  );
}
