const CGN_ROUTES = {
  ACTIVATION: {
    MAIN: "CGN_ACTIVATION_MAIN",
    INFORMATION_TOS: "CGN_INFORMATION_TOS",
    LOADING: "CGN_ACTIVATION_LOADING",
    EXISTS: "CGN_ACTIVATION_EXISTS",
    TIMEOUT: "CGN_ACTIVATION_TIMEOUT",
    INELIGIBLE: "CGN_ACTIVATION_INELIGIBLE",
    PENDING: "CGN_ACTIVATION_PENDING",
    COMPLETED: "CGN_ACTIVATION_COMPLETED",
    CTA_START_CGN: "CTA_START_CGN"
  },
  EYCA: {
    ACTIVATION: {
      MAIN: "CGN_EYCA_MAIN",
      LOADING: "CGN_EYCA_ACTIVATION_LOADING"
    } as const
  },
  DETAILS: {
    MAIN: "CGN_DETAILS_MAIN",
    DETAILS: "CGN_DETAILS",
    MERCHANTS: {
      CATEGORIES: "CGN_MERCHANTS_CATEGORIES",
      LIST: "CGN_MERCHANTS_LIST",
      LIST_BY_CATEGORY: "CGN_MERCHANTS_LIST_BY_CATEGORY",
      TABS: "CGN_MERCHANTS_TABS",
      DETAIL: "CGN_MERCHANTS_DETAIL",
      LANDING_WEBVIEW: "CGN_MERCHANTS_LANDING_WEBVIEW"
    }
  }
} as const;

export default CGN_ROUTES;
