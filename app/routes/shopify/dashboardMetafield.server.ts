/* ================= BACK TO TOP ================= */
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

  let settings = metaJson.data.shop.metafield
    ? JSON.parse(metaJson.data.shop.metafield.value)
    : {};

  settings.enabled = enabled;

  // 3️⃣ Save back
  await admin.graphql(
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

  console.log("✅ setBackToTopEnabled DONE");
}


/* ================= COOKIE CONSENT ================= */
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

  let settings = metaJson.data.shop.metafield
    ? JSON.parse(metaJson.data.shop.metafield.value)
    : {};

  settings.enabled = enabled;

  await admin.graphql(
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

  console.log("✅ setCookieConsentEnabled DONE");
}


/* ================= STICKY ADD TO CART ================= */
export async function setStickyAddToCartEnabled(admin: any, enabled: boolean) {
  console.log("🟡 setStickyAddToCartEnabled CALLED with:", enabled);

  const shopRes = await admin.graphql(`
    query { shop { id } }
  `);
  const shopJson: any = await shopRes.json();
  const shopId = shopJson.data.shop.id;

  const metaRes = await admin.graphql(`
    query {
      shop {
        metafield(namespace: "sticky_add_to_cart", key: "settings") {
          id
          value
        }
      }
    }
  `);
  const metaJson: any = await metaRes.json();

  let settings = metaJson.data.shop.metafield
    ? JSON.parse(metaJson.data.shop.metafield.value)
    : {};

  settings.enabled = enabled;

  await admin.graphql(
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
            namespace: "sticky_add_to_cart",
            key: "settings",
            type: "json",
            value: JSON.stringify(settings),
          },
        ],
      },
    }
  );

  console.log("✅ setStickyAddToCartEnabled DONE");
}