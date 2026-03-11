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

import { PrismaWhatsappChat } from "app/db/whatsapp-chat";
import WhatsAppPreview from "app/component/WhatsAppPreview";
import { saveWhatsAppChatMetafield } from "./shopify/whatsappChatMetafield.server";

/* ================= ELEMENT TYPES ================= */

type SwitchElement = HTMLElement & { checked: boolean };
type TextFieldElement = HTMLElement & { value: string };

/* ================= LOADER ================= */

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);

  const settings = await PrismaWhatsappChat.get(session);

  return { settings };
};

/* ================= ACTION ================= */

export const action = async ({ request }: ActionFunctionArgs) => {

  const { session, admin } = await authenticate.admin(request);

  const formData = await request.formData();

  const parsedData = {
    enabled: formData.get("enabled") === "on",
    phone: String(formData.get("phone") || ""),
    buttonLabel: String(formData.get("buttonLabel") || ""),
    profileName: String(formData.get("profileName") || ""),
    profileSubtitle: String(formData.get("profileSubtitle") || ""),
    defaultMessage: String(formData.get("defaultMessage") || ""),
  };

  console.log("FORM DATA:", parsedData);

  const dbRecords = {
    ...parsedData,
    shop: session.shop,
  };

  await PrismaWhatsappChat.upsert(dbRecords, session);

  await saveWhatsAppChatMetafield({
    admin,
    settings: parsedData,
  });

  return { success: true };
};

/* ================= PAGE ================= */

export default function WhatsAppChatPage() {
  const { settings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const app = useAppBridge();

  const safeSettings = settings ?? {
    enabled: true,
    phone: "+91",
    buttonLabel: "Chat with us",
    profileName: "Support",
    profileSubtitle: "Typically replies within minutes.",
    defaultMessage: "Hi there 👋 How can I help you?",
  };

  const [enabled, setEnabled] = useState<boolean>(safeSettings.enabled);
  const [phone, setPhone] = useState<string>(safeSettings.phone);
  const [buttonLabel, setButtonLabel] = useState<string>(
    safeSettings.buttonLabel,
  );
  const [profileName, setProfileName] = useState<string>(
    safeSettings.profileName,
  );
  const [profileSubtitle, setProfileSubtitle] = useState<string>(
    safeSettings.profileSubtitle,
  );
  const [defaultMessage, setDefaultMessage] = useState<string>(
    safeSettings.defaultMessage,
  );

  useEffect(() => {
    if (actionData?.success) {
      app.toast.show("WhatsApp chat settings saved");
    }
  }, [actionData, app]);

  const previewSettings = {
    enabled,
    phone,
    buttonLabel,
    profileName,
    profileSubtitle,
    defaultMessage,
  };

  return (
    <s-page heading="WhatsApp Chat Widget">
      <Form action="." method="post" data-save-bar>
        {/* Hidden inputs ensure FormData always sends latest values */}

        <input type="hidden" name="enabled" value={enabled ? "on" : "off"} />
        <input type="hidden" name="phone" value={phone} />
        <input type="hidden" name="buttonLabel" value={buttonLabel} />
        <input type="hidden" name="profileName" value={profileName} />
        <input type="hidden" name="profileSubtitle" value={profileSubtitle} />
        <input type="hidden" name="defaultMessage" value={defaultMessage} />

        <s-stack gap="large">
          <s-section>
            <s-stack direction="inline" gap="small" alignItems="center">
              <s-link href="/app">
                <s-button variant="tertiary">←</s-button>
              </s-link>

              <s-paragraph>
                Add a WhatsApp chat button to your store and let customers
                contact you instantly.
              </s-paragraph>
            </s-stack>
          </s-section>

          <s-grid gridTemplateColumns="repeat(6, 1fr)" gap="small">
            {/* SETTINGS COLUMN */}

            <s-grid-item gridColumn="span 2" border="base" borderStyle="dashed">
              <s-section heading="WhatsApp Settings">
                <s-stack gap="base">
                  <s-switch
                    label="Enable WhatsApp Chat"
                    checked={enabled}
                    onChange={(e: Event) =>
                      setEnabled(
                        (e.currentTarget as unknown as SwitchElement).checked,
                      )
                    }
                  />

                  <s-text-field
                    label="WhatsApp Number (with country code)"
                    value={phone}
                    onChange={(e: Event) =>
                      setPhone(
                        (e.currentTarget as unknown as TextFieldElement).value,
                      )
                    }
                  />

                  <s-text-field
                    label="Button Label"
                    value={buttonLabel}
                    onChange={(e: Event) =>
                      setButtonLabel(
                        (e.currentTarget as unknown as TextFieldElement).value,
                      )
                    }
                  />

                  <s-text-field
                    label="Profile Name"
                    value={profileName}
                    onChange={(e: Event) =>
                      setProfileName(
                        (e.currentTarget as unknown as TextFieldElement).value,
                      )
                    }
                  />

                  <s-text-field
                    label="Profile Subtitle"
                    value={profileSubtitle}
                    onChange={(e: Event) =>
                      setProfileSubtitle(
                        (e.currentTarget as unknown as TextFieldElement).value,
                      )
                    }
                  />

                  <s-text-field
                    label="Default Message"
                    value={defaultMessage}
                    onChange={(e: Event) =>
                      setDefaultMessage(
                        (e.currentTarget as unknown as TextFieldElement).value,
                      )
                    }
                  />
                </s-stack>
              </s-section>
            </s-grid-item>

            {/* PREVIEW COLUMN */}

            <s-grid-item gridColumn="span 4">
              <s-section heading="Preview">
                <WhatsAppPreview settings={previewSettings} />
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
