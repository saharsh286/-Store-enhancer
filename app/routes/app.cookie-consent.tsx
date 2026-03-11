import type {
  ActionFunctionArgs,
  HeadersFunction,
  LoaderFunctionArgs,
} from "react-router";

import { Form, useLoaderData, useActionData } from "react-router";
import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";

import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";

import { PrismaCookieConsent } from "app/db/cookie-consent";
import CookiePreview from "../component/CookiePreview";

/* ================= ELEMENT TYPES ================= */

type SwitchElement = HTMLElement & { checked: boolean };
type TextFieldElement = HTMLElement & { value: string };
type SelectElement = HTMLElement & { value: string };
type ColorFieldElement = HTMLElement & { value: string };

/* ================= LOADER ================= */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const settings = await PrismaCookieConsent.get(session);

  return { settings };
};

/* ================= ACTION ================= */

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { session, admin } = await authenticate.admin(request);

    const formData = await request.formData();

    const parsedData = {
      enabled: formData.get("enabled") === "on",
      message: String(formData.get("message") || ""),
      acceptText: String(formData.get("acceptText") || ""),
      rejectText: String(formData.get("rejectText") || ""),
      position: String(formData.get("position") || "bottom"),
      color: String(formData.get("color") || "#000000"),
    };

    const dbRecords = {
      ...parsedData,
      shop: session.shop,
    };

    /* ================= DB SAVE ================= */

    await PrismaCookieConsent.upsert(dbRecords, session);

    /* ================= METAFIELD SAVE ================= */

    const { saveCookieConsentMetafield } =
      await import("./shopify/cookieConsentMetafield.server");

    await saveCookieConsentMetafield({
      admin,
      settings: parsedData,
    });

    return { success: true };

  } catch (error) {
    console.error("Error saving cookie consent data:", error);

    return {
      success: false,
      error: "Failed to save data",
    };
  }
};

/* ================= PAGE ================= */

export default function CookieConsentPage() {
  const { settings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const app = useAppBridge();

  const safeSettings = settings ?? {
    enabled: true,
    message: "We use cookies to improve your experience.",
    acceptText: "Accept All",
    rejectText: "Reject",
    position: "bottom",
    color: "#FF0000",
  };

  const [enabled, setEnabled] = useState<boolean>(safeSettings.enabled);
  const [message, setMessage] = useState<string>(safeSettings.message);
  const [acceptText, setAcceptText] = useState<string>(safeSettings.acceptText);
  const [rejectText, setRejectText] = useState<string>(safeSettings.rejectText);
  const [position, setPosition] = useState<string>(safeSettings.position);
  const [color, setColor] = useState<string>(safeSettings.color);

  useEffect(() => {
    if (actionData?.success) {
      app.toast.show("Cookie consent settings saved");
    }
  }, [actionData, app]);

  const previewSettings = {
    enabled,
    message,
    acceptText,
    rejectText,
    position,
    color,
  };

  return (
    <s-page heading="Cookie Consent Banner">
      <Form action="." method="post" data-save-bar>
  <s-stack gap="large">

    <s-section>
      <s-stack direction="inline" gap="small" alignItems="center">
        <s-link href="/app">
          <s-button variant="tertiary">←</s-button>
        </s-link>

        <s-paragraph>
          Cookie Consent Banner helps you show a privacy notice to your
          customers and collect their consent before using cookies.
        </s-paragraph>
      </s-stack>
    </s-section>

    <s-grid gridTemplateColumns="repeat(6, 1fr)" gap="small">

      {/* SETTINGS PANEL */}

      <s-grid-item gridColumn="span 2" border="base" borderStyle="dashed">
        <s-section heading="Banner Settings">

          <s-stack gap="base">

            <s-switch
              name="enabled"
              label="Enable Cookie Banner"
              checked={enabled}
              onChange={(e: Event) =>
                setEnabled(
                  (e.currentTarget as unknown as SwitchElement).checked
                )
              }
            />

            <s-text-field
              name="message"
              label="Banner Message"
              value={message}
              onChange={(e: Event) =>
                setMessage(
                  (e.currentTarget as unknown as TextFieldElement).value
                )
              }
            />

            <s-text-field
              name="acceptText"
              label="Accept Button Text"
              value={acceptText}
              onChange={(e: Event) =>
                setAcceptText(
                  (e.currentTarget as unknown as TextFieldElement).value
                )
              }
            />

            <s-text-field
              name="rejectText"
              label="Reject Button Text"
              value={rejectText}
              onChange={(e: Event) =>
                setRejectText(
                  (e.currentTarget as unknown as TextFieldElement).value
                )
              }
            />

            <s-select
              name="position"
              label="Position"
              value={position}
              onChange={(e: Event) =>
                setPosition(
                  (e.currentTarget as unknown as SelectElement).value
                )
              }
            >
              <s-option value="bottom">Bottom</s-option>
              <s-option value="top">Top</s-option>
            </s-select>

            <s-color-field
              name="color"
              label="Banner Color"
              value={color}
              onChange={(e: Event) =>
                setColor(
                  (e.currentTarget as unknown as ColorFieldElement).value
                )
              }
            />

          </s-stack>

        </s-section>
      </s-grid-item>

      {/* PREVIEW */}

      <s-grid-item gridColumn="span 4">
        <s-section heading="Preview">
          <CookiePreview settings={previewSettings} />
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