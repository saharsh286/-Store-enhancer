import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Form, useLoaderData, useActionData } from "react-router";
import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";

import { authenticate } from "../shopify.server";
import prisma from "app/db.server";

import CountryBlockerPreview from "../component/CountryBlockerPreview";

/* ================= ELEMENT TYPES ================= */

type SwitchElement = HTMLElement & { checked: boolean };
type TextFieldElement = HTMLElement & { value: string };
type SelectElement = HTMLElement & { value: string };

/* ================= LOADER ================= */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const settings = await prisma.countryBlockerSettings.upsert({
    where: { shop },
    update: {},
    create: {
      shop,
      enabled: false,
      mode: "block",
      countryCodes: [],
      message: "Sorry, your country is restricted.",
      alignment: "center",
    },
  });

  return { settings }; // ✅ NO json()
};

/* ================= ACTION ================= */

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;

  const formData = await request.formData();

  const countryCodesRaw = String(formData.get("countryCodes") || "");

  const finalSettings = {
    enabled: formData.get("enabled") === "on",
    mode: String(formData.get("mode") || "block"),
    countryCodes: countryCodesRaw
      .split(",")
      .map((code) => code.trim().toUpperCase())
      .filter(Boolean),
    message: String(formData.get("message") || ""),
    alignment: String(formData.get("alignment") || "center"),
  };

  /* ===== SAVE TO PRISMA ===== */

  await prisma.countryBlockerSettings.upsert({
    where: { shop },
    update: finalSettings,
    create: {
      shop,
      ...finalSettings,
    },
  });

  /* ===== SAVE METAFIELD (SEPARATE FILE) ===== */

  const { saveCountryBlockerMetafield } =
    await import("./shopify/countryBlockerMetafield.server");

  await saveCountryBlockerMetafield({
    admin,
    settings: finalSettings,
  });

  return { success: true };
};

/* ================= COMPONENT ================= */

export default function CountryBlockerPage() {
  const { settings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const app = useAppBridge();

  const [enabled, setEnabled] = useState(settings.enabled);
  const [mode, setMode] = useState(settings.mode);
  const [countryCodes, setCountryCodes] = useState(
    settings.countryCodes.join(","),
  );
  const [message, setMessage] = useState(settings.message);
  const [alignment, setAlignment] = useState(settings.alignment);

  useEffect(() => {
    if (actionData?.success) {
      app.toast.show("Country Blocker settings saved");
    }
  }, [actionData, app]);

  return (
    <s-page heading="Country Blocker">
      <Form method="post" data-save-bar>
        <s-stack direction="block" gap="large">
          {/* Description Section */}
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
                  {/* Enable */}
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

                  {/* Mode */}
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

                  {/* Country Codes */}
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

                  {/* Error Message */}
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

                  {/* Alignment */}
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

            {/* PREVIEW PANEL */}
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
