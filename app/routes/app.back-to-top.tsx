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
import prisma from "app/db.server";

import { saveBackToTopMetafield } from "./shopify/backToTopMetafield.server";
import BackToTopPreview from "../component/BackToTopPreview";

/* ================= LOADER ================= */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const settings = {
    shop,
    enabled: true,
    position: "bottom-right",
    color: "#000000",
    animation: "fade",
    visibility: "optional",
  };

  return { settings };
};

/* ================= ACTION ================= */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;

  const formData = await request.formData();

  const enabled = formData.get("enabled") === "on";
  const position = String(formData.get("position") || "bottom-right");
  const color = String(formData.get("color") || "#000000");
  const animation = formData.get("animation") === "on" ? "fade" : "none";
  const visibility = String(formData.get("visibility") || "optional");

  await prisma.backToTopSettings.upsert({
    where: { shop },
    update: { enabled, position, color, animation, visibility },
    create: { shop, enabled, position, color, animation, visibility },
  });

  await saveBackToTopMetafield({
    admin,
    settings: {
      enabled,
      position,
      color,
      animation,
      visibility,
    },
  });

  return { success: true };
};

/* ================= PAGE ================= */
export default function BackToTopPage() {
  const { settings } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const app = useAppBridge();

  const [enabled, setEnabled] = useState(settings.enabled);
  const [position, setPosition] = useState(settings.position);
  const [visibility, setVisibility] = useState(settings.visibility);
  const [color, setColor] = useState(settings.color);

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
      <Form method="post" data-save-bar>
        <s-section heading="Back to top settings">
          <s-paragraph>
            The Back to Top widget adds a button that lets customers quickly
            return to the top of the page while scrolling.
          </s-paragraph>

          <s-switch
            name="enabled"
            label="Enable Back to Top"
            details="Show Back to Top button on your store"
            checked={enabled}
            onChange={(e: any) => setEnabled(e.detail.checked)}
          />
        </s-section>
        <s-grid-item
          gridColumn="span 2"
          border="base"
          borderStyle="dashed"
        ></s-grid-item>
        <s-grid gridTemplateColumns="repeat(6, 1fr)" gap="small">
          {/* SETTINGS */}
          <s-grid-item gridColumn="span 2" border="base" borderStyle="dashed">
            <s-section heading="Widget Settings">
              {/* POSITION */}
              <s-select
                name="position"
                label="Button position"
                value={position}
                onChange={(e: any) => setPosition(e.detail.value)}
              >
                <s-option value="bottom-right">Bottom Right</s-option>
                <s-option value="bottom-left">Bottom Left</s-option>
              </s-select>

              {/* VISIBILITY */}
              <s-choice-list
                name="visibility"
                label="Button visibility"
                values={[visibility]}
                onChange={(e: any) => setVisibility(e.detail.value)}
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
                onChange={(e: any) => setColor(e.detail.value)}
              />
            </s-section>
          </s-grid-item>

          {/* PREVIEW */}
          <s-grid-item gridColumn="span 4">
            <s-section heading="Preview">
              <BackToTopPreview settings={previewSettings} />
            </s-section>
          </s-grid-item>
        </s-grid>
      </Form>
    </s-page>
  );
}

/* ================= HEADERS ================= */
export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};
