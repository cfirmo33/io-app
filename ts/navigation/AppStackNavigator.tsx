/* eslint-disable functional/immutable-data */
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { useRef } from "react";
import workunitGenericFailure from "../components/error/WorkunitGenericFailure";
import {
  CgnActivationNavigator,
  CgnDetailsNavigator,
  CgnEYCAActivationNavigator
} from "../features/bonus/cgn/navigation/navigator";
import CGN_ROUTES from "../features/bonus/cgn/navigation/routes";
import { zendeskSupportNavigator } from "../features/zendesk/navigation/navigator";
import ZENDESK_ROUTES from "../features/zendesk/navigation/routes";
import IngressScreen from "../screens/ingress/IngressScreen";
import { setDebugCurrentRouteName } from "../store/actions/debug";
import { useIODispatch } from "../store/hooks";
import { trackScreen } from "../store/middlewares/navigation";
import authenticationNavigator from "./AuthenticationNavigator";
import mainNavigator from "./MainNavigator";
import messagesNavigator from "./MessagesNavigator";
import { navigationRef } from "./NavigationService";
import onboardingNavigator from "./OnboardingNavigator";
import { AppParamsList } from "./params/AppParamsList";
import profileNavigator from "./ProfileNavigator";
import ROUTES from "./routes";
import servicesNavigator from "./ServicesNavigator";
import walletNavigator from "./WalletNavigator";

const Stack = createStackNavigator<AppParamsList>();

// type Test = keyof AppParamsList;
//
// const routes: Record<Test, ComponentClass<any> | FunctionComponent<any>> = {
//   INGRESS: IngressScreen,
//   AUTHENTICATION: authenticationNavigator,
//   ONBOARDING: onboardingNavigator,
//   MAIN: mainNavigator,
//   MESSAGES_NAVIGATOR: messagesNavigator,
//   WALLET_NAVIGATOR: walletNavigator,
//   SERVICES_NAVIGATOR: servicesNavigator,
//   PROFILE_NAVIGATOR: profileNavigator,
//   CGN_ACTIVATION_MAIN: CgnActivationNavigator,
//   CGN_DETAILS_MAIN: CgnDetailsNavigator,
//   CGN_EYCA_MAIN: CgnEYCAActivationNavigator,
//   WORKUNIT_GENERIC_FAILURE: workunitGenericFailure,
//   ZENDESK_MAIN: zendeskSupportNavigator
// };

export const AppStackNavigator = () => (
  <Stack.Navigator initialRouteName={"INGRESS"} headerMode={"none"}>
    <Stack.Screen name={ROUTES.INGRESS} component={IngressScreen} />
    <Stack.Screen
      name={ROUTES.AUTHENTICATION}
      component={authenticationNavigator}
    />
    <Stack.Screen name={ROUTES.ONBOARDING} component={onboardingNavigator} />
    <Stack.Screen name={ROUTES.MAIN} component={mainNavigator} />

    <Stack.Screen
      name={ROUTES.MESSAGES_NAVIGATOR}
      component={messagesNavigator}
    />
    <Stack.Screen name={ROUTES.WALLET_NAVIGATOR} component={walletNavigator} />
    <Stack.Screen
      name={ROUTES.SERVICES_NAVIGATOR}
      component={servicesNavigator}
    />
    <Stack.Screen
      name={ROUTES.PROFILE_NAVIGATOR}
      component={profileNavigator}
    />

    <Stack.Screen
      name={CGN_ROUTES.ACTIVATION.MAIN}
      component={CgnActivationNavigator}
    />

    <Stack.Screen
      name={CGN_ROUTES.DETAILS.MAIN}
      component={CgnDetailsNavigator}
    />

    <Stack.Screen
      name={CGN_ROUTES.EYCA.ACTIVATION.MAIN}
      component={CgnEYCAActivationNavigator}
    />

    <Stack.Screen
      name={ROUTES.WORKUNIT_GENERIC_FAILURE}
      component={workunitGenericFailure}
    />
    <Stack.Screen
      name={ZENDESK_ROUTES.MAIN}
      component={zendeskSupportNavigator}
    />
  </Stack.Navigator>
);

/**
 * Wraps the NavigationContainer with the AppStackNavigator (Root navigator of the app)
 * @constructor
 */
export const IONavigationContainer = () => {
  const routeNameRef = useRef<string>();
  const dispatch = useIODispatch();
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>
        (routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name)
      }
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

        if (currentRouteName !== undefined) {
          dispatch(setDebugCurrentRouteName(currentRouteName));
          await trackScreen(previousRouteName, currentRouteName);
        }
        routeNameRef.current = currentRouteName;
      }}
    >
      <AppStackNavigator />
    </NavigationContainer>
  );
};
