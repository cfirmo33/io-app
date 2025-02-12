import { createCompatNavigatorFactory } from "@react-navigation/compat";
import { createStackNavigator } from "@react-navigation/stack";
import { PathConfigMap } from "@react-navigation/core";
import CgnActivationCompletedScreen from "../screens/activation/CgnActivationCompletedScreen";
import CgnActivationIneligibleScreen from "../screens/activation/CgnActivationIneligibleScreen";
import CgnActivationLoadingScreen from "../screens/activation/CgnActivationLoadingScreen";
import CgnActivationPendingScreen from "../screens/activation/CgnActivationPendingScreen";
import CgnActivationTimeoutScreen from "../screens/activation/CgnActivationTimeoutScreen";
import CgnAlreadyActiveScreen from "../screens/activation/CgnAlreadyActiveScreen";
import CgnCTAStartActivationScreen from "../screens/activation/CgnCTAStartActivationScreen";
import CgnInformationScreen from "../screens/activation/CgnInformationScreen";
import CgnDetailScreen from "../screens/CgnDetailScreen";
import EycaActivationLoading from "../screens/eyca/activation/EycaActivationLoading";
import CgnMerchantDetailScreen from "../screens/merchants/CgnMerchantDetailScreen";
import CgnMerchantLandingWebview from "../screens/merchants/CgnMerchantLandingWebview";
import CgnMerchantsCategoriesSelectionScreen from "../screens/merchants/CgnMerchantsCategoriesSelectionScreen";
import CgnMerchantsListByCategory from "../screens/merchants/CgnMerchantsListByCategory";
import MerchantsListScreen from "../screens/merchants/CgnMerchantsListScreen";
import CgnMerchantsTabsScreen from "../screens/merchants/CgnMerchantsTabsScreen";
import CGN_ROUTES from "./routes";

export const cgnLinkingOptions: PathConfigMap = {
  [CGN_ROUTES.DETAILS.MAIN]: {
    path: "cgn-details",
    screens: {
      [CGN_ROUTES.DETAILS.DETAILS]: "detail",
      [CGN_ROUTES.DETAILS.MERCHANTS.CATEGORIES]: "categories",
      [CGN_ROUTES.DETAILS.MERCHANTS.LIST_BY_CATEGORY]:
        "categories-merchant/:category"
    }
  },
  [CGN_ROUTES.ACTIVATION.MAIN]: {
    path: "cgn-activation",
    screens: {
      [CGN_ROUTES.ACTIVATION.CTA_START_CGN]: "start"
    }
  }
};

export const CgnActivationNavigator = createCompatNavigatorFactory(
  createStackNavigator
)(
  {
    [CGN_ROUTES.ACTIVATION.INFORMATION_TOS]: {
      screen: CgnInformationScreen
    },
    [CGN_ROUTES.ACTIVATION.LOADING]: {
      screen: CgnActivationLoadingScreen
    },
    [CGN_ROUTES.ACTIVATION.PENDING]: {
      screen: CgnActivationPendingScreen
    },
    [CGN_ROUTES.ACTIVATION.EXISTS]: {
      screen: CgnAlreadyActiveScreen
    },
    [CGN_ROUTES.ACTIVATION.TIMEOUT]: {
      screen: CgnActivationTimeoutScreen
    },
    [CGN_ROUTES.ACTIVATION.INELIGIBLE]: {
      screen: CgnActivationIneligibleScreen
    },
    [CGN_ROUTES.ACTIVATION.COMPLETED]: {
      screen: CgnActivationCompletedScreen
    },
    [CGN_ROUTES.ACTIVATION.CTA_START_CGN]: {
      screen: CgnCTAStartActivationScreen
    }
  },
  {
    // Let each screen handle the header and navigation
    headerMode: "none",
    defaultNavigationOptions: {
      gestureEnabled: false
    }
  }
);

export const CgnDetailsNavigator = createCompatNavigatorFactory(
  createStackNavigator
)(
  {
    [CGN_ROUTES.DETAILS.DETAILS]: {
      screen: CgnDetailScreen
    },
    [CGN_ROUTES.DETAILS.MERCHANTS.CATEGORIES]: {
      screen: CgnMerchantsCategoriesSelectionScreen
    },
    [CGN_ROUTES.DETAILS.MERCHANTS.LIST]: {
      screen: MerchantsListScreen
    },
    [CGN_ROUTES.DETAILS.MERCHANTS.LIST_BY_CATEGORY]: {
      screen: CgnMerchantsListByCategory
    },
    [CGN_ROUTES.DETAILS.MERCHANTS.TABS]: {
      screen: CgnMerchantsTabsScreen
    },
    [CGN_ROUTES.DETAILS.MERCHANTS.DETAIL]: {
      screen: CgnMerchantDetailScreen
    },
    [CGN_ROUTES.DETAILS.MERCHANTS.LANDING_WEBVIEW]: {
      screen: CgnMerchantLandingWebview
    }
  },
  {
    // Let each screen handle the header and navigation
    headerMode: "none",
    defaultNavigationOptions: {
      gestureEnabled: false
    }
  }
);

export const CgnEYCAActivationNavigator = createCompatNavigatorFactory(
  createStackNavigator
)(
  {
    [CGN_ROUTES.EYCA.ACTIVATION.LOADING]: {
      screen: EycaActivationLoading
    }
  },
  {
    // Let each screen handle the header and navigation
    headerMode: "none",
    defaultNavigationOptions: {
      gestureEnabled: false
    }
  }
);
