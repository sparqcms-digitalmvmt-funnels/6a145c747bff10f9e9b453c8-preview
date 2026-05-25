


const EMAIL_OVERSIGHT_VALIDATE_URL = 'https://app-cms-api-proxy-staging-001.azurewebsites.net/integration/email-oversight/validate-public';

let isTest = sessionStorage.getItem("test");
if (isTest === null && isTest !== false) {
  isTest = true;
  sessionStorage.setItem("test", isTest);
}



// Get offer info from the campaign to determine VIP status
const orderSummary = JSON.parse(sessionStorage.getItem("orderSummary")) || [];

const getVrioCampaignInfoBasedOnPaymentMethod = (isVipUpsell) => {
    const vrioCampaigns = [{"_id":"6a145bb37bff10f9e9b4538b","integration":[{"_id":"685435949a3a8c5ffb4854ef","workspace":"develop","platform":"vrio","description":"dev, team api","fields":{"publicApiKey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6ImFkbWluIiwib3JnYW5pemF0aW9uIjoibXZtdHNhbmRib3gudnJpbyIsImlkIjoiNTQxNzM0MWMtOTI3ZS00YTc5LTk5MTQtMzcxM2IyM2RlMTNlIiwiaWF0IjoxNzUwMDk4ODg1LCJhdWQiOiJ1cm46dnJpbzphcGk6dXNlciIsImlzcyI6InVybjp2cmlvOmFwaTphdXRoZW50aWNhdG9yIiwic3ViIjoidXJuOnZyaW86YXBpOjE4In0.z4qwr2v87T3wq73w1nT8aSASKIMVLnL0HX1E-2tavrs"},"status":"active","createdAt":1750335264215,"updatedAt":1750349204667,"__v":0,"category":"CRM","id":"685435949a3a8c5ffb4854ef"}],"externalId":"40","name":"COPY - Vi-Shift - Network - (1)","currency":"USD","countries":[223,38],"metadata":{"campaign_id":40,"campaign_name":"","payment_type_id":1,"campaign_active":true,"campaign_prepaid":true,"campaign_payment_method_required":true,"campaign_group_transactions":true,"campaign_global_js":"","campaign_global_seo_title":"","campaign_global_seo_keywords":"","campaign_global_seo_description":"","date_created":"2026-05-25 14:24:52","created_by":0,"date_modified":"2026-05-25 14:24:52","modified_by":0,"campaign_notes":"","offers":[],"shipping_profiles":[],"campaignId":"40","externalId":40,"description":"","payment_methods":["amex","discover","visa","master"],"alternative_payments":[],"countries":[{"iso_numeric":840,"calling_code":"1","id":223,"name":"United States of America","iso_2":"US","iso_3":"USA"},{"iso_numeric":124,"calling_code":"1","id":38,"name":"Canada","iso_2":"CA","iso_3":"CAN"}]},"funnels":[],"createdAt":1779703520501,"updatedAt":1779719092087,"packages":[],"status":"active","platform":"vrio","__v":0,"id":"6a145bb37bff10f9e9b4538b"}];

    const vrioIntegration = vrioCampaigns.find(({ integration }) =>
      integration.find((int) => int.platform === 'vrio'),
    )?.integration.find((int) => int.platform === 'vrio');
    if (!vrioIntegration) {
      console.log('CRM Integration not available in funnel campaign.');
      throw new Error('CRM Integration not available in funnel campaign.');
    }

    // If this is a VIP page (recurring billing), try to find a VIP campaign
    // const campaignBasedOnBillingModel = vrioCampaigns.find((campaign) => {
    //   if (!campaign.name) {
    //     return false;
    //   }
    //   const isVipCampaign = campaign.name.toUpperCase().includes('VIP');
    //   if (isVipUpsell) {
    //     return isVipCampaign;
    //   }
    //   return !isVipCampaign;
    // });
    const campaignBasedOnBillingModel = vrioCampaigns[0];

    if (!campaignBasedOnBillingModel) {
      throw new Error(`No ${isVipUpsell ? 'VIP' : 'non-VIP'} campaign found in funnel.`);
    }

    const auditedVrioCampaignId = (() => window.VRIO?.campaignId)();
    const vrioCampaignId = auditedVrioCampaignId ?? campaignBasedOnBillingModel.externalId;
    const countries = campaignBasedOnBillingModel.metadata.countries;
    const integrationId = vrioIntegration?._id.toString();
    const currency = (campaignBasedOnBillingModel.currency || "USD").toLowerCase();

    return {
      vrioCampaignId,
      countries,
      integrationId,
      currency,
    };
  };

;
const isVipUpsell = false;
const { vrioCampaignId, countries, integrationId } = getVrioCampaignInfoBasedOnPaymentMethod(isVipUpsell);
const CURRENCY = "USD";

const CURRENCY_LOCALE_MAP = {
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  AUD: 'en-AU',
};
const LOCALE = getLocaleFromCurrency(CURRENCY);

function getLocaleFromCurrency(currencyCode) {
  const code = (currencyCode || '').toUpperCase();
  if (code && CURRENCY_LOCALE_MAP[code]) return CURRENCY_LOCALE_MAP[code];
  return navigator.language || 'en-US';
};

