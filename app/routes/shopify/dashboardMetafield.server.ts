export async function setBackToTopEnabled(admin: any, enabled: boolean) {
    console.log("🟡 setBackToTopEnabled CALLED with:", enabled);
  
    // 1️⃣ Get shop ID
    const shopRes = await admin.graphql(`
      query {
        shop { id }
      }
    `);
    const shopJson: any = await shopRes.json();
    const shopId = shopJson.data.shop.id;
  
    console.log("🏪 SHOP ID:", shopId);
  
    // 2️⃣ Read existing metafield
    const metaRes = await admin.graphql(`
      query {
        shop {
          metafield(namespace: "back_to_top", key: "settings") {
            id 
            value
          }
        }
      }
    `);
    const metaJson: any = await metaRes.json();
  
    console.log("📦 EXISTING METAFIELD RAW:", metaJson.data.shop.metafield);
  
    let settings = metaJson.data.shop.metafield
      ? JSON.parse(metaJson.data.shop.metafield.value)
      : {};
  
    console.log("⚙️ EXISTING SETTINGS PARSED:", settings);
  
    // 3️⃣ Only change enabled
    settings.enabled = enabled;
  
    console.log("✏️ UPDATED SETTINGS TO SAVE:", settings);
  
    // 4️⃣ Save back
    const saveRes = await admin.graphql(
      `
      mutation SetMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          userErrors { field message }
        }
      }
      `,
      {
        variables: {
          metafields: [
            {
              ownerId: shopId,
              namespace: "back_to_top",
              key: "settings",
              type: "json",
              value: JSON.stringify(settings),
            },
          ],
        },
      }
    );
  
    const saveJson: any = await saveRes.json();
  
    console.log("💾 SAVE RESULT:", saveJson);
    console.log("✅ setBackToTopEnabled DONE");
  }
  export async function setCookieConsentEnabled(admin: any, enabled: boolean) {
    console.log("🟡 setCookieConsentEnabled CALLED with:", enabled);
  
    const shopRes = await admin.graphql(`
      query { shop { id } }
    `);
    const shopJson: any = await shopRes.json();
    const shopId = shopJson.data.shop.id;
  
    const metaRes = await admin.graphql(`
      query {
        shop {
          metafield(namespace: "cookie_consent", key: "settings") {
            id
            value
          }
        }
      }
    `);
    const metaJson: any = await metaRes.json();
  
    console.log("📦 COOKIE METAFIELD RAW:", metaJson.data.shop.metafield);
  
    let settings = metaJson.data.shop.metafield
      ? JSON.parse(metaJson.data.shop.metafield.value)
      : {};
  
    console.log("⚙️ COOKIE SETTINGS BEFORE:", settings);
  
    settings.enabled = enabled;
  
    console.log("✏️ COOKIE SETTINGS AFTER:", settings);
  
    const saveRes = await admin.graphql(
      `
      mutation SetMetafield($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          userErrors { field message }
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
  
    const saveJson: any = await saveRes.json();
    console.log("💾 COOKIE SAVE RESULT:", saveJson);
  
    console.log("✅ setCookieConsentEnabled DONE");
  }
  