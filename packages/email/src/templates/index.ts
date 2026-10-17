import { accountDeletion, commentReply, dataExport, signInLink } from "./accounts";
import { contactAutoreply, contactNotification } from "./contact";
import { newPost, newsletterConfirm, newsletterUnsubscribed, newsletterWelcome } from "./newsletter";

/** Every template of Krizaka's emails, by id. */
export const templates = {
  newsletterConfirm,
  newsletterWelcome,
  newPost,
  newsletterUnsubscribed,
  contactAutoreply,
  contactNotification,
  signInLink,
  commentReply,
  accountDeletion,
  dataExport,
} as const;

export type TemplateId = keyof typeof templates;
export const TEMPLATE_IDS = Object.keys(templates) as TemplateId[];
