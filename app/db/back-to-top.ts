import db from "../db.server";
import type { Prisma, BackToTopSettings } from "@prisma/client";
import type { Session } from "@shopify/shopify-api";

export const PrismaBackToTop = {

  async get(session: Session) {
    return await db.backToTopSettings.findUnique({
      where: { shop: session.shop },
    });
  },

  async upsert(data: Partial<BackToTopSettings>, session: Session) {
    return await db.backToTopSettings.upsert({
      where: { shop: session.shop },
      update: data as Prisma.BackToTopSettingsUpdateInput,
      create: {
        ...(data as Prisma.BackToTopSettingsUncheckedCreateInput),
        shop: session.shop,
      },
    });
  },

};