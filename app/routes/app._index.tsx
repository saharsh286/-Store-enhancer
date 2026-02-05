import {
  ActionFunctionArgs,
  Form,
  type LoaderFunctionArgs,
} from "react-router";
import { authenticate } from "../shopify.server";
import { useState } from "react";
import { setBackToTopEnabled } from "./shopify/dashboardMetafield.server";
import { setCookieConsentEnabled } from "./shopify/dashboardMetafield.server";

/* ================= LOADER ================= */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  console.log("📥 DASHBOARD LOADER CALLED");
  const { session } = await authenticate.admin(request);
  console.log("🏪 DASHBOARD LOADER SHOP:", session.shop);
  return null;
};

/* ================= ACTION ================= */
export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("📤 DASHBOARD ACTION CALLED");

  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const backToTopEnabled = formData.get("backToTopEnabled") === "on";
  const cookieEnabled = formData.get("cookieEnabled") === "on";

  console.log("🧩 DASHBOARD FORM DATA:", {
    backToTopEnabled,
    cookieEnabled,
  });

  await setBackToTopEnabled(admin, backToTopEnabled);
  await setCookieConsentEnabled(admin, cookieEnabled);

  return null;
};

/* ================= PAGE ================= */
export default function Dashboard() {
  const [backToTopEnabled, setBackToTopEnabled] = useState(true);
  const [cookieEnabled, setCookieEnabled] = useState(true);

  return (
    <Form method="post" data-save-bar>
      <s-page heading="Store Enhancer Dashboard">
        <s-section>
          <s-paragraph>
            Manage and customize your store widgets from here.
          </s-paragraph>
        </s-section>

        <s-grid gridTemplateColumns="repeat(6, 1fr)" gap="small">

          {/* ================= BACK TO TOP ================= */}
          <s-grid-item gridColumn="span 3">
            <s-section heading="Back To Top">
              <s-paragraph>
                Adds a floating button that scrolls the page back to the top.
              </s-paragraph>

              <s-switch
                name="backToTopEnabled"
                label="Enable Back To Top"
                checked={backToTopEnabled}
                onChange={(e: any) =>
                  setBackToTopEnabled(e.detail.checked)
                }
              />

              <s-stack direction="inline" gap="base">
                <s-link href="/app/back-to-top">
                  <s-button variant="tertiary">
                    Customize Back To Top →
                  </s-button>
                </s-link>
              </s-stack>
            </s-section>
          </s-grid-item>

          {/* ================= COOKIE CONSENT ================= */}
          <s-grid-item gridColumn="span 3">
            <s-section heading="Cookie Consent">
              <s-paragraph>
                Shows a cookie consent banner to comply with privacy regulations.
              </s-paragraph>

              <s-switch
                name="cookieEnabled"
                label="Enable Cookie Consent"
                checked={cookieEnabled}
                onChange={(e: any) =>
                  setCookieEnabled(e.detail.checked)
                }
              />

              <s-stack direction="inline" gap="base">
                <s-link href="/app/cookie-consent">
                  <s-button variant="tertiary">
                    Customize Cookie Consent →
                  </s-button>
                </s-link>
              </s-stack>
            </s-section>
          </s-grid-item>

        </s-grid>
      </s-page>
    </Form>
  );
}
