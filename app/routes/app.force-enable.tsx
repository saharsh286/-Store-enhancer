import { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  console.log("🚀 Force enabling all widgets...");

  // Get shop ID
  const shopRes = await admin.graphql(`
    query {
      shop { id }
    }
  `);

  const shopJson: any = await shopRes.json();
  const shopId = shopJson.data.shop.id;

  await admin.graphql(
    `
    mutation SetMetafields($metafields: [MetafieldsSetInput!]!) {
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
            namespace: "back_to_top",
            key: "settings",
            type: "json",
            value: JSON.stringify({ enabled: true }),
          },
          {
            ownerId: shopId,
            namespace: "cookie_consent",
            key: "settings",
            type: "json",
            value: JSON.stringify({ enabled: true }),
          },
          {
            ownerId: shopId,
            namespace: "sticky_add_to_cart",
            key: "settings",
            type: "json",
            value: JSON.stringify({ enabled: true }),
          },
          {
            ownerId: shopId,
            namespace: "country_blocker",
            key: "settings",
            type: "json",
            value: JSON.stringify({ enabled: true }),
          },
        ],
      },
    }
  );

  console.log("✅ All widgets force enabled.");

  return new Response("All widgets enabled successfully.");
};

export default function Page() {
  return (
    <form method="post">
      <button type="submit">Force Enable All Widgets</button>
    </form>
  );
}