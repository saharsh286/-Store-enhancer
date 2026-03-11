import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useActionData } from "react-router";
import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { PrismaStickyAddToCart } from "app/db/sticky-add-to-cart";
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

  const settings = await PrismaStickyAddToCart.get(session);

  return { settings };
};

/* ================= ACTION ================= */

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { session, admin } = await authenticate.admin(request);

    const formData = await request.formData();

    const parsedData = {
      enabled: formData.get("enabled") === "on",
      position: String(formData.get("position") || "bottom"),
      scrollPercentage: Number(formData.get("scrollPercentage") || 50),
      backgroundColor: String(formData.get("backgroundColor") || "#000000"),
      buttonColor: String(formData.get("buttonColor") || "#ffffff"),
      buttonText: String(formData.get("buttonText") || "Add to Cart"),
    };

    const dbRecords = {
      ...parsedData,
      shop: session.shop,
    };

    /* ================= DB SAVE ================= */

    await PrismaStickyAddToCart.upsert(dbRecords, session);

    /* ================= METAFIELD SAVE ================= */

    const { saveStickyAddToCartMetafield } =
      await import("./shopify/stickyAddToCartMetafield.server");

    await saveStickyAddToCartMetafield({
      admin,
      finalSettings: parsedData,
    });

    return { success: true, data: dbRecords };
  } catch (error) {
    console.error("Error saving sticky add to cart settings:", error);

    return {
      success: false,
      error: "Failed to save data",
    };
  }
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
      <Form action="." method="post" data-save-bar>
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
