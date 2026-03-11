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

import { PrismaCountryBlocker } from "app/db/country-blocker";
import CountryBlockerPreview from "../component/CountryBlockerPreview";

/* ================= ELEMENT TYPES ================= */

type SwitchElement = HTMLElement & { checked: boolean };
type TextFieldElement = HTMLElement & { value: string };
type SelectElement = HTMLElement & { value: string };

/* ================= LOADER ================= */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const settings = await PrismaCountryBlocker.get(session);

  return { settings };
};

/* ================= ACTION ================= */

export const action = async ({ request }: ActionFunctionArgs) => {
  try {
    const { session, admin } = await authenticate.admin(request);

    const formData = await request.formData();

    const countryCodesRaw = String(formData.get("countryCodes") || "");

    const parsedData = {
      enabled: formData.get("enabled") === "on",
      mode: String(formData.get("mode") || "block"),
      countryCodes: countryCodesRaw
        .split(",")
        .map((code) => code.trim().toUpperCase())
        .filter(Boolean),
      message: String(formData.get("message") || ""),
      alignment: String(formData.get("alignment") || "center"),
    };

    const dbRecords = {
      ...parsedData,
      shop: session.shop,
    };

    /* ================= DB SAVE ================= */

    await PrismaCountryBlocker.upsert(dbRecords, session);

    /* ================= METAFIELD SAVE ================= */

    const { saveCountryBlockerMetafield } =
      await import("./shopify/countryBlockerMetafield.server");

    await saveCountryBlockerMetafield({
      admin,
      settings: parsedData,
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving country blocker settings:", error);

    return {
      success: false,
      error: "Failed to save data",
    };
  }
};

/* ================= PAGE ================= */

export default function CountryBlockerPage() {
  const { settings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const app = useAppBridge();

  const safeSettings = settings ?? {
    enabled: false,
    mode: "block",
    countryCodes: [] as string[],
    message: "Sorry, your country is restricted.",
    alignment: "center",
  };

  const [enabled, setEnabled] = useState<boolean>(safeSettings.enabled);
  const [mode, setMode] = useState<string>(safeSettings.mode);
  const [countryCodes, setCountryCodes] = useState<string>(
    safeSettings.countryCodes.join(","),
  );
  const [message, setMessage] = useState<string>(safeSettings.message);
  const [alignment, setAlignment] = useState<string>(safeSettings.alignment);

  useEffect(() => {
    if (actionData?.success) {
      app.toast.show("Country Blocker settings saved");
    }
  }, [actionData, app]);

  return (
    <s-page heading="Country Blocker">
      <Form action="." method="post" data-save-bar>
        <s-stack direction="block" gap="large">
          <s-section>
            <s-stack direction="inline" gap="small" alignItems="center">
              <s-link href="/app">
                <s-button variant="tertiary">←</s-button>
              </s-link>

              <s-paragraph>
                Restrict access to your store based on visitor country.
              </s-paragraph>
            </s-stack>
          </s-section>

          <s-grid gridTemplateColumns="repeat(6, 1fr)" gap="small">
            {/* SETTINGS PANEL */}

            <s-grid-item gridColumn="span 2">
              <s-section heading="Widget Settings">
                <s-stack gap="base">
                  <s-switch
                    name="enabled"
                    label="Enable Country Blocker"
                    checked={enabled}
                    onChange={(e: Event) =>
                      setEnabled(
                        (e.currentTarget as unknown as SwitchElement).checked,
                      )
                    }
                  />

                  <s-select
                    name="mode"
                    label="Blocking Mode"
                    value={mode}
                    onChange={(e: Event) =>
                      setMode(
                        (e.currentTarget as unknown as SelectElement).value,
                      )
                    }
                  >
                    <s-option value="block">Block Selected Countries</s-option>
                    <s-option value="whitelist">
                      Whitelist Selected Countries
                    </s-option>
                  </s-select>

                  <s-text-field
                    name="countryCodes"
                    label="Country Codes (Comma Separated)"
                    value={countryCodes}
                    placeholder="Example: IN,US,CA"
                    help-text="Use ISO country codes separated by commas"
                    onChange={(e: Event) =>
                      setCountryCodes(
                        (e.currentTarget as unknown as TextFieldElement).value,
                      )
                    }
                  />

                  <s-text-field
                    name="message"
                    label="Inline Error Message"
                    value={message}
                    onChange={(e: Event) =>
                      setMessage(
                        (e.currentTarget as unknown as TextFieldElement).value,
                      )
                    }
                  />

                  <s-select
                    name="alignment"
                    label="Message Alignment"
                    value={alignment}
                    onChange={(e: Event) =>
                      setAlignment(
                        (e.currentTarget as unknown as SelectElement).value,
                      )
                    }
                  >
                    <s-option value="left">Left</s-option>
                    <s-option value="center">Center</s-option>
                    <s-option value="right">Right</s-option>
                  </s-select>
                </s-stack>
              </s-section>
            </s-grid-item>

            {/* PREVIEW */}

            <s-grid-item gridColumn="span 4">
              <s-section heading="Preview">
                <CountryBlockerPreview
                  settings={{
                    enabled,
                    message,
                    mode,
                    countryCodes,
                    alignment,
                  }}
                />
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