function formatPrice(amount, suffix = '') {
  const formatted = new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY.toUpperCase(),
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted}${suffix}`;
};


const i18n = {
  "iso2": "US",
  "phoneInitialCountry": "us",
  "dateFormat": "MM/DD/YYYY",
  "fallbackCountry": {
    "iso_numeric": 840,
    "calling_code": "1",
    "id": 223,
    "name": "United States of America",
    "iso_2": "US",
    "iso_3": "USA"
  },
  "pricingText": {
    "off": "OFF",
    "free": "FREE",
    "freeShipping": "Free Shipping",
    "perUnit": "/ea",
    "selectedProduct": "Selected Product"
  },
  "validation": {
    "expirationDateRequired": "* Expiration date is required",
    "expirationDateInvalid": "* Invalid or expired date",
    "cardNumberRequired": "* Enter a valid card number",
    "cardNumberInvalid": "* Invalid card number",
    "cardCvvRequired": "* Card CVV is required",
    "cardCvvMinLength": "* Card CVV must have at least 3 digits",
    "emailRequired": "* Please enter the e-mail address",
    "emailInvalid": "* Email is invalid",
    "firstNameRequired": "* First name is required",
    "lastNameRequired": "* Last name is required",
    "invalidCharacter": "* Contains an invalid character",
    "shippingAddressRequired": "* Shipping address is required",
    "cityRequired": "* City is required",
    "countryRequired": "* Country is required",
    "stateRequired": "* State/Province is required",
    "zipRequired": "* ZIP/Postcode is required",
    "zipInvalid": "* Invalid ZIP/Postcode code",
    "phoneInvalid": "* Please enter a valid phone number",
    "maxLength255": "* Maximum 255 characters",
    "billingAddressRequired": "* Billing address is required",
    "billingCityRequired": "* Billing city is required",
    "billingZipRequired": "* Billing ZIP/Postcode code is required"
  },
  "errors": {
    "walletVerificationFailed": "This payment needs additional verification. Please try a different payment method.",
    "walletOrderFailed": "Something went wrong creating your order, please try again",
    "unexpectedError": "An unexpected error occurred. Please try again.",
    "paymentDeclined": "Your payment could not be processed. Please try a different payment method.",
    "systemErrorOffer": "There was a problem with this offer. Please contact support or try again later.",
    "systemErrorGeneric": "Something went wrong processing your order. Please try again or contact support if the problem persists.",
    "klarnaNotAvailableRecurring": "Klarna is not available for recurring products.",
    "klarnaSubscriptionsNotSupported": "Subscriptions are not supported with Klarna",
    "klarnaOrderFailed": "Something went wrong creating the order, please try again",
    "klarnaProcessingFailed": "Something went wrong processing your order, please try again",
    "klarnaPaymentNotCompleted": "Klarna payment was not completed",
    "klarnaPaymentNotCompletedRedirect": "Klarna payment was not completed. Redirecting to checkout...",
    "klarnaCompletionFailed": "Something went wrong completing your Klarna payment.",
    "orderAlreadyCompleteRedirect": "Order is already complete. Redirecting to the next page...",
    "unexpectedErrorRedirect": "An unexpected error occurred. Redirecting to checkout...",
    "orderNotFoundRedirect": "Order not found. Redirecting to checkout...",
    "orderNotFound": "Order not found. Please try again.",
    "orderCanceled": "Order canceled",
    "creditCardOrderFailed": "Something went wrong, please try again",
    "upsellOrderFailed": "Something went wrong adding offers, please try again",
    "countryNotAvailableNamed": "The country {name} is not available, please choose another.",
    "countryNotAvailable": "This country is not available, please choose another."
  },
  "labels": {
    "noStatesAvailable": "No States or Provinces Available for this Country",
    "selectState": "Select state",
    "phoneSearchPlaceholder": "Search",
    "processing": "Processing...",
    "close": "Close",
    "cvvModalTitle": "Where is my security code?",
    "cvvCardBack": "Back of card",
    "cvvCardFront": "Front of card",
    "cvvThreeDigitLabel": "3-digit CVV number",
    "cvvFourDigitLabel": "4-digit CVV number",
    "cvvBackDescription": "The 3-digit security code (CVV) is printed on the back of your card, to the right of the signature strip.",
    "cvvFrontDescription": "American Express cards have a 4-digit code on the front."
  }
};

// Validation patterns (RegExp – cannot be serialised as JSON)
i18n.validationPatterns = {
  zipCodeRegex: /^(?:\d{5}(?:-\d{4})?|[A-Za-z]\d[A-Za-z](?:[ -]?\d[A-Za-z]\d)?|\d{4}|[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[ABD-HJLN-UW-Z]{2})$/,
  nameRegex: /\b([A-ZÀ-ÿ][-,a-zÀ-ÿ. ']+[ ]*)+$/i,
};

function formatDateByConvention(year, month, day) {
  return `${month}/${day}/${year}`;
}


const PAYMENT_METHODS_IDS = {"creditCard":1,"googlePay":3,"applePay":4,"paypal":6,"klarna":12};
const CAMPAIGN_ID = vrioCampaignId;
const INTEGRATION_ID = integrationId;
const UPSELL_NEXT_PAGE_SLUG = "thank-you";

function getNextPageSlugForRedirect() {
  const normalize = (value) => {
    if (!value) return "";
    return value.startsWith("/6a145c747bff10f9e9b453c8-preview") ? value : (value.startsWith("/") ? "/6a145c747bff10f9e9b453c8-preview" + value : "/6a145c747bff10f9e9b453c8-preview/" + value);
  };
  if (UPSELL_NEXT_PAGE_SLUG) return normalize(UPSELL_NEXT_PAGE_SLUG);
  return "/";
}
const HAS_FOLLOWING_UPSELLS = false;
const UPSELL_WALLETS_CONFIG = {"enabled":false,"enableApplePay":false,"enableGooglePay":false,"enableKlarna":false};
const isKlarnaSelected = ({ walletsConfig } = {}) => {
  if (walletsConfig && typeof walletsConfig === "object") {
    if (!(walletsConfig.enabled && walletsConfig.enableKlarna)) return false;
  } else {
    try {
      const stored = sessionStorage.getItem("isKlarnaEnabled");
      if (stored !== null && JSON.parse(stored) !== true) return false;
    } catch {}
  }
  try {
    const orderData = JSON.parse(sessionStorage.getItem("orderData"));
    return Number(orderData?.payment_method_id) === 12;
  } catch {
    return false;
  }
};
const isKlarnaPayment = isKlarnaSelected({ walletsConfig: UPSELL_WALLETS_CONFIG });
const removeKlarnaParamsFromUrl = (urlValue) => {
  const sourceUrl = urlValue || window.location.href;
  const url = new URL(sourceUrl, window.location.origin);
  url.searchParams.delete("payment_intent");
  url.searchParams.delete("payment_intent_client_secret");
  url.searchParams.delete("redirect_status");
  return url.toString();
};

const applyKlarnaVisibility = () => {
  
  const setKlarnaElementVisibility = (element, shouldHide) => {
    if (!element) return;
    if (shouldHide) {
      element.style.setProperty("display", "none", "important");
      element.setAttribute("aria-hidden", "true");
    } else {
      element.style.removeProperty("display");
      element.setAttribute("aria-hidden", "false");
    }
  };
  let hiddenKlarnaTargetsCount = 0;
  document
    .querySelectorAll("[data-hide-on-klarna]")
    .forEach((element) => {
      if (isKlarnaPayment) hiddenKlarnaTargetsCount += 1;
      setKlarnaElementVisibility(element, isKlarnaPayment);
    });
  document
    .querySelectorAll("[data-show-on-klarna]")
    .forEach((element) => setKlarnaElementVisibility(element, !isKlarnaPayment));
  

};

let selectedProduct;
const AUTO_SKIP_SCREEN_ID = "autoskip-screen";

const getOrCreateVipAutoSkipScreen = () => {
  let screen = document.getElementById(AUTO_SKIP_SCREEN_ID);
  if (screen) return screen;

  if (!document.getElementById("autoskip-screen-keyframes")) {
    const style = document.createElement("style");
    style.id = "autoskip-screen-keyframes";
    style.textContent =
      "@keyframes autoskipScreenRotation {0% {transform: rotate(0deg);}100% {transform: rotate(360deg);}}";
    document.head.appendChild(style);
  }

  screen = document.createElement("div");
  screen.id = AUTO_SKIP_SCREEN_ID;
  screen.setAttribute("aria-live", "polite");
  screen.setAttribute("data-testid", "autoskip-screen");
  screen.style.position = "fixed";
  screen.style.inset = "0";
  screen.style.zIndex = "9000";
  screen.style.background = "#ffff";
  screen.style.display = "none";
  screen.style.alignItems = "center";
  screen.style.justifyContent = "center";

  const spinner = document.createElement("div");
  spinner.className = "loader";
  spinner.setAttribute("data-testid", "autoskip-spinner");
  spinner.style.width = "48px";
  spinner.style.height = "48px";
  spinner.style.borderRadius = "50%";
  spinner.style.display = "inline-block";
  spinner.style.boxSizing = "border-box";
  spinner.style.animation = "autoskipScreenRotation 1s linear infinite";
  spinner.style.marginTop = "22px";
  spinner.style.border = "5px solid rgba(18, 76, 117, 1.00)";
  spinner.style.borderBottomColor = "transparent";

  const spacer = document.createElement("span");
  spacer.innerHTML = "<br>";
  spinner.appendChild(spacer);
  screen.appendChild(spinner);
  document.body.appendChild(screen);

  return screen;
};

const getPrices = async function upsellGetPrices(allPrices) {
  const productId = document.querySelector('[data-product-id]').getAttribute('data-product-id');
  selectedProduct = allPrices.find((price) => price.id === Number(productId));

  const currencyClass = document.querySelectorAll('[data-holder="currency"]');
  currencyClass.forEach((el) => {
    el.innerHTML = "$";
  });

  const priceClass = document.querySelectorAll('[data-holder="product_full_price"]');
  priceClass.forEach((el) => {
    el.innerHTML = selectedProduct.finalPrice;
  });

  const discountClass = document.querySelectorAll('[data-holder="product_discount_percentage"]');
  discountClass.forEach((el) => {
    el.innerHTML = selectedProduct.discountPercentage;
  });

  return selectedProduct;
};
const prices = [{"name":"1x EXTRA Vi-Shift Glasses","id":232,"quantity":1,"price":19.99,"shippable":false,"fullPrice":19.99,"finalPrice":19.99,"productName":"1x EXTRA Vi-Shift Glasses","discountAmount":0,"discountPercentage":0},{"name":"1x Flexible Glasses","id":224,"quantity":1,"price":29.99,"shippable":false,"fullPrice":29.99,"finalPrice":29.99,"productName":"1x Flexible Glasses","discountAmount":0,"discountPercentage":0},{"name":"1x USB 3.0 Quick Charger","id":59,"quantity":1,"price":0,"shippable":false,"fullPrice":0,"finalPrice":0,"productName":"1x USB 3.0 Quick Charger","discountAmount":0,"discountPercentage":0},{"name":"2x Vi-Shift Glasses","id":225,"quantity":1,"price":53.98,"shippable":false,"fullPrice":53.98,"finalPrice":53.98,"productName":"2x Vi-Shift Glasses","discountAmount":0,"discountPercentage":0},{"name":"3 Year Extended Warranty","id":230,"quantity":1,"price":10,"shippable":false,"fullPrice":10,"finalPrice":10,"productName":"3 Year Extended Warranty","discountAmount":0,"discountPercentage":0},{"name":"3x Vi-Shift Glasses","id":226,"quantity":1,"price":71.97,"shippable":false,"fullPrice":71.97,"finalPrice":71.97,"productName":"3x Vi-Shift Glasses","discountAmount":0,"discountPercentage":0},{"name":"4x Vi-Shift Glasses","id":227,"quantity":1,"price":83.96,"shippable":false,"fullPrice":83.96,"finalPrice":83.96,"productName":"4x Vi-Shift Glasses","discountAmount":0,"discountPercentage":0},{"name":"5x Vi-Shift Glasses","id":228,"quantity":1,"price":89.95,"shippable":false,"fullPrice":89.95,"finalPrice":89.95,"productName":"5x Vi-Shift Glasses","discountAmount":0,"discountPercentage":0},{"name":"Journey Package Protection","id":231,"quantity":1,"price":3.5,"shippable":false,"fullPrice":3.5,"finalPrice":3.5,"productName":"Journey Package Protection","discountAmount":0,"discountPercentage":0},{"name":"Vi-Shift Glasses - Expedited Shipping","id":233,"quantity":1,"price":9.99,"shippable":false,"fullPrice":9.99,"finalPrice":9.99,"productName":"Vi-Shift Glasses - Expedited Shipping","discountAmount":0,"discountPercentage":0},{"name":"Vi-Shift Protective Case Upgrade","id":229,"quantity":1,"price":9.95,"shippable":false,"fullPrice":9.95,"finalPrice":9.95,"productName":"Vi-Shift Protective Case Upgrade","discountAmount":0,"discountPercentage":0},{"name":"VIP Customer Benefits","id":34,"quantity":1,"price":9.95,"shippable":false,"fullPrice":9.95,"finalPrice":9.95,"productName":"VIP Customer Benefits","discountAmount":0,"discountPercentage":0}];
const shippables = [{"id":223,"name":"Flexible Glasses"},{"id":36,"name":"USB 3.0 Quick Charger"}];

function removeObjectUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === undefined || obj[key] === null || obj[key] === "")
      delete obj[key];
  }
  return obj;
}
const createCart = async (sanitizedOrderData) => {
    let cartResponse = await fetch(
    `https://app-cms-api-proxy-staging-001.azurewebsites.net/vrio/carts`,
    {
      method: 'POST',
      headers: {
        authorization: `appkey ${INTEGRATION_ID}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        offers: sanitizedOrderData.offers,
        campaign_id: CAMPAIGN_ID,
        connection_id: sanitizedOrderData.connection_id,
        pageId: sanitizedOrderData.pageId,
      }),
      keepalive: false,
    }
  );
  if (cartResponse.status === 200) {
    cartResponse = await cartResponse.json();
    sessionStorage.setItem('cart_token', cartResponse.cart_token);
    return cartResponse.cart_token;
  }
};
const getProductElement = (productId) => {
  const productElement = document.querySelector(`[data-product-id="${productId}"]`);
  if (productElement) {
    return productElement;
  } else {
    throw new Error(`Product element with ID ${productId} not found.`);
  }
};;
const flagOrderAsTest = async (orderId) => {
  if (!orderId) return null;
  try {
    const res = await fetch(
      `https://app-cms-api-proxy-staging-001.azurewebsites.net/vrio/orders/${orderId}`,
      {
        method: "PATCH",
        headers: {
          authorization: `appkey ${INTEGRATION_ID}`,
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({ is_test: true })
      }
    );
    return await res.json();
  } catch (_) {
    return null;
  }
}
const getBindedShippableProductAndQuantity = (productElement) => {
  if (productElement && productElement.dataset.shippableProductId) {
    const shippableId = Number(productElement.dataset.shippableProductId);
    let quantity = 1;
    if (!isNaN(productElement.dataset.productQuantity)) {
      quantity = Number(productElement.dataset.productQuantity);
    } else if (!isNaN(Number(productElement.value))) {
      quantity = Number(productElement.value);
    }
    return { product: shippables.find((s) => s.id === shippableId), quantity };
  }
  return null;
};;
const productCustomData = JSON.parse(sessionStorage.getItem("productCustomData")) || {};
const saveProductCustomData = (productElement) => {
  productCustomData[productElement.dataset.productId] = {
    customProductName: productElement.dataset.customProductName,
    customSummaryRow: productElement.dataset.customSummaryRow,
    customIsGift: productElement.dataset.customIsGift,
  };
}
const getVrioOfferIdByProductId = (productId) => {
    const vrioOffers = [{"id":99,"offerTypeId":1,"name":"Vi-Shift - Network","items":[{"name":"1x EXTRA Vi-Shift Glasses","id":232,"quantity":1,"price":19.99,"shippable":false},{"name":"1x Flexible Glasses","id":224,"quantity":1,"price":29.99,"shippable":false},{"name":"1x USB 3.0 Quick Charger","id":59,"quantity":1,"price":0,"shippable":false},{"name":"2x Vi-Shift Glasses","id":225,"quantity":1,"price":53.98,"shippable":false},{"name":"3 Year Extended Warranty","id":230,"quantity":1,"price":10,"shippable":false},{"name":"3x Vi-Shift Glasses","id":226,"quantity":1,"price":71.97,"shippable":false},{"name":"4x Vi-Shift Glasses","id":227,"quantity":1,"price":83.96,"shippable":false},{"name":"5x Vi-Shift Glasses","id":228,"quantity":1,"price":89.95,"shippable":false},{"name":"Flexible Glasses","id":223,"quantity":1,"price":0,"shippable":true},{"name":"Journey Package Protection","id":231,"quantity":1,"price":3.5,"shippable":false},{"name":"USB 3.0 Quick Charger","id":36,"quantity":1,"price":0,"shippable":true},{"name":"Vi-Shift Glasses - Expedited Shipping","id":233,"quantity":1,"price":9.99,"shippable":false},{"name":"Vi-Shift Protective Case Upgrade","id":229,"quantity":1,"price":9.95,"shippable":false}]},{"id":100,"offerTypeId":2,"name":"Vi-Shift - VIP","items":[{"name":"VIP Customer Benefits","id":34,"quantity":1,"price":9.95,"shippable":false}]}];
    const recurringOfferTypeIds = [2, '2'];
    let matchedOffer = null;
    let isRecurringOffer = false;

    // prefer recurring offer match, fallback to first non-recurring match
    for (const offer of vrioOffers) {
      if (offer.items.some((item) => String(item.id) === String(productId))) {
        if (recurringOfferTypeIds.includes(offer.offerTypeId)) {
          matchedOffer = offer;
          isRecurringOffer = true;
          break;
        }
        if (!matchedOffer) matchedOffer = offer;
      }
    }

    return {
      offerId: matchedOffer?.id,
      isRecurringOffer,
    };
  };
