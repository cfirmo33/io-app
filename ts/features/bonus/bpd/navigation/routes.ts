const BPD_ROUTES = {
  MAIN: "BPD_ROUTES_MAIN",

  ONBOARDING: {
    MAIN: "BPD_ONBOARDING_ROUTES_MAIN",
    LOAD_CHECK_ACTIVATION_STATUS: "BPD_LOAD_CHECK_ACTIVATION_STATUS",
    INFORMATION_TOS: "BPD_INFORMATION_TOS",
    DECLARATION: "BPD_DECLARATION",
    LOAD_ACTIVATE_BPD: "BPD_LOAD_ACTIVATE_BPD",
    ENROLL_PAYMENT_METHODS: "BPD_ENROLL_PAYMENT_METHODS",
    NO_PAYMENT_METHODS: "BPD_NO_PAYMENT_METHODS",
    ERROR_PAYMENT_METHODS: "ERROR_PAYMENT_METHODS"
  },
  IBAN_MAIN: "BPD_IBAN_ROUTES_MAIN",
  IBAN: "BPD_IBAN",

  DETAILS_MAIN: "BPD_DETAILS_ROUTES_MAIN",
  DETAILS: "BPD_DETAILS",
  TRANSACTIONS: "BPD_TRANSACTIONS",
  // used from message CTA
  CTA_START_BPD: "CTA_START_BPD",
  CTA_BPD_IBAN_EDIT: "CTA_BPD_IBAN_EDIT",
  OPT_IN_PAYMENT_METHODS: {
    MAIN: "OPT_IN_PAYMENT_METHODS_MAIN",
    CASHBACK_UPDATE: "OPT_IN_PAYMENT_METHODS_CASHBACK_UPDATE",
    CHOICE: "OPT_IN_PAYMENT_METHODS_CHOICE",
    THANK_YOU_KEEP_METHOD: "OPT_IN_PAYMENT_METHODS_THANK_YOU_KEEP_METHODS",
    THANK_YOU_DELETE_METHOD: "OPT_IN_PAYMENT_METHODS_THANK_YOU_DELETE_METHODS"
  }
};

export default BPD_ROUTES;
