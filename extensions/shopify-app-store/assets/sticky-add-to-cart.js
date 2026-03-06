document.addEventListener("DOMContentLoaded", function () {

  /* ================= RUN ONLY ON PRODUCT PAGE ================= */
  if (!window.location.pathname.includes("/products/")) {
    return;
  }
  const container = document.getElementById("srt-sticky-add-to-cart");
  if (!container) {
    console.log("Sticky container not found");
    return;
  }

  const settings = JSON.parse(container.dataset.settings || "{}");

  /* ================= GET PRODUCT FORM ================= */

  const productForm =
    document.querySelector('form[action*="/cart/add"]') ||
    document.querySelector('form[data-type="add-to-cart-form"]');

  if (!productForm) {
    console.log("Product form not found");
    return;
  }

  /* ================= GET INITIAL DATA ================= */

  const productTitle =
    document.querySelector("h1")?.innerText || "Product";

  const productPrice =
    document.querySelector("[data-product-price], .price-item")?.innerText || "";

  const mainImageEl =
    document.querySelector(".product__media img") ||
    document.querySelector(".product__media-item img");

  const productImage = mainImageEl ? mainImageEl.src : "";

  const variantSelect = productForm.querySelector("select[name='id']");

  /* ================= CREATE BAR ================= */

  const bar = document.createElement("div");
  bar.className = "sticky-atc-bar show"; // 👈 show directly
  bar.style.backgroundColor = settings.backgroundColor || "#000";
  bar.classList.add(settings.position === "top" ? "top" : "bottom");

  /* ================= PRODUCT INFO ================= */

  const infoWrapper = document.createElement("div");
  infoWrapper.className = "atc-product-info";

  const img = document.createElement("img");
  img.src = productImage;
  img.className = "atc-product-image";

  const textWrapper = document.createElement("div");
  textWrapper.className = "atc-text";

  const titleEl = document.createElement("div");
  titleEl.innerText = productTitle;
  titleEl.className = "atc-title";

  const priceEl = document.createElement("div");
  priceEl.innerText = productPrice;
  priceEl.className = "atc-price";

  textWrapper.append(titleEl, priceEl);
  infoWrapper.append(img, textWrapper);

  /* ================= VARIANT ================= */

  const variantWrapper = document.createElement("div");
  variantWrapper.className = "atc-variant";

  if (variantSelect) {
    const cloneVariant = variantSelect.cloneNode(true);

    cloneVariant.addEventListener("change", function () {
      variantSelect.value = cloneVariant.value;
      variantSelect.dispatchEvent(new Event("change"));
      setTimeout(updateStickyData, 300);
    });

    variantWrapper.appendChild(cloneVariant);

    variantSelect.addEventListener("change", function () {
      setTimeout(updateStickyData, 300);
    });
  }

  function updateStickyData() {
    const updatedImage =
      document.querySelector(".product__media img") ||
      document.querySelector(".product__media-item img");

    const updatedPrice =
      document.querySelector("[data-product-price], .price-item");

    if (updatedImage) img.src = updatedImage.src;
    if (updatedPrice) priceEl.innerText = updatedPrice.innerText;
  }

  /* ================= BUTTON ================= */

  const button = document.createElement("button");
  button.className = "sticky-atc-button";
  button.innerText = settings.buttonText || "Add to Cart";
  button.style.backgroundColor = settings.buttonColor || "#ff6600";
  button.style.color = "#fff";

  button.addEventListener("click", function () {
    productForm.submit();
  });

  /* ================= APPEND ================= */

  bar.append(infoWrapper, variantWrapper, button);
  document.body.appendChild(bar);

});