const showToast = function(message, bg = "#333") {
  const container =
    document.querySelector("#toast-container") ||
    (() => {
      const div = document.createElement("div");
      div.id = "toast-container";
      div.setAttribute("data-testid", "toast-container");
      div.style.position = "fixed";
      div.style.top = "10px";
      div.style.right = "10px";
      div.style.zIndex = "9999";
      document.body.appendChild(div);
      return div;
    })();

  const toast = document.createElement("div");
  toast.className = "mytoast";
  toast.setAttribute("data-testid", "toast");
  toast.textContent = message;
  toast.style.background = bg;
  toast.style.color = "#fff";
  toast.style.padding = "10px 15px";
  toast.style.marginTop = "5px";
  toast.style.borderRadius = "5px";
  toast.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3500);
}

const getUpsellSessionData = () => {
  const orderData = JSON.parse(sessionStorage.getItem("orderData"));
  const lastOrderId = sessionStorage.getItem("cms_oid");
  const addressData = JSON.parse(sessionStorage.getItem("addressData"));
  const offerIdFromOrderData = orderData.offers[0].offer_id;
  return { orderData, lastOrderId, addressData, offerIdFromOrderData };
};

const getUniqueSelectedProductIds = () => {
  const productIds = Array.from(document.querySelectorAll("[data-product-id]:not([data-product-card])"))
    .map((el) => Number(el.getAttribute("data-product-id")))
    .filter((value) => !isNaN(value));
  const selectedProducts = prices.filter((price) =>
    productIds.includes(price.id)
  );
  const productSelectedFromUI = document.querySelector(".product-card-active")?.getAttribute("data-product-id");
  if (productSelectedFromUI) {
    selectedProducts.push(prices.find((price) => price.id === Number(productSelectedFromUI)));
  }
  const uniqueSelectedProductIds = [...new Set(selectedProducts.map((product) => product.id))];
  if (uniqueSelectedProductIds.length === 0) {
    throw new Error("Missing product configuration/binding");
  }
  return uniqueSelectedProductIds;
};

