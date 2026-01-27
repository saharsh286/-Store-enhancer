export async function saveCookieConsentMetafield({
    admin,
    settings,
  }: {
    admin: any;
    settings: {
      enabled: boolean;
      message: string;
      acceptText: string;
      rejectText: string;
      position: string;
      color: string;
    };
  }) {
    console.log("✅ saveCookieConsentMetafield CALLED");
  
    // 1️⃣ Get shop ID
    const shopRes = await admin.graphql(`
      query {
        shop {
          id
        }
      }
    `);
  
    const shopJson: any = await shopRes.json();
    const shopId = shopJson.data.shop.id;
  
    console.log("🏪 SHOP ID:", shopId);
  
    // 2️⃣ Save metafield
    const result = await admin.graphql(
      `
      mutation SetMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          userErrors {
            field
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
      }
    );
  
    const json = await result.json();
  
    console.log("🧾 METAFIELD SAVE RESULT:", JSON.stringify(json, null, 2));
  
    return json;
  }
  