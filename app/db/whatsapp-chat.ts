import db from "../db.server"
import type { Prisma, WhatsAppChatSettings } from "@prisma/client"
import type { Session } from "@shopify/shopify-api"

export const PrismaWhatsappChat = {

  get: async function (session: Session) {
    try {
      return await db.whatsAppChatSettings.findUnique({
        where: { shop: session.shop },
      })
    } catch (error) {
      console.error("Error fetching WhatsApp chat settings:", error)
      return null
    }
  },

  upsert: async function (data: Partial<WhatsAppChatSettings>, session: Session) {
    try {
      return await db.whatsAppChatSettings.upsert({

        where: { shop: session.shop },

        update: data as Prisma.WhatsAppChatSettingsUpdateInput,

        create: {
          ...(data as Prisma.WhatsAppChatSettingsUncheckedCreateInput),

          shop: session.shop   // ✅ Only shop is required
        }

      })
    } catch (error) {
      console.error("Error saving WhatsApp chat settings:", error)
      throw error
    }
  },

}