const isRecurringProduct = (productId) => {
  const offerData = getVrioOfferIdByProductId(productId);
  return Boolean(offerData?.isRecurringOffer);
};

function getParams() {
  let queryString = window.location.search;

  if (
    (!queryString || queryString === "") &&
    window.location.hash.includes("?")
  ) {
    const hashPart = window.location.hash.split("?")[1];
    queryString = "?" + hashPart;
  }

  return new URLSearchParams(queryString);
}

function setUpsellButtonsDisabled(isDisabled) {
  const actionButtons = document.querySelectorAll(
    "[data-submit-button], [data-decline-button]"
  );
  actionButtons.forEach((button) => {
    if (isDisabled) {
      button.setAttribute("disabled", "disabled");
      button.style.pointerEvents = "none";
      return;
    }
    button.removeAttribute("disabled");
    button.style.pointerEvents = "";
  });
}

function isOrderAlreadyCompletedError(err) {
  const code = err?.error?.code || err?.code;
  const message = (err?.error?.message || err?.message || "").toLowerCase();
  return (
    code === "order_already_completed" ||
    message.includes("order is already complete")
  );
}

function showErrorAndRedirect(msg, redirectTarget = "checkout") {
  const checkoutUrl = sessionStorage.getItem("checkoutUrl") || "/";
  const nextPageUrl = getNextPageSlugForRedirect();

  let targetUrl = redirectTarget === "nextPage" ? nextPageUrl : checkoutUrl;
  if (redirectTarget !== "nextPage" && targetUrl) {
    try {
      const url = new URL(checkoutUrl);
      url.searchParams.set("error", msg);
      targetUrl = url.toString();
    } catch (error) {
      console.error("Error setting error parameter in URL", error);
    }
  }

  const errorEl = document.querySelector("[data-general-error]");
  const isAutoSkipScreenVisible =
    document.getElementById(AUTO_SKIP_SCREEN_ID)?.style.display === "flex" ?? false;
  if (isAutoSkipScreenVisible || !errorEl) {
    showToast(msg);
  } else {
    errorEl.innerText = msg;
    errorEl.style.display = "block";
  }
  if (targetUrl) {
    setUpsellButtonsDisabled(true);
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 5000);
  }
}

const runDeclineFlow = async ({ isAutoSkip = false } = {}) => {
  if (!isAutoSkip) {
   MVMT.track("CTA_CLICK", {
    page: "upsell2",
    page_type: "Upsell",
    page_url: window.location.href
  });
  }

  if (isKlarnaPayment && !HAS_FOLLOWING_UPSELLS && typeof declineKlarnaUpsell === "function") {
    await declineKlarnaUpsell();
    return;
  }

  window.location.href = getNextPageSlugForRedirect();
};


