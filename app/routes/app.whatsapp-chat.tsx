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
import WhatsAppPreview from "app/component/WhatsAppPreview";
  
//   import WhatsAppPreview from "../component/WhatsAppPreview";
  
  /* ================= ELEMENT TYPES ================= */
  
  type SwitchElement = HTMLElement & { checked: boolean };
  type TextFieldElement = HTMLElement & { value: string };
  
  /* ================= LOADER ================= */
  
  export const loader = async ({ request }: LoaderFunctionArgs) => {
    const { session } = await authenticate.admin(request);
    const shop = session.shop;
  
    const settings = await prisma.whatsAppChatSettings.upsert({
      where: { shop },
      update: {},
      create: {
        shop,
        enabled: true,
        phone: "+91",
        buttonLabel: "Chat with us",
        profileName: "Support",
        profileSubtitle: "Typically replies within minutes.",
        defaultMessage: "Hi there 👋 How can I help you?",
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
    const phone = String(formData.get("phone") || "");
    const buttonLabel = String(formData.get("buttonLabel") || "");
    const profileName = String(formData.get("profileName") || "");
    const profileSubtitle = String(formData.get("profileSubtitle") || "");
    const defaultMessage = String(formData.get("defaultMessage") || "");
  
    await prisma.whatsAppChatSettings.upsert({
      where: { shop },
      update: {
        enabled,
        phone,
        buttonLabel,
        profileName,
        profileSubtitle,
        defaultMessage,
      },
      create: {
        shop,
        enabled,
        phone,
        buttonLabel,
        profileName,
        profileSubtitle,
        defaultMessage,
      },
    });
  
    const { saveWhatsAppChatMetafield } =
      await import("./shopify/whatsappChatMetafield.server");
  
    await saveWhatsAppChatMetafield({
      admin,
      settings: {
        enabled,
        phone,
        buttonLabel,
        profileName,
        profileSubtitle,
        defaultMessage,
      },
    });
  
    return { success: true };
  };
  
  /* ================= PAGE ================= */
  
  export default function WhatsAppChatPage() {
    const { settings } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const app = useAppBridge();
  
    const [enabled, setEnabled] = useState<boolean>(settings.enabled);
    const [phone, setPhone] = useState<string>(settings.phone);
    const [buttonLabel, setButtonLabel] = useState<string>(settings.buttonLabel);
    const [profileName, setProfileName] = useState<string>(settings.profileName);
    const [profileSubtitle, setProfileSubtitle] = useState<string>(
      settings.profileSubtitle,
    );
    const [defaultMessage, setDefaultMessage] = useState<string>(
      settings.defaultMessage,
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
        <Form method="post" data-save-bar>
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
                      name="enabled"
                      label="Enable WhatsApp Chat"
                      checked={enabled}
                      onChange={(e: Event) =>
                        setEnabled(
                          (e.currentTarget as unknown as SwitchElement).checked,
                        )
                      }
                    />
  
                    <s-text-field
                      name="phone"
                      label="WhatsApp Number (with country code)"
                      value={phone}
                      onChange={(e: Event) =>
                        setPhone(
                          (e.currentTarget as unknown as TextFieldElement).value,
                        )
                      }
                    />
  
                    <s-text-field
                      name="buttonLabel"
                      label="Button Label"
                      value={buttonLabel}
                      onChange={(e: Event) =>
                        setButtonLabel(
                          (e.currentTarget as unknown as TextFieldElement).value,
                        )
                      }
                    />
  
                    <s-text-field
                      name="profileName"
                      label="Profile Name"
                      value={profileName}
                      onChange={(e: Event) =>
                        setProfileName(
                          (e.currentTarget as unknown as TextFieldElement).value,
                        )
                      }
                    />
  
                    <s-text-field
                      name="profileSubtitle"
                      label="Profile Subtitle"
                      value={profileSubtitle}
                      onChange={(e: Event) =>
                        setProfileSubtitle(
                          (e.currentTarget as unknown as TextFieldElement).value,
                        )
                      }
                    />
  
                    <s-text-field
                      name="defaultMessage"
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
  
              {/*  temp PREVIEW COLUMN */}
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