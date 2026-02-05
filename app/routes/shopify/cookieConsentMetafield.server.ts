type CookieSettings = {
  enabled: boolean;
  message: string;
  acceptText: string;
  rejectText: string;
  position: string;
  color: string;
};

export async function saveCookieConsentMetafield({
  admin,
  settings,
}: {
  admin: any;
  settings: CookieSettings;
}) {
  /* 1️⃣ GET SHOP ID */
  const shopResponse = await admin.graphql(`
    query {
      shop {
        id
      }
    }
  `);

  const shopData = await shopResponse.json();
  const shopId = shopData?.data?.shop?.id;

  if (!shopId) {
    throw new Error("Shop ID not found");
  }

  /* 2️⃣ SAVE METAFIELD */
  await admin.graphql(
    `
    mutation SetCookieConsent($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
        }
        userErrors {
          message
        }
      }
    }
    `,
    {
      variables: {
        metafields: [
          {
            ownerId: shopId,
            namespace: "cookie_consent",
            key: "settings",
            type: "json",
            value: JSON.stringify(settings),
          },
        ],
      },
    },
  );
}
