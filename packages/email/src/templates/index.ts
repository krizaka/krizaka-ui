import { accountDeletion, commentReply, confirmEmail, dataExport, emailChange, passwordReset, signInLink } from "./accounts";
import { bookingReceipt } from "./booking";
import { contactAutoreply, contactNotification } from "./contact";
import { notification, verificationCode } from "./generic";
import { signupInvitation } from "./invitations";
import { newPost, newsletterConfirm, newsletterUnsubscribed, newsletterWelcome } from "./newsletter";
import { shareLink } from "./sharing";

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
  confirmEmail,
  passwordReset,
  emailChange,
  shareLink,
  bookingReceipt,
  signupInvitation,
  verificationCode,
  notification,
} as const;

export type TemplateId = keyof typeof templates;
export const TEMPLATE_IDS = Object.keys(templates) as TemplateId[];
