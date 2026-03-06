import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useActionData } from "react-router";
import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import prisma from "app/db.server";
import StickyAddToCartPreview from "../component/StickyAddToCartPreview";
/* ================= TYPES ================= */
type LoaderData = {
  settings: {
    shop: string;
    enabled: boolean;
    position: string;
    scrollPercentage: number;
    backgroundColor: string;
    buttonColor: string;
    buttonText: string;
  };
};

type ActionData = {
  success?: boolean;
};

/* ================= LOADER ================= */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  let settings = await prisma.stickyAddToCartSettings.findUnique({
    where: { shop },
  });

  // If settings don't exist, create default record
  if (!settings) {
    settings = await prisma.stickyAddToCartSettings.create({
      data: {
        shop,
        enabled: true,
        position: "bottom",
        scrollPercentage: 50,
        backgroundColor: "#000000",
        buttonColor: "#ffffff",
        buttonText: "Add to Cart", // ✅ ADD THIS
      },
    });
  }
  console.log("loader is working");
  return { settings };
};

/* ================= ACTION ================= */

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin, session } = await authenticate.admin(request);
  const shop = session.shop;

  console.log("===== ACTION STARTED =====");
  console.log("Shop:", shop);

  const formData = await request.formData();

  const finalSettings = {
    enabled: formData.get("enabled") === "on",
    position: String(formData.get("position")),
    scrollPercentage: Number(formData.get("scrollPercentage")),
    backgroundColor: String(formData.get("backgroundColor")),
    buttonColor: String(formData.get("buttonColor")),
    buttonText: String(formData.get("buttonText")).trim() || "Add to Cart",
  };

  console.log("FINAL SETTINGS:");
  console.log(JSON.stringify(finalSettings, null, 2));

  /* ================= SAVE TO PRISMA ================= */
  const prismaResult = await prisma.stickyAddToCartSettings.upsert({
    where: { shop },
    update: finalSettings,
    create: {
      shop,
      ...finalSettings,
    },
  });
  console.log("✅ PRISMA SAVE RESULT:");
  console.log(JSON.stringify(prismaResult, null, 2));

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
    return { success: false };
  }

  console.log("✅ SHOP GID:", shopId);

  /* ================= SAVE TO SHOPIFY METAFIELD ================= */
  const metafieldResponse = await admin.graphql(
    `
    mutation SetMetafield($metafields: [MetafieldsSetInput!]!) {
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
            namespace: "sticky_add_to_cart",
            key: "settings",
            type: "json",
            value: JSON.stringify(finalSettings),
          },
        ],
      },
    },
  );

  const metafieldJson = await metafieldResponse.json();

  console.log("METAFIELD RESPONSE:");
  console.log(JSON.stringify(metafieldJson, null, 2));

  if (metafieldJson?.data?.metafieldsSet?.userErrors?.length > 0) {
    console.error("❌ METAFIELD USER ERRORS:");
    console.error(metafieldJson.data.metafieldsSet.userErrors);
  } else {
    console.log("✅ METAFIELD SAVED SUCCESSFULLY");
  }

  console.log("===== ACTION END =====");

  return { success: true };
};

type SwitchElement = HTMLInputElement & { checked: boolean };
type SelectElement = HTMLSelectElement & { value: string };
type TextFieldElement = HTMLInputElement & { value: string };
type ColorFieldElement = HTMLInputElement & { value: string };
/* ================= PAGE ================= */

export default function StickyAddToCart() {
  const { settings } = useLoaderData() as LoaderData;
  const actionData = useActionData() as ActionData | undefined;
  const app = useAppBridge();
  const [buttonText, setButtonText] = useState(
    settings.buttonText || "Add to Cart",
  );

  const [enabled, setEnabled] = useState(settings.enabled);
  const [position, setPosition] = useState(settings.position);
  const [scrollPercentage, setScrollPercentage] = useState(
    settings.scrollPercentage,
  );
  const [backgroundColor, setBackgroundColor] = useState(
    settings.backgroundColor,
  );
  const [buttonColor, setButtonColor] = useState(settings.buttonColor);

  useEffect(() => {
    if (actionData?.success) {
      app.toast.show("Sticky Add To Cart settings saved");
    }
  }, [actionData, app]);
  const previewSettings = {
    enabled,
    position,
    backgroundColor,
    buttonColor,
    buttonText,
    scrollPercentage,
  };
  return (
    <s-page heading="Sticky Add To Cart">
      <Form method="post" data-save-bar>
        <s-stack gap="large">
          {/* ================= HEADER ================= */}
          <s-section>
            <s-stack direction="inline" gap="small" alignItems="center">
              <s-link href="/app">
                <s-button variant="tertiary">←</s-button>
              </s-link>

              <s-paragraph>
                Sticky Add To Cart keeps the product purchase button visible
                while customers scroll on the product page to improve
                conversions.
              </s-paragraph>
            </s-stack>
          </s-section>

          {/* ================= MAIN GRID ================= */}
          <s-grid gridTemplateColumns="repeat(6, 1fr)" gap="large">
            {/* LEFT SETTINGS PANEL */}
            <s-grid-item gridColumn="span 2">
              <s-section heading="Sticky Add To Cart Settings">
                <s-stack gap="base">
                  <s-switch
                    name="enabled"
                    label="Enable Sticky Add To Cart"
                    checked={enabled}
                    onChange={(e: Event) =>
                      setEnabled(
                        (e.currentTarget as unknown as SwitchElement).checked,
                      )
                    }
                  />

                  <s-select
                    name="position"
                    label="Bar Position"
                    value={position}
                    onChange={(e: Event) =>
                      setPosition(
                        (e.currentTarget as unknown as SelectElement).value,
                      )
                    }
                  >
                    <s-option value="bottom">Bottom</s-option>
                    <s-option value="top">Top</s-option>
                  </s-select>

                  <s-text-field
                    name="scrollPercentage"
                    label="Show After Scroll (%)"
                    value={String(scrollPercentage)}
                    onChange={(e: Event) =>
                      setScrollPercentage(
                        Number(
                          (e.currentTarget as unknown as TextFieldElement)
                            .value,
                        ),
                      )
                    }
                  />

                  <s-color-field
                    name="backgroundColor"
                    label="Bar Background Color"
                    value={backgroundColor}
                    onChange={(e: Event) =>
                      setBackgroundColor(
                        (e.currentTarget as unknown as ColorFieldElement).value,
                      )
                    }
                  />

                  <s-color-field
                    name="buttonColor"
                    label="Button Color"
                    value={buttonColor}
                    onChange={(e: Event) =>
                      setButtonColor(
                        (e.currentTarget as unknown as ColorFieldElement).value,
                      )
                    }
                  />

                  <s-text-field
                    name="buttonText"
                    label="Button Text"
                    value={buttonText}
                    onChange={(e: Event) =>
                      setButtonText(
                        (e.currentTarget as unknown as TextFieldElement).value,
                      )
                    }
                  />
                </s-stack>
              </s-section>
            </s-grid-item>
            {/* RIGHT PREVIEW PANEL */}
            <s-grid-item gridColumn="span 4">
              <s-section heading="Preview">
                <StickyAddToCartPreview settings={previewSettings} />
              </s-section>
            </s-grid-item>
          </s-grid>
        </s-stack>
      </Form>
    </s-page>
  );
}
