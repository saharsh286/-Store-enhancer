import db from "../db.server"
import type { Prisma, CookieConsentSettings } from "@prisma/client"
import type { Session } from "@shopify/shopify-api"

export const PrismaCookieConsent = {

  get: async function (session: Session) {
    try {
      return await db.cookieConsentSettings.findUnique({
        where: { shop: session.shop },
      })
    } catch (error) {
      console.error("Error fetching cookie consent:", error)
      return null
    }
  },

  upsert: async function (data: Partial<CookieConsentSettings>, session: Session) {
    try {
      return await db.cookieConsentSettings.upsert({
        where: { shop: session.shop },
        update: data as Prisma.CookieConsentSettingsUpdateInput,
        create: {
          ...(data as Prisma.CookieConsentSettingsUncheckedCreateInput),
          shop: session.shop,
        },
      })
    } catch (error) {
      console.error("Error saving cookie consent:", error)
      throw error
    }
  },

}