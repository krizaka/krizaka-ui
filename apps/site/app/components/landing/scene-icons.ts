/* The icons the home's scene can draw, by the name a rail item carries (lib/orazaka-nav.json for Orazaka, lib/home-scene.ts
   for the others): the signature icons of @krizaka/icons, picked by name so that the bundle holds only these. */

import {
  AuctionIcon, BillingIcon, ChatIcon, CheckIcon, ClockIcon, CreditsIcon, FlagIcon, HomeIcon, KnowledgeIcon, MessageIcon, PackIcon,
  PayoutIcon, SettingsIcon, StudioIcon, UsersIcon,
} from "@krizaka/icons";
import type { ComponentType } from "react";

export const SCENE_ICONS: Record<string, ComponentType<{ size?: number }>> = {
  AuctionIcon, BillingIcon, ChatIcon, CheckIcon, ClockIcon, CreditsIcon, FlagIcon, HomeIcon, KnowledgeIcon, MessageIcon, PackIcon,
  PayoutIcon, SettingsIcon, StudioIcon, UsersIcon,
};
