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
import prisma from "app/db.server";

import CookiePreview from "../component/CookiePreview";

/* ================= ELEMENT TYPES ================= */

type SwitchElement = HTMLElement & { checked: boolean };
type TextFieldElement = HTMLElement & { value: string };
type SelectElement = HTMLElement & { value: string };
type ColorFieldElement = HTMLElement & { value: string };

/* ================= LOADER ================= */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const settings = await prisma.cookieConsentSettings.upsert({
    where: { shop },
    update: {},
    create: {
      shop,
      enabled: true,
      message: "We use cookies to improve your experience.",
      acceptText: "Accept All",
      rejectText: "Reject",
      position: "bottom",
      color: "#FF0000",
    },
  });

  return { settings };
};

/* ================= ACTION ================= */

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;

  const formData = await request.formData();

  const enabled = formData.get("enabled") === "on";
  const message = String(formData.get("message") || "");
  const acceptText = String(formData.get("acceptText") || "");
  const rejectText = String(formData.get("rejectText") || "");
  const position = String(formData.get("position") || "bottom");
  const color = String(formData.get("color") || "#000000");

  await prisma.cookieConsentSettings.upsert({
    where: { shop },
    update: {
      enabled,
      message,
      acceptText,
      rejectText,
      position,
      color,
    },
    create: {
      shop,
      enabled,
      message,
      acceptText,
      rejectText,
      position,
      color,
    },
  });

  console.log(
    "Cookies box data",
    await prisma.cookieConsentSettings.upsert({
      where: { shop },
      update: {
        enabled,
        message,
        acceptText,
        rejectText,
        position,
        color,
      },
      create: {
        shop,
        enabled,
        message,
        acceptText,
        rejectText,
        position,
        color,
      },
    }),
  );
  console.log("Cookies box data");

  const { saveCookieConsentMetafield } =
    await import("./shopify/cookieConsentMetafield.server");

  await saveCookieConsentMetafield({
    admin,
    settings: {
      enabled,
      message,
      acceptText,
      rejectText,
      position,
      color,
    },
  });

  console.log("Cookies box data check", saveCookieConsentMetafield);

  return { success: true };
};

/* ================= PAGE ================= */

export default function CookieConsentPage() {
  const { settings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const app = useAppBridge();

  const [enabled, setEnabled] = useState<boolean>(settings.enabled);
  const [message, setMessage] = useState<string>(settings.message);
  const [acceptText, setAcceptText] = useState<string>(settings.acceptText);
  const [rejectText, setRejectText] = useState<string>(settings.rejectText);
  const [position, setPosition] = useState<string>(settings.position);
  const [color, setColor] = useState<string>(settings.color);

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
      <Form method="post" data-save-bar>
        <s-stack gap="large">
          <s-section>
          <s-stack direction="inline" gap="small" alignItems="center">
              {/* BACK BUTTON FIRST */}
              <s-link href="/app">
                <s-button variant="tertiary">←</s-button>
              </s-link>

              {/* TEXT BLOCK */}
              <s-paragraph>
                Cookie Consent Banner helps you show a privacy notice to your
                customers and collect their consent before using cookies such as
                analytics and marketing scripts.
              </s-paragraph>
            </s-stack>
          </s-section>

          <s-grid gridTemplateColumns="repeat(6, 1fr)" gap="small">
            <s-grid-item gridColumn="span 2" border="base" borderStyle="dashed">
              <s-section heading="Banner Settings">
                <s-stack gap="base">
                  <s-switch
                    name="enabled"
                    label="Enable Cookie Banner"
                    checked={enabled}
                    onChange={(e: Event) =>
                      setEnabled(
                        (e.currentTarget as unknown as SwitchElement).checked,
                      )
                    }
                  />

                  <s-text-field
                    name="message"
                    label="Banner Message"
                    value={message}
                    onChange={(e: Event) =>
                      setMessage(
                        (e.currentTarget as unknown as TextFieldElement).value,
                      )
                    }
                  />

                  <s-text-field
                    name="acceptText"
                    label="Accept Button Text"
                    value={acceptText}
                    onChange={(e: Event) =>
                      setAcceptText(
                        (e.currentTarget as unknown as TextFieldElement).value,
                      )
                    }
                  />

                  <s-text-field
                    name="rejectText"
                    label="Reject Button Text"
                    value={rejectText}
                    onChange={(e: Event) =>
                      setRejectText(
                        (e.currentTarget as unknown as TextFieldElement).value,
                      )
                    }
                  />

                  <s-select
                    name="position"
                    label="Position"
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

                  <s-color-field
                    name="color"
                    label="Banner Color"
                    value={color}
                    onChange={(e: Event) =>
                      setColor(
                        (e.currentTarget as unknown as ColorFieldElement).value,
                      )
                    }
                  />
                </s-stack>
              </s-section>
            </s-grid-item>

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
