import db from "../db.server";
import type { Prisma, StickyAddToCartSettings } from "@prisma/client";
import type { Session } from "@shopify/shopify-api";

export const PrismaStickyAddToCart = {

  get: async (session: Session): Promise<StickyAddToCartSettings | null> => {
    try {
      return await db.stickyAddToCartSettings.findUnique({
        where: { shop: session.shop },
      });
    } catch (error) {
      console.error("Error fetching sticky add to cart settings:", error);
      return null;
    }
  },

  upsert: async (
    data: Partial<StickyAddToCartSettings>,
    session: Session
  ): Promise<StickyAddToCartSettings> => {
    try {
      return await db.stickyAddToCartSettings.upsert({
        where: { shop: session.shop },

        update: data as Prisma.StickyAddToCartSettingsUpdateInput,

        create: {
          ...(data as Prisma.StickyAddToCartSettingsUncheckedCreateInput),
          shop: session.shop,
        },
      });
    } catch (error) {
      console.error("Error upserting sticky add to cart settings:", error);
      throw error;
    }
  },

};