import type {
    BackToTopSettings,
    CookieConsentSettings,
    StickyAddToCartSettings,
    WhatsAppChatSettings,
    CountryBlockerSettings
  } from "@prisma/client";
  
  export type BackToTopSettingsData = Omit<
    BackToTopSettings,
    "id" | "createdAt" | "updatedAt"
  >;
  
  export type WhatsappChatSettingsData = Omit<
    WhatsAppChatSettings,
    "id" | "createdAt" | "updatedAt"
  >;
  
  export type StickyAddToCartSettingsData = Omit<
    StickyAddToCartSettings,
    "id" | "createdAt" | "updatedAt"
  >;
  
  export type CookieBoxSettingsProps = Omit<
    CookieConsentSettings,
    "id" | "createdAt" | "updatedAt"
  >;
  
  export type CountryBlockerSettingsData = Omit<
    CountryBlockerSettings,
    "id" | "createdAt" | "updatedAt"
  >;