import { StackActions } from "@react-navigation/compat";
import { Either, right } from "fp-ts/lib/Either";
import * as pot from "italia-ts-commons/lib/pot";
import { call, put, select, take, race } from "typed-redux-saga/macro";
import { ActionType } from "typesafe-actions";
import NavigationService from "../../../../../../navigation/NavigationService";
import { navigateBack } from "../../../../../../store/actions/navigation";
import { fetchWalletsRequest } from "../../../../../../store/actions/wallet/wallets";
import {
  ReduxSagaEffect,
  SagaCallReturnType
} from "../../../../../../types/utils";
import { getAsyncResult } from "../../../../../../utils/saga";
import {
  navigateToBpdOnboardingDeclaration,
  navigateToBpdOnboardingInformationTos,
  navigateToBpdOnboardingLoadActivationStatus
} from "../../../navigation/actions";
import BPD_ROUTES from "../../../navigation/routes";
import { bpdLoadActivationStatus } from "../../../store/actions/details";
import {
  bpdOnboardingAcceptDeclaration,
  bpdOnboardingCancel,
  bpdUserActivate
} from "../../../store/actions/onboarding";
import { bpdEnabledSelector } from "../../../store/reducers/details/activation";

export const isLoadingScreen = (screenName: string) =>
  screenName === BPD_ROUTES.ONBOARDING.LOAD_CHECK_ACTIVATION_STATUS;

export function* getActivationStatus() {
  return yield* call(() => getAsyncResult(bpdLoadActivationStatus, undefined));
}

export function* isBpdEnabled(): Generator<
  ReduxSagaEffect,
  Either<Error, boolean>,
  any
> {
  const remoteActive: ReturnType<typeof bpdEnabledSelector> = yield* select(
    bpdEnabledSelector
  );
  if (pot.isSome(remoteActive)) {
    return right<Error, boolean>(remoteActive.value);
  } else {
    const activationStatus = yield* call(getActivationStatus);
    return activationStatus.map(citizen => citizen.enabled);
  }
}

/**
 *  Old style orchestrator, please don't use this as reference for future development
 *  @deprecated
 */
export function* bpdStartOnboardingWorker() {
  const currentRoute: ReturnType<typeof NavigationService.getCurrentRouteName> =
    yield* call(NavigationService.getCurrentRouteName);

  // go to the loading page (if I'm not on that screen)
  if (currentRoute !== undefined && !isLoadingScreen(currentRoute)) {
    yield* call(navigateToBpdOnboardingLoadActivationStatus);
  }

  // read if the bpd is active for the user
  const isBpdActive: SagaCallReturnType<typeof isBpdEnabled> = yield* call(
    isBpdEnabled
  );

  if (isBpdActive.isRight()) {
    // Refresh the wallets to prevent that added cards are not visible
    yield* put(fetchWalletsRequest());

    yield* call(navigateToBpdOnboardingInformationTos);

    // wait for the user that choose to continue
    yield* take(bpdUserActivate);

    // Navigate to the Onboarding Declaration and wait for the action that complete the saga
    yield* call(navigateToBpdOnboardingDeclaration);
  }

  // The saga ends when the user accepts the declaration
  yield* take(bpdOnboardingAcceptDeclaration);
}

/**
 * This saga check if the bpd is active for the user and choose if start the onboarding or go directly to the bpd details
 */
export function* handleBpdStartOnboardingSaga() {
  const { cancelAction } = yield* race({
    onboarding: call(bpdStartOnboardingWorker),
    cancelAction:
      take<ActionType<typeof bpdOnboardingCancel>>(bpdOnboardingCancel)
  });

  if (cancelAction) {
    yield* call(
      NavigationService.dispatchNavigationAction,
      StackActions.popToTop()
    );
    yield* call(navigateBack);
  }
}
