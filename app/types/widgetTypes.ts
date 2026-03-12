import type {
    BackToTopSettings,
    CookieConsentSettings,
    StickyAddToCartSettings,
    WhatsAppChatSettings,
    CountryBlockerSettings
  } from "@prisma/client";
  
  export type BackToTopSettingsData = Omit<
  BackToTopSettings,
  "id" | "createdAt" | "updatedAt" | "shop"
>;
  
  export type WhatsappChatSettingsData = Omit<
    WhatsAppChatSettings,
    "id"  | "shop" | "createdAt" | "updatedAt"
  >;
  
  export type StickyAddToCartSettingsData = Omit<
    StickyAddToCartSettings,
    "id"  | "shop" | "createdAt" | "updatedAt"
  >;
  
  export type CookieBoxSettingsProps = Omit<
  CookieConsentSettings,
  "id" | "shop" | "createdAt" | "updatedAt"
>;
  
export type CountryBlockerSettingsData = Omit<
  CountryBlockerSettings,
  "id" | "shop" | "createdAt" | "updatedAt"
>;