import db from "../db.server";
import type { Prisma, CountryBlockerSettings } from "@prisma/client";
import type { Session } from "@shopify/shopify-api";

export const PrismaCountryBlocker = {

  async get(session: Session) {
    return await db.countryBlockerSettings.findUnique({
      where: { shop: session.shop },
    });
  },

  async upsert(data: Partial<CountryBlockerSettings>, session: Session) {
    return await db.countryBlockerSettings.upsert({
      where: { shop: session.shop },
      update: data as Prisma.CountryBlockerSettingsUpdateInput,
      create: {
        ...(data as Prisma.CountryBlockerSettingsUncheckedCreateInput),
        shop: session.shop,
      },
    }); 
  },

};