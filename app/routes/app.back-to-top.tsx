import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";

import { Form, useLoaderData } from "react-router";
import { useActionData } from "react-router";
import { useEffect, useState } from "react";

import { useAppBridge } from "@shopify/app-bridge-react";

import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { PrismaBackToTop } from "app/db/back-to-top";
import { saveBackToTopMetafield } from "./shopify/backToTopMetafield.server";
import BackToTopPreview from "../component/BackToTopPreview";

/* ================= LOADER ================= */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const settings = await PrismaBackToTop.get(session);

  return { settings };
};

/* ================= ACTION ================= */
export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { session, admin } = await authenticate.admin(request);

    const formData = await request.formData();

    const parsedData = {
      enabled: formData.get("enabled") === "on",
      position: String(formData.get("position") || "bottom-right"),
      visibility: String(formData.get("visibility") || "optional"),
      color: String(formData.get("color") || "#000000"),
      animation: "fade",
    };

    const dbRecords = {
      ...parsedData,
      shop: session.shop,
    };

    // call DB service
    await PrismaBackToTop.upsert(dbRecords, session);

    await saveBackToTopMetafield({
      admin,
      settings: parsedData,
    });

    return { success: true };
  } catch (error) {
    console.error(error);

    return { success: false };
  }
};

/* ================= PAGE ================= */
/* ================= ELEMENT TYPES ================= */

type SwitchElement = HTMLElement & { checked: boolean };
type SelectElement = HTMLElement & { value: string };
type ChoiceListElement = HTMLElement & { value: string[] };
type ColorFieldElement = HTMLElement & { value: string };

/* ================= PAGE ================= */

export default function BackToTopPage() {
  const { settings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const app = useAppBridge();

  const safeSettings = settings ?? {
    enabled: true,
    position: "bottom-right",
    visibility: "optional",
    color: "#000000",
    animation: "fade",
  };

  const [enabled, setEnabled] = useState<boolean>(safeSettings.enabled);
  const [position, setPosition] = useState<string>(safeSettings.position);
  const [visibility, setVisibility] = useState<string>(safeSettings.visibility);
  const [color, setColor] = useState<string>(safeSettings.color);
  useEffect(() => {
    if (actionData?.success) {
      app.toast.show("Back to Top settings saved");
    }
  }, [actionData, app]);

  const previewSettings = {
    enabled,
    position,
    color,
    animation: "fade",
    visibility,
  };

  return (
    <s-page heading="Back to Top">
      <Form action="." method="post" data-save-bar>
        <s-stack direction="block" gap="large">
          <s-section>
            <s-stack direction="inline" gap="small" alignItems="center">
              <s-link href="/app">
                <s-button variant="tertiary">←</s-button>
              </s-link>

              <s-paragraph>
                The Back to Top widget adds a button that lets customers quickly
                return to the top of the page while scrolling.
              </s-paragraph>
            </s-stack>
          </s-section>

          <s-grid gridTemplateColumns="repeat(6, 1fr)" gap="small">
            {/* SETTINGS PANEL */}
            <s-grid-item gridColumn="span 2">
              <s-section heading="Widget Settings">
                {/* SWITCH */}
                <s-switch
                  name="enabled"
                  label="Enable Back to Top"
                  checked={enabled}
                  onChange={(e: Event) =>
                    setEnabled(
                      (e.currentTarget as unknown as SwitchElement).checked,
                    )
                  }
                />

                {/* SELECT */}
                <s-select
                  name="position"
                  label="Button position"
                  value={position}
                  onChange={(e: Event) =>
                    setPosition(
                      (e.currentTarget as unknown as SelectElement).value,
                    )
                  }
                >
                  <s-option value="bottom-right">Bottom Right</s-option>
                  <s-option value="bottom-left">Bottom Left</s-option>
                </s-select>

                {/* CHOICE LIST */}
                <s-choice-list
                  name="visibility"
                  label="Button visibility"
                  values={[visibility]}
                  onChange={(e: Event) =>
                    setVisibility(
                      (e.currentTarget as unknown as ChoiceListElement)
                        .value[0],
                    )
                  }
                >
                  <s-choice value="hidden">Hidden</s-choice>
                  <s-choice value="optional">Optional</s-choice>
                  <s-choice value="required">Required</s-choice>
                </s-choice-list>

                {/* COLOR */}
                <s-color-field
                  name="color"
                  label="Button color"
                  value={color}
                  onChange={(e: Event) =>
                    setColor(
                      (e.currentTarget as unknown as ColorFieldElement).value,
                    )
                  }
                />
              </s-section>
            </s-grid-item>

            {/* PREVIEW PANEL */}
            <s-grid-item gridColumn="span 4">
              <s-section heading="Preview">
                <BackToTopPreview settings={previewSettings} />
              </s-section>
            </s-grid-item>
          </s-grid>
        </s-stack>
      </Form>
    </s-page>
  );
}

/* ================= HEADERS ================= */
export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
