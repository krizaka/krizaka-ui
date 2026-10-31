import { Button, FallbackLink, Heading, Signature, Text } from "../components";
import { useEmail } from "../context";
import { baseSchema, httpsUrl, line } from "../schema";
import { defineTemplate } from "../template";

/**
 * The receipt of a booking, sent once it is confirmed: what was booked, when, with whom and where, the price as the screen showed it
 * (taxes included) and the cancellation rule for THAT visit. The app words the price line and the rule (one source for the screen and the mail);
 * this template only lays them out. The product is the brand it wears.
 */
export const bookingReceipt = defineTemplate({
  category: "transactional",
  schema: baseSchema.extend({
    /** The business that takes the visit. */
    businessName: line(120),
    serviceName: line(120),
    /** The day and time, already said in the business's time zone and the reader's language. */
    when: line(120),
    /** The person who takes the visit, when there is one. */
    who: line(80).optional(),
    /** Where it happens (an address, or the area for a visit at home). */
    where: line(200).optional(),
    /** The price as the screen shows it, taxes included when the business charges them. */
    priceLine: line(200),
    /** The cancellation rule for this visit: the free window, or that it has passed. */
    cancelRule: line(200),
    /** Where the person sees or cancels the booking. */
    manageUrl: httpsUrl,
  }),
  subject: (p, t) => t("bookingReceipt.subject", { service: p.serviceName, business: p.businessName }),
  preheader: (p, t) => t("bookingReceipt.preheader", { when: p.when }),
  why: (p, t) => t("bookingReceipt.why", { business: p.businessName }),
  Body: (p) => {
    const { t } = useEmail();
    return (
      <>
        <Heading>{t("bookingReceipt.heading")}</Heading>
        <Text>{t("bookingReceipt.body", { service: p.serviceName, business: p.businessName })}</Text>
        <Text>{t("bookingReceipt.when", { when: p.when })}</Text>
        {p.who ? <Text>{t("bookingReceipt.who", { who: p.who })}</Text> : null}
        {p.where ? <Text>{t("bookingReceipt.where", { where: p.where })}</Text> : null}
        <Text>{t("bookingReceipt.price", { price: p.priceLine })}</Text>
        <Text>{p.cancelRule}</Text>
        <Button href={p.manageUrl}>{t("bookingReceipt.button")}</Button>
        <FallbackLink href={p.manageUrl} />
        <Signature />
      </>
    );
  },
  example: { businessName: "Pattes Saint-Henri", serviceName: "Dog walk", when: "Tuesday, October 27 at 1 pm", who: "Karim", where: "4100 rue Notre-Dame O., Montréal QC", priceLine: "$40.00 + GST $2.00 + QST $3.99 = $45.99", cancelRule: "Free cancellation until 24 h before.", manageUrl: "https://dev.akinaza.com/en/account/bookings/example", brand: "akinaza" },
});
