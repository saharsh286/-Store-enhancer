export async function saveWhatsAppChatMetafield({
  admin,
  settings,
}: {
  admin: any;
  settings: any;
}) {
  try {
    console.log("========== WHATSAPP METAFIELD SAVE START ==========");

    /* ================= SETTINGS RECEIVED ================= */

    console.log("📦 Settings received from action:");
    console.log(JSON.stringify(settings, null, 2));

    /* ================= GET SHOP GID ================= */

    const shopQuery = `
      query GetShopId {
        shop {
          id
          name
        }
      }
    `;

    const shopResponse = await admin.graphql(shopQuery);
    const shopData = await shopResponse.json();

    console.log("🏪 Shop query response:");
    console.log(JSON.stringify(shopData, null, 2));

    if (!shopData?.data?.shop?.id) {
      console.error("❌ Shop GID not found!");
      return;
    }

    const shopGid = shopData.data.shop.id;

    console.log("✅ Shop GID:", shopGid);

    /* ================= PREPARE METAFIELD ================= */

    const metafieldPayload = {
      ownerId: shopGid,
      namespace: "whatsapp_chat",
      key: "settings",
      type: "json",
      value: JSON.stringify(settings),
    };

    console.log("📝 Metafield payload:");
    console.log(JSON.stringify(metafieldPayload, null, 2)); 

    /* ================= SET METAFIELD ================= */

    const mutation = `
      mutation SetWhatsAppMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields {
            id
            namespace
            key
            type
            value
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const response = await admin.graphql(mutation, {
      variables: {
        metafields: [metafieldPayload],
      },
    });

    const result = await response.json();

    console.log("📡 Metafield mutation response:");
    console.log(JSON.stringify(result, null, 2));

    if (result?.data?.metafieldsSet?.userErrors?.length > 0) {
      console.error("❌ Metafield userErrors:");
      console.log(
        JSON.stringify(result.data.metafieldsSet.userErrors, null, 2)
      );
    } else {
      console.log("✅ WhatsApp metafield saved successfully!");
    }

    console.log("========== WHATSAPP METAFIELD SAVE END ==========");
  } catch (error) {
    console.error("❌ WhatsApp metafield error:", error);
  }
}