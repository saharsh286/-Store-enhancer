import {
  ActionFunctionArgs,
  
  type LoaderFunctionArgs,
} from "react-router";
import { authenticate } from "../shopify.server";
import { useState } from "react";

import {
  setBackToTopEnabled,
  setCookieConsentEnabled,
  setStickyAddToCartEnabled,
} from "./shopify/dashboardMetafield.server";

/* ================= LOADER ================= */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  async function getStatus(namespace: string) {
    const res = await admin.graphql(`
      query {
        shop {
          metafield(namespace: "${namespace}", key: "settings") {
            value
          }
        }
      }
    `);

    const data: any = await res.json();
    const metafield = data?.data?.shop?.metafield;

    if (!metafield?.value) return false;

    try {
      const parsed = JSON.parse(metafield.value);
      return Boolean(parsed?.enabled);
    } catch {
      return false;
    }
  }

  return {
    backToTopEnabled: await getStatus("back_to_top"),
    cookieEnabled: await getStatus("cookie_consent"),
    stickyEnabled: await getStatus("sticky_add_to_cart"),
    countryBlockerEnabled: await getStatus("country_blocker"),
    whatsappEnabled: await getStatus("whatsapp_chat"),
  };
};

/* ================= ACTION ================= */
export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);
  const formData = await request.formData();

  const backToTopEnabled = formData.get("backToTopEnabled") === "on";
  const cookieEnabled = formData.get("cookieEnabled") === "on";
  const stickyEnabled = formData.get("stickyEnabled") === "on";

  await setBackToTopEnabled(admin, backToTopEnabled);
  await setCookieConsentEnabled(admin, cookieEnabled);
  await setStickyAddToCartEnabled(admin, stickyEnabled);

  return null;
};

import { useLoaderData } from "react-router";

export default function Dashboard() {
  const {
    backToTopEnabled,
    cookieEnabled,
    stickyEnabled,
    countryBlockerEnabled,
    whatsappEnabled,
  } = useLoaderData<typeof loader>();

  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const showRow = (enabled: boolean) => {
    if (filter === "active") return enabled;
    if (filter === "inactive") return !enabled;
    return true;
  };

  return (
    <s-page heading="Store Enhancer">
      <s-section>
        <s-paragraph>
          Manage all your store enhancement tools from one place.
        </s-paragraph>
      </s-section>

      <s-section heading="Widgets">

        <s-stack direction="inline" gap="base" alignItems="center">
          <s-button
            variant={filter === "all" ? "primary" : "tertiary"}
            onClick={() => setFilter("all")}
          >
            All
          </s-button>

          <s-button
            variant={filter === "active" ? "primary" : "tertiary"}
            onClick={() => setFilter("active")}
          >
            Active
          </s-button>

          <s-button
            variant={filter === "inactive" ? "primary" : "tertiary"}
            onClick={() => setFilter("inactive")}
          >
            Inactive
          </s-button>
        </s-stack>

        <s-table>
          <s-table-header-row>
            <s-table-header>Icon</s-table-header>
            <s-table-header>Widget</s-table-header>
            <s-table-header>Description</s-table-header>
            <s-table-header>Status</s-table-header>
            <s-table-header></s-table-header>
          </s-table-header-row>

          <s-table-body>

            {/* WhatsApp Chat */}
            {showRow(whatsappEnabled) && (
              <s-table-row>
                <s-table-cell>
                  <s-icon type="chat" />
                </s-table-cell>
                <s-table-cell>WhatsApp Chat</s-table-cell>
                <s-table-cell>
                  Add WhatsApp live chat support for customers.
                </s-table-cell>
                <s-table-cell>
                  <s-badge tone={whatsappEnabled ? "success" : "critical"}>
                    {whatsappEnabled ? "Active" : "Inactive"}
                  </s-badge>
                </s-table-cell>
                <s-table-cell>
                  <s-link href="/app/whatsapp-chat">
                    <s-button variant="secondary">Manage</s-button>
                  </s-link>
                </s-table-cell>
              </s-table-row>
            )}

            {/* Country Blocker */}
            {showRow(countryBlockerEnabled) && (
              <s-table-row>
                <s-table-cell>
                  <s-icon type="globe" />
                </s-table-cell>
                <s-table-cell>Country Blocker</s-table-cell>
                <s-table-cell>
                  Restrict or redirect visitors by country.
                </s-table-cell>
                <s-table-cell>
                  <s-badge tone={countryBlockerEnabled ? "success" : "critical"}>
                    {countryBlockerEnabled ? "Active" : "Inactive"}
                  </s-badge>
                </s-table-cell>
                <s-table-cell>
                  <s-link href="/app/country-blocker">
                    <s-button variant="secondary">Manage</s-button>
                  </s-link>
                </s-table-cell>
              </s-table-row>
            )}

            {/* Cookie Consent */}
            {showRow(cookieEnabled) && (
              <s-table-row>
                <s-table-cell>
                  <s-icon type="shield-check-mark" />
                </s-table-cell>
                <s-table-cell>Cookie Consent</s-table-cell>
                <s-table-cell>
                  Manage cookie banner and privacy compliance.
                </s-table-cell>
                <s-table-cell>
                  <s-badge tone={cookieEnabled ? "success" : "critical"}>
                    {cookieEnabled ? "Active" : "Inactive"}
                  </s-badge>
                </s-table-cell>
                <s-table-cell>
                  <s-link href="/app/cookie-consent">
                    <s-button variant="secondary">Manage</s-button>
                  </s-link>
                </s-table-cell>
              </s-table-row>
            )}

            {/* Sticky Add To Cart */}
            {showRow(stickyEnabled) && (
              <s-table-row>
                <s-table-cell>
                  <s-icon type="cart" />
                </s-table-cell>
                <s-table-cell>Sticky Add To Cart</s-table-cell>
                <s-table-cell>
                  Keep add-to-cart button visible while scrolling.
                </s-table-cell>
                <s-table-cell>
                  <s-badge tone={stickyEnabled ? "success" : "critical"}>
                    {stickyEnabled ? "Active" : "Inactive"}
                  </s-badge>
                </s-table-cell>
                <s-table-cell>
                  <s-link href="/app/sticky-add-to-cart">
                    <s-button variant="secondary">Manage</s-button>
                  </s-link>
                </s-table-cell>
              </s-table-row>
            )}

            {/* Back To Top */}
            {showRow(backToTopEnabled) && (
              <s-table-row>
                <s-table-cell>
                  <s-icon type="arrow-up" />
                </s-table-cell>
                <s-table-cell>Back To Top</s-table-cell>
                <s-table-cell>
                  Smooth scroll button to top of page.
                </s-table-cell>
                <s-table-cell>
                  <s-badge tone={backToTopEnabled ? "success" : "critical"}>
                    {backToTopEnabled ? "Active" : "Inactive"}
                  </s-badge>
                </s-table-cell>
                <s-table-cell>
                  <s-link href="/app/back-to-top">
                    <s-button variant="secondary">Manage</s-button>
                  </s-link>
                </s-table-cell>
              </s-table-row>
            )}

          </s-table-body>
        </s-table>
      </s-section>
    </s-page>
  );
}