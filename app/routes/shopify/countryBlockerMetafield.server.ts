// app/routes/shopify/countryBlockerMetafield.server.ts

type CountryBlockerSettings = {
    enabled: boolean;
    mode: string;
    countryCodes: string[];
    message: string;
    alignment: string;
  };
  
  type SaveCountryBlockerMetafieldParams = {
    admin: any; // You can later replace with proper Shopify Admin type
    settings: CountryBlockerSettings;
  };
  
  export async function saveCountryBlockerMetafield({
    admin,
    settings,
  }: SaveCountryBlockerMetafieldParams): Promise<boolean> {
    try {
      /* ===== GET SHOP GID ===== */
  
      const shopResponse = await admin.graphql(`
        query {
          shop {
            id 
          }
        }
      `);
  
      const shopJson = await shopResponse.json();
      const shopId = shopJson?.data?.shop?.id;
  
      if (!shopId) {
        console.error("❌ SHOP ID NOT FOUND");
        return false;
      }
  
      /* ===== SAVE METAFIELD ===== */
  
      const metafieldResponse = await admin.graphql(
        `
        mutation SetMetafield($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              id
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
                namespace: "country_blocker",
                key: "settings",
                type: "json",
                value: JSON.stringify(settings),
              },
            ],
          },
        },
      );
  
      const metafieldJson = await metafieldResponse.json();
  
      const userErrors =
        metafieldJson?.data?.metafieldsSet?.userErrors || [];
  
      if (userErrors.length > 0) {
        console.error("❌ COUNTRY BLOCKER METAFIELD ERRORS:", userErrors);
        return false;
      }
  
      console.log("✅ COUNTRY BLOCKER METAFIELD SAVED");
      return true;
  
    } catch (error) {
      console.error("❌ COUNTRY BLOCKER METAFIELD EXCEPTION:", error);
      return false;
    }
  }