const extractKlarnaLivemode = (gatewayResponseText) => {
  try {
    const gatewayData = JSON.parse(gatewayResponseText);
    const entry = Array.isArray(gatewayData) ? gatewayData[0] : gatewayData;
    if (entry && entry.livemode !== undefined) return entry.livemode;
  } catch (error) {
    console.error("Error extracting Klarna livemode", error);
  }
  return undefined;
}
const processAndRedirectToKlarna = async (orderId, redirectUrl) => {
  if (isTest) console.log("Klarna: processing order", orderId);

  const orderData = JSON.parse(sessionStorage.getItem("orderData") || "null") || {};
  const merchantId = orderData?.merchant_id ?? orderData?.merchantId ?? null;
  const finalRedirectUrl = redirectUrl || window.location.href;

  const processResponse = await fetch(
    `https://app-cms-api-proxy-staging-001.azurewebsites.net/vrio/orders/${orderId}/process`,
    {
      method: "POST",
      headers: {
        authorization: `appkey ${INTEGRATION_ID}`,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify({
        redirect_url: finalRedirectUrl,
        payment_method_id: 12,
        ...(merchantId ? { merchant_id: merchantId } : {})
      })
    }
  );

  const processResult = await processResponse.json();

  if (isTest) console.log("Klarna process response:", processResult);

  if (
    !processResponse.ok ||
    (processResult && processResult.error) ||
    !processResult.post_data
  ) {
    const code = processResult?.error?.code || processResult?.code || null;
    const msg =
      (processResult && processResult.error && processResult.error.message) ||
      (processResult && processResult.message) ||
      i18n.errors.systemErrorGeneric;
    const error = new Error(msg);
    error.code = code;
    if (processResult?.error) {
      error.error = processResult.error;
    }
    throw error;
  }

  const livemode = extractKlarnaLivemode(processResult.gateway_response_text);
  if (livemode !== undefined) {
    sessionStorage.setItem("klarna_livemode", JSON.stringify(livemode));
  }

  window.location.href = processResult.post_data;
}
async function returnKlarna() {
  const params = getParams();
  const paymentIntent = params.get("payment_intent");
  const orderId = sessionStorage.getItem("cms_oid");

  if (!paymentIntent) return;

  const preload = document.querySelector("[data-preloader]");
  if (preload) preload.style.display = "flex";

  if (!orderId) {
    console.error("Klarna return: no order ID found in sessionStorage");
    if (preload) preload.style.display = "none";
    showErrorAndRedirect(i18n.errors.orderNotFoundRedirect, "checkout");
    return;
  }

  const orderData = JSON.parse(sessionStorage.getItem("orderData") || "null") || {};
  const merchantId = orderData?.merchant_id ?? orderData?.merchantId ?? null;

  try {
    const response = await fetch(
      `https://app-cms-api-proxy-staging-001.azurewebsites.net/vrio/orders/${orderId}/complete`,
      {
        method: "POST",
        headers: {
          authorization: `appkey ${INTEGRATION_ID}`,
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          transaction_token: paymentIntent,
          ...(merchantId ? { merchant_id: merchantId } : {})
        })
      }
    );

    const result = await response.json();

    if (isTest && window.location.hostname === "localhost") {
      console.log("Klarna complete response:", result);
    }

    let isLive = extractKlarnaLivemode(result.gateway_response_text);
    if (isLive === undefined) {
      const stored = sessionStorage.getItem("klarna_livemode");
      isLive = stored !== null ? JSON.parse(stored) : true;
    }

    const resultOrderId = result.order_id || orderId;

    if (result.success) {
      if (isLive === false) await flagOrderAsTest(resultOrderId);

      sessionStorage.removeItem("cart_token");
      sessionStorage.removeItem("klarna_livemode");
      sessionStorage.setItem("cms_oid", resultOrderId);
      sessionStorage.setItem("orderids", JSON.stringify([resultOrderId]));
      MVMT.track("ORDER_SUCCESS", {
        page: "upsell2",
        page_type: "Upsell",
        page_url: window.location.href,
        order_data: orderData,
        response: result,
      });
      try {
        sendTransactionToDataLayer(vrioToTransaction(result), "Klarna");
      } catch (e) {
        console.warn("Klarna: could not send transaction to data layer", e);
      }
      try {
        if (typeof validateAndSendToKlaviyo === "function") {
          const klaviyoPostOrderData = {
            ...orderData,
            vrio_order_id: resultOrderId,
            vrio_response_status: "success",
          };
          await validateAndSendToKlaviyo(
            klaviyoPostOrderData,
            "Order Success - VRIO Confirmation",
            "order"
          );
        }
      } catch (error) {
        console.error("Error sending transaction to data layer", error);
      }
      try {
        if (typeof sendKlaviyoOrderEvents === 'function') {
          await sendKlaviyoOrderEvents(orderData, result, true);
        }
      } catch (error) {
        console.error("Error sending order events to Klaviyo", error);
      }
      const redirectSlug =
        typeof nextPageSlug === "string" && nextPageSlug.length > 0
          ? nextPageSlug.startsWith("/")
            ? nextPageSlug
            : "/" + nextPageSlug
          : "/";
      window.location.href = redirectSlug;
    } else {
      if (!isLive) await flagOrderAsTest(resultOrderId);

      if (isTest) console.error("Klarna complete error:", result);
      const msg =
        (result && result.error && result.error.message) ||
        (result && result.message) ||
        i18n.errors.klarnaCompletionFailed;
      if (window.MVMT) {
        MVMT.track("ORDER_ERROR", {
          page: "upsell2",
          page_type: "Upsell",
          page_url: window.location.href,
          order_data: orderData,
          response: result,
        });
      }
      if (preload) preload.style.display = "none";
      if (isOrderAlreadyCompletedError(result)) {
        showErrorAndRedirect(
          msg || i18n.errors.orderAlreadyCompleteRedirect,
          "nextPage"
        );
        return;
      }
      showErrorAndRedirect(msg, "checkout");
    }
  } catch (error) {
    if (isTest) console.error("Klarna complete error:", error);
    const storedLive = sessionStorage.getItem("klarna_livemode");
    if (storedLive !== null && JSON.parse(storedLive) === false) {
      await flagOrderAsTest(orderId);
    }
    if (window.MVMT) {
      MVMT.track("ORDER_ERROR", {
        page: "upsell2",
        page_type: "Upsell",
        page_url: window.location.href,
        order_data: orderData,
        error: error.message || error,
      });
    }
    if (preload) preload.style.display = "none";
    if (isOrderAlreadyCompletedError(error)) {
      showErrorAndRedirect(
        error?.message || i18n.errors.orderAlreadyCompleteRedirect,
        "nextPage"
      );
      return;
    }
    showErrorAndRedirect(i18n.errors.unexpectedErrorRedirect, "checkout");
  }
}

const declineKlarnaUpsell = async () => {
  if (!isKlarnaPayment) {
    showErrorAndRedirect(
      "Klarna is not available",
      "checkout"
    );
    return;
  }
  setUpsellButtonsDisabled(true);

  const preload = document.querySelector("[data-preloader]");
    if (preload) preload.style.display = "flex";
  const errorEl = document.querySelector("[data-general-error]");
  if (errorEl) {
    errorEl.style.display = "none";
    errorEl.innerText = "";
  }
  try {
    const lastOrderId = sessionStorage.getItem("cms_oid");
    if (!lastOrderId) {
      throw new Error("No order ID found in session");
    }

    if (isTest)
      console.log(
        "Klarna: declining upsell, processing order without new offers",
        lastOrderId
      );

    await processAndRedirectToKlarna(lastOrderId, removeKlarnaParamsFromUrl());
  } catch (error) {
    console.error(error);
    if (isOrderAlreadyCompletedError(error)) {
      showErrorAndRedirect(
        error?.message ||
          i18n.errors.orderAlreadyCompleteRedirect,
        "nextPage"
      );
      return;
    }
    showErrorAndRedirect(
      error.message || i18n.errors.unexpectedErrorRedirect,
      "checkout"
    );
  } finally {
    if (preload) preload.style.display = "none";
    setUpsellButtonsDisabled(false);
  }
};


const processKlarnaUpsell = async () => {
  if (!isKlarnaPayment) {
    throw new Error("Klarna is not available");
  }
  setUpsellButtonsDisabled(true);

  const preload = document.querySelector("[data-preloader]");
  if (preload) preload.style.display = "flex";
  const errorEl = document.querySelector("[data-general-error]");
  if (errorEl) {
    errorEl.style.display = "none";
    errorEl.innerText = "";
  }
  try {
    const { orderData, lastOrderId, offerIdFromOrderData } =
      getUpsellSessionData();

    if (!lastOrderId) {
      throw new Error("No order ID found in session");
    }

    // Build offers to add via API (each offer gets a unique id to force new entries)
    const offers = [];

    const uniqueSelectedProductIds = getUniqueSelectedProductIds();
    uniqueSelectedProductIds.forEach((selectedProductId) => {
      const selectedProductOfferData = getVrioOfferIdByProductId(selectedProductId);
      if (selectedProductOfferData?.isRecurringOffer) {
        return;
      }
      const selectedProductOfferId =
        selectedProductOfferData.offerId ?? offerIdFromOrderData;
      const isVipProduct = Boolean(
        isVipUpsell && selectedProductOfferData.isRecurringOffer
      );
      offers.push({
        id: crypto.randomUUID(),
        offer_id: selectedProductOfferId,
        order_offer_quantity: 1,
        item_id: selectedProductId,
        order_offer_upsell: true,
        parent_offer_id: offerIdFromOrderData,
        ...(isVipProduct ? { order_offer_price: "0.00" } : {})
      });

      const productElement = getProductElement(selectedProductId);
      saveProductCustomData(productElement);
      let { product, quantity } =
        getBindedShippableProductAndQuantity(productElement) ?? {};
      if (product) {
        const bindedProductOfferData = getVrioOfferIdByProductId(product.id);
        if (bindedProductOfferData?.isRecurringOffer) {
          return;
        }
        const bindedProductOfferId =
          bindedProductOfferData.offerId ?? selectedProductOfferId;
        offers.push({
          id: crypto.randomUUID(),
          offer_id: bindedProductOfferId,
          order_offer_upsell: true,
          parent_offer_id: offerIdFromOrderData,
          item_id: product.id,
          order_offer_quantity: quantity
        });
      }
    });

    if (offers.length === 0) {
      throw new Error(i18n.errors.klarnaNotAvailableRecurring);
    }

    if (isTest)
      console.log("Klarna: adding upsell offers via /order_offers", {
        order_id: lastOrderId,
        offers
      });

    MVMT.track("UPSELL_SUBMITTED", {
      page: "upsell2",
      page_type: "Upsell",
      page_url: window.location.href,
      order_id: lastOrderId,
      offers
    });
    MVMT.track("CTA_CLICK", {
      page: "upsell2",
      page_type: "Upsell",
      page_url: window.location.href
    });

    // Add offers to existing order via API
    const response = await fetch(
      `https://app-cms-api-proxy-staging-001.azurewebsites.net/vrio/order_offers`,
      {
        method: "POST",
        headers: {
          authorization: `appkey ${INTEGRATION_ID}`,
          "Content-Type": "application/json; charset=utf-8"
        },
        body: JSON.stringify({
          offers: offers.map((o) => JSON.stringify(o)),
          order_id: lastOrderId,
          pageId: "TY69WSSqO0cAeLG2h9s_KVt3YXXMg3DHtSy84WUhKV4qxsODIwi1UwSVhDweLh2L"
        })
      }
    );

    const result = await response.json();

    if (isTest) console.log("Klarna order_offers response:", result);

    if (!response.ok) {
      const msg =
        (result && result.error && result.error.message) ||
        (result && result.message) ||
        i18n.errors.upsellOrderFailed;
      throw new Error(msg);
    }

    const newOrderData = {
      ...orderData,
      offers: [...(orderData.offers || []), ...offers]
    };
    const orderids = JSON.parse(sessionStorage.getItem("orderids")) || [];
    if (!orderids.includes(lastOrderId)) {
      sessionStorage.setItem("orderids", JSON.stringify([...orderids, lastOrderId]));
    }
    sessionStorage.setItem("cms_oid", String(lastOrderId));
    const orderSummaryData = JSON.parse(sessionStorage.getItem("orderSummary")) || [];
    orderSummaryData.push({
      order_id: lastOrderId,
      order_offers: offers,
      source: "klarna_upsell_order_offers"
    });
    sessionStorage.setItem("orderSummary", JSON.stringify(orderSummaryData));
    sessionStorage.setItem("orderData", JSON.stringify(newOrderData));
    sessionStorage.setItem(
      "productCustomData",
      JSON.stringify(productCustomData)
    );

    if (!HAS_FOLLOWING_UPSELLS && typeof processAndRedirectToKlarna === "function") {
    await processAndRedirectToKlarna(lastOrderId, removeKlarnaParamsFromUrl());
    } else {
      window.location.href = getNextPageSlugForRedirect();
    }
  } catch (error) {
    console.error(error);
    if (isOrderAlreadyCompletedError(error)) {
      showErrorAndRedirect(
        error?.message ||
          i18n.errors.orderAlreadyCompleteRedirect,
        "nextPage"
      );
      return;
    }
    if (errorEl) {
      errorEl.innerText =
        error?.message || i18n.errors.unexpectedError;
      errorEl.style.display = "block";
    } else {
      showToast(error?.message || i18n.errors.unexpectedError);
    }

  } finally {
    if (preload) preload.style.display = "none";
    setUpsellButtonsDisabled(false);
  }
};

const processUpsell = async () => {
  setUpsellButtonsDisabled(true);
  
  const preload = document.querySelector("[data-preloader]");
  if (preload) preload.style.display = "flex";
  const errorEl = document.querySelector("[data-general-error]");
  if (errorEl) {
    errorEl.style.display = "none";
    errorEl.innerText = "";
  }
  try {
    const orderData = JSON.parse(sessionStorage.getItem("orderData"));
    orderData.pageId = "TY69WSSqO0cAeLG2h9s_KVt3YXXMg3DHtSy84WUhKV4qxsODIwi1UwSVhDweLh2L";
    const lastOrderId = sessionStorage.getItem("cms_oid");
    const stripePayment = JSON.parse(sessionStorage.getItem("stripePayment"));
    const isStripeTestOrder = stripePayment && !stripePayment.isLive;
    const orderSummaryData =
      JSON.parse(sessionStorage.getItem("orderSummary")) || [];
    const customerCardId =
      orderSummaryData[0]?.order?.customer_card_id ||
      orderSummaryData[0]?.customer_card_id;
    const cartToken = await createCart(orderData);
    const offerIdFromOrderData = orderData.offers?.[0]?.offer_id;
    let shippingProfileId;
    orderData.offers = [];

    const uniqueSelectedProductIds = getUniqueSelectedProductIds();
    uniqueSelectedProductIds.forEach( (selectedProductId) => {
      const selectedProductOfferData = getVrioOfferIdByProductId(selectedProductId);
      const selectedProductOfferId =
        selectedProductOfferData.offerId ?? offerIdFromOrderData;
      const isVipProduct = Boolean(
        isVipUpsell &&
          selectedProductOfferData.isRecurringOffer,
      );
      orderData.offers.push({
          offer_id: selectedProductOfferId,
          order_offer_quantity: 1,
          item_id: selectedProductId,

          order_offer_upsell: true,
          parent_offer_id: offerIdFromOrderData,
          parent_order_id: lastOrderId,
          ...(isVipProduct ? { order_offer_price: "0.00" } : {})
      })

      const productElement = getProductElement((selectedProductId));
      saveProductCustomData(productElement);
      let { product, quantity } = getBindedShippableProductAndQuantity(productElement) ?? {};
      if (product) {
        shippingProfileId = +document.querySelector(`[data-shippable-product-id="${product.id}"]`)?.getAttribute('data-shipping-profile-id') || undefined;
        const bindedProductOfferData = getVrioOfferIdByProductId(product.id);
        const bindedProductOfferId =
          bindedProductOfferData.offerId ?? selectedProductOfferId;
        orderData.offers.push({
          offer_id: bindedProductOfferId,
          order_offer_upsell: true,
          parent_offer_id: offerIdFromOrderData,
          parent_order_id: lastOrderId,
          item_id: product.id,
          order_offer_quantity: quantity,
        });
      }
    })

    orderData.cart_token = cartToken;

    if (customerCardId) {
      orderData.customer_card_id = customerCardId;
    }

    sessionStorage.setItem("cart_token", cartToken);
    const addressData = JSON.parse(sessionStorage.getItem("addressData"));

    const sanitizedOrderData = removeObjectUndefinedProperties(!orderData.email ? {...orderData, ...addressData} : orderData);

    if (isTest) console.log("Sending upsell to VRIO", orderData);
    MVMT.track("UPSELL_SUBMITTED", {
      page: "upsell2",
      page_type: "Upsell",
      page_url: window.location.href,
      order_data: orderData,
    });

    const response = await fetch(
      `https://app-cms-api-proxy-staging-001.azurewebsites.net/vrio/orders`,
      {
        method: "POST",
        headers: {
          authorization: `appkey ${INTEGRATION_ID}`,
          "Content-Type": "application/json; charset=utf-8",
        },
            body: JSON.stringify({
          ...sanitizedOrderData,
          campaign_id: CAMPAIGN_ID,
          order_id: lastOrderId,
          shipping_profile_id: shippingProfileId,
          tracking12: window.location.href
        }),
      }
    );

    const result = await response.json();
    console.log(result);

    if (isStripeTestOrder && result.order_id) {
      await flagOrderAsTest(result.order_id);
    }

    if (stripePayment && result && result.response_code === 101) {
      if (errorEl) {
        errorEl.innerText =
          i18n.errors.walletVerificationFailed;
        errorEl.style.display = "block";
      }
      if (window.MVMT) {
        MVMT.track("UPSELL_ERROR", {
          page: "upsell2",
          page_type: "Upsell",
          page_url: window.location.href,
          order_data: orderData
        });
      }
      return;
    }

    if (!response.ok || (result && result.error) || !result.order_id) {
      console.error("Something went wrong");
      if (preload) preload.style.display = "none";
      const msg =
        (result && result.error && result.error.message) ||
        (result && result.message) ||
        i18n.errors.walletOrderFailed;

      if (errorEl) {
        errorEl.innerText = msg;
        errorEl.style.display = "block";
      } else {
        showToast(msg);
      }
      MVMT.track("UPSELL_ERROR", {
        page: "upsell2",
        page_type: "Upsell",
        page_url: window.location.href,
        order_data: orderData,
      });
      return;
    }

    MVMT.track("UPSELL_SUCCESS", {
      page: "upsell2",
      page_type: "Upsell",
      page_url: window.location.href,
      order_data: orderData,
    });
    MVMT.track("CTA_CLICK", {
      page: "upsell2",
      page_type: "Upsell",
      page_url: window.location.href,
    });

    if (isTest) console.log(result);

    const orderDataSummary = JSON.parse(sessionStorage.getItem("orderSummary")) || [];
    orderDataSummary.push(result);
    sessionStorage.setItem("orderSummary", JSON.stringify(orderDataSummary));

    sessionStorage.setItem("cms_oid", result.order_id);
    sessionStorage.setItem("orderData", JSON.stringify(sanitizedOrderData));
    const orderids = JSON.parse(sessionStorage.getItem("orderids")) || [];
    sessionStorage.setItem("orderids", JSON.stringify([...orderids, result.order_id]));
    sessionStorage.setItem("productCustomData", JSON.stringify(productCustomData));

    const paymentMethodId = sanitizedOrderData.payment_method_id;

    const paymentMethodNames = {
      [PAYMENT_METHODS_IDS.creditCard]: "creditCard",
      [PAYMENT_METHODS_IDS.googlePay]: "Google Pay",
      [PAYMENT_METHODS_IDS.applePay]: "Apple Pay",
      [PAYMENT_METHODS_IDS.paypal]: "PayPal",
      [PAYMENT_METHODS_IDS.klarna]: "Klarna"
    };

    const paymentMethodName = paymentMethodNames[paymentMethodId] || paymentMethodNames[PAYMENT_METHODS_IDS.creditCard];
    
    sendTransactionToDataLayer(vrioToTransaction(result), paymentMethodName);

    try {
      if (typeof sendKlaviyoOrderEvents === 'function') {
        await sendKlaviyoOrderEvents(sanitizedOrderData, result);
      }
    } catch (error) {
      console.error("Error sending order events to Klaviyo", error);
    }

    window.location.href = getNextPageSlugForRedirect();
  } catch (error) {
    console.error(error);
    if (errorEl) {
      errorEl.innerText = i18n.errors.unexpectedError;
      errorEl.style.display = "block";
    } else {
      showToast(i18n.errors.unexpectedError);
    }
  } finally {
    if (preload) preload.style.display = "none";
    setUpsellButtonsDisabled(false);
  }
};

const areAllProductsRecurring = () => {
  const pageProductIds = getUniqueSelectedProductIds();
  return pageProductIds.length > 0 && pageProductIds.every((productId) => isRecurringProduct(productId));
}



document.addEventListener("DOMContentLoaded", async () => {
  
(function ensurePreloaderExists() {
    const existing = document.querySelector('[data-preloader]');
    if (existing) {
        if (!existing.getAttribute('data-testid')) {
            existing.setAttribute('data-testid', 'preloader');
        }
        const spinner = existing.querySelector('.loader');
        if (spinner && !spinner.getAttribute('data-testid')) {
            spinner.setAttribute('data-testid', 'preloader-spinner');
        }
        return;
    }
    const loaderOverlay = document.createElement('div');
    loaderOverlay.setAttribute('data-preloader', '');
    loaderOverlay.setAttribute('data-testid', 'preloader');
    loaderOverlay.innerHTML = `
        <div class="loader" data-testid="preloader-spinner"></div>
        <p>${i18n.labels.processing}</p>
    `;

    const loaderStyles = `
        [data-preloader] {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 8px;
            background: rgba(255, 255, 255, 0.3);
            z-index: 9999;
        }
        [data-preloader] .loader {
            width: 48px;
            height: 48px;
            border-bottom-color: transparent !important;
            border-radius: 50%;
            display: inline-block;
            box-sizing: border-box;
            animation: rotation 1s linear infinite;
            margin-top: 22px;
            border: 5px solid rgb(18, 76, 117);
        }

        @keyframes rotation {
            0% {
                transform: rotate(0deg);
            }

            100% {
                transform: rotate(360deg);
            }
        }
    `;
    document.head.insertAdjacentHTML('beforeend', `<style>${loaderStyles}</style>`);
    document.body.appendChild(loaderOverlay);
})();

  
if (typeof validateAndSendToKlaviyo === "function") {
  try {
    var klaviyoDebugEnabled = false;
    try {
      klaviyoDebugEnabled = typeof isKlaviyoDebugEnabled === "function"
        ? isKlaviyoDebugEnabled()
        : !!(typeof window !== "undefined" && window.__KLAVIYO_DEBUG__ === true);
    } catch (e) {}
    var pageReadyPayload = {
      id: "log_" + Date.now() + "_" + Math.random().toString(16).slice(2, 8),
      timestamp: Date.now(),
      location: "builder-events/upsell/vrio-upsell-js-generator.ts" + ":KlaviyoLifecycle:page_ready",
      message: "Klaviyo lifecycle: page ready",
      runId: "initial",
      hypothesisId: "KlaviyoLifecycle",
      data: { pageName: "upsell2", pageType: "Upsell" },
    };
    if (klaviyoDebugEnabled && typeof console !== "undefined" && console.log) {
      console.log("[Klaviyo lifecycle] page_ready " + JSON.stringify(pageReadyPayload.data));
    }
  } catch (e) {}
}

  const isKlarnaReturnFlow = Boolean(getParams().get("payment_intent"));
  const shouldAutoSkip = isKlarnaPayment && isVipUpsell && areAllProductsRecurring();
  if (shouldAutoSkip) {
    const screen = getOrCreateVipAutoSkipScreen();
    screen.style.display = "flex";
  }
  
  if (isKlarnaPayment) {
    setUpsellButtonsDisabled(true);
    try {
      await returnKlarna();
    } finally {
      setUpsellButtonsDisabled(false);
    }
  }
  applyKlarnaVisibility();

  if (shouldAutoSkip && !isKlarnaReturnFlow) {
    try {
      await runDeclineFlow({ isAutoSkip: true });
      return;
    } catch (error) {
      console.error("Failed to auto-skip VIP recurring page", error);
      const screen = getOrCreateVipAutoSkipScreen();
      screen.style.display = "none";
    }
  }

  const upsellPrice = await getPrices(prices);

  const takeUpsellBtns = document.querySelectorAll("[data-submit-button]");
  const refuseUpsellBtns = document.querySelectorAll("[data-decline-button]");
  const selectableProductsFromUI = document.querySelectorAll("[data-product-card]");

  takeUpsellBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      if (isKlarnaPayment) {
        await processKlarnaUpsell();
      } else {
        await processUpsell();
      }
    });
  });
  refuseUpsellBtns.forEach((btn) => {
    btn.addEventListener("click", async () => {
      await runDeclineFlow();
    });
  });
  selectableProductsFromUI?.forEach((productEl) => {
    productEl.addEventListener("click", () => {
      selectableProductsFromUI.forEach((productEl) => {
        productEl.classList.remove("product-card-active");
      });
      productEl.classList.add("product-card-active");
    });
  });
});
const vrioToTransaction = (orderResult) => {
  return {
    orderId: orderResult.order_id.toString(),
    customerId: orderResult.customer_id || orderResult.customerId,
    subtotal: orderResult.order.cart?.subtotal,
    tax: orderResult.order.cart?.total_tax,
    shippingAmount: orderResult.order.cart?.total_shipping,
    shippingMethod: orderResult.order.cart?.order.shipping_profile_id,
    total: orderResult.order.cart?.total,
    grandTotal: orderResult.order.cart?.total,
    isTestOrder: orderResult.order.is_test,
    line_items: orderResult.order.cart.offers.map((item) => {
      return {
        product_id: item.item_id,
        productName: item.item_name,
        quantity: item.order_offer_quantity,
        discount: item.discount,
        discountCode: item.discount_code,
        price: Number(item.total)
      }
    }),
    discountAmount: Number(orderResult.order.cart?.total_discount) || 0,
    couponCode: orderResult.order.cart?.order.discount_code || '',
  }
};;
const sendTransactionToDataLayer = (response, paymentOption) => {
  const details = Array.isArray(response) ? response.at(-1) : response;
  const customerId = details.customerId || details.customer_id;
  const address = JSON.parse(sessionStorage.getItem('addressData'));
  sessionStorage.setItem('customerId', customerId);
  const transaction = {
    event: 'transaction',
    offer: offerName,
    customer_id: details.customerId.toString(),
    page: {
      type: "Upsell",
      isReload: performance.getEntriesByType('navigation')[0].type === 'reload',
      isExclude: false,
    },
    order: {
      id: details.orderId.toString(),
      subtotal: parseFloat(details.subtotal),
      tax: parseFloat(details.tax),
      shippingAmount: parseFloat(details.shippingAmount),
      shippingMethod: details.shippingMethod,
      paymentMethod: paymentOption,
      total: parseFloat(details.total),
      grandTotal: parseFloat(details.grandTotal),
      count: 1,
      step: "Upsell",
      isTestOrder: isTest || details.isTestOrder,
      product: details.line_items
        .reduce((acc, curr) => {
          if (acc.find((item) => item.product_id === curr.product_id)) {
            curr.quantity += acc.find(
              (item) => item.product_id === curr.product_id
            ).quantity;
          }
          return [...acc, curr];
        }, [])
        .map((item) => {
          const p = prices.find((p) => p.id === +item.product_id);
          let qty = 1;
          const productEl = document.querySelector(
            `[data-product-id="${item.product_id}"]`
          );
          if (productEl) qty = Number(productEl.dataset.productQuantity) || 1;
          if (p) {
            return {
              type: offerName,
              name: p.productName,
              price: item.price,
              regprice: p.fullPrice,
              individualPrice: item.price / (qty * item.quantity),
              quantity: item.quantity,
              packageQuantity: qty,
              group: "upsell",
            };
          }
          const variant = shippables.find((s) => s.id === +item.product_id);
          if (variant) {
            return {
              type: offerName,
              name: variant.name,
              price: 0.00,
              regprice: 0.00,
              individualPrice: 0.00,
              quantity: item.quantity,
              packageQuantity: 1,
              group: "upsell",
            };
          }
        }),
    },
    customer: {
      billingInfo: {
        address1: address.billingAddress1 ?? address.bill_address1,
        address2: address.billingAddress2 ?? address.bill_address2,
        city: address.billingCity ?? address.bill_city,
        country: address.billingCountry ?? address.bill_country,
        state: address.billingState ?? address.bill_state,
        postalCode: address.billingZip ?? address.bill_zipcode,
      },
      shippingInfo: {
        firstName: address.firstName ?? address.ship_fname,
        lastName: address.lastName ?? address.ship_lname,
        address1: address.shippingAddress1 ?? address.ship_address1,
        address2: address.shippingAddress2 ?? address.ship_address2,
        city: address.shippingCity ?? address.ship_city,
        countryCode: address.shippingCountry ?? address.ship_country,
        state: address.shippingState ?? address.ship_state,
        postalCode: address.shippingZip ?? address.ship_zipcode,
        emailAddress: address.email,
        phoneNumber: address.phone,
      },
    },
  };
  if (Number(details.discountAmount) > 0) {
    transaction.order.couponCode = details.couponCode;
  } else {
    transaction.order.couponCode = '';
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(transaction);
};
  