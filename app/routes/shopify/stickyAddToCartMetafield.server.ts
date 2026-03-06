// app/routes/shopify/stickyAddToCartMetafield.server.ts

export async function saveStickyAddToCartMetafield({
  admin,
  finalSettings,
}: {
  admin: any;
  finalSettings: any;
}) {
  try {
    console.log("====== METAFIELD SAVE START ======");
    console.log("FINAL SETTINGS RECEIVED:");
    console.log(JSON.stringify(finalSettings, null, 2));

    /* ================= GET SHOP GID ================= */
    const shopResponse = await admin.graphql(`
      query {
        shop {
          id
          name
        }
      }
    `);

    const shopJson = await shopResponse.json();

    console.log("SHOP QUERY RESPONSE:");
    console.log(JSON.stringify(shopJson, null, 2));

    const shopId = shopJson?.data?.shop?.id;

    if (!shopId) {
      console.error("❌ SHOP ID NOT FOUND");
      return;
    }

    console.log("✅ SHOP GID:", shopId);

    /* ================= SET METAFIELD ================= */
    const response = await admin.graphql(
      `
      mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            value
          }
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
              namespace: "store_enhancer",   // 🔥 IMPORTANT — MUST MATCH LIQUID
              key: "sticky_settings",        // 🔥 MUST MATCH LIQUID
              type: "json",
              value: JSON.stringify(finalSettings),
            },
          ],
        },
      }
    );

    const json = await response.json();

    console.log("METAFIELD MUTATION RESPONSE:");
    console.log(JSON.stringify(json, null, 2));

    if (json?.data?.metafieldsSet?.userErrors?.length > 0) {
      console.error("❌ USER ERRORS FOUND:");
      console.error(json.data.metafieldsSet.userErrors);
    } else {
      console.log("✅ METAFIELD SAVED SUCCESSFULLY");
    }

    console.log("====== METAFIELD SAVE END ======");

    return json;
  } catch (error) {
    console.error("❌ METAFIELD SAVE ERROR:");
    console.error(error);
    throw error;
  }
}
