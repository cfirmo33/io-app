import { call, fork, put, race, select, take } from "redux-saga/effects";
import { delay, SagaReturnType } from "@redux-saga/core/effects";
import { isActionOf } from "typesafe-actions";
import { getError } from "../../../../utils/errors";

import {
  AnonymousIdentity,
  getIdentityByToken,
  getTotalNewResponses,
  getTotalNewResponsesRefreshRate,
  initSupportAssistance,
  JwtIdentity,
  setUserIdentity,
  ZendeskAppConfig,
  zendeskDefaultAnonymousConfig,
  zendeskDefaultJwtConfig
} from "../../../../utils/supportAssistance";
import { zendeskTokenSelector } from "../../../../store/reducers/authentication";
import {
  logoutRequest,
  sessionExpired,
  sessionInformationLoadSuccess,
  sessionInvalid
} from "../../../../store/actions/authentication";
import {
  zendeskGetTotalNewResponses,
  zendeskRequestTicketNumber,
  zendeskSupportOpened
} from "../../store/actions";
import { isTestEnv } from "../../../../utils/environment";
import { Action } from "../../../../store/actions/types";
import { backendStatusLoadSuccess } from "../../../../store/actions/backendStatus";
import {
  versionInfoLoadFailure,
  versionInfoLoadSuccess
} from "../../../../common/versionInfo/store/actions/versionInfo";

function* setupZendesk() {
  const zendeskToken: string | undefined = yield select(zendeskTokenSelector);

  const zendeskConfig: ZendeskAppConfig = zendeskToken
    ? { ...zendeskDefaultJwtConfig, token: zendeskToken }
    : zendeskDefaultAnonymousConfig;

  yield call(initSupportAssistance, zendeskConfig);
  const zendeskIdentity: JwtIdentity | AnonymousIdentity =
    getIdentityByToken(zendeskToken);

  yield call(setUserIdentity, zendeskIdentity);
}

function* getTicketsCount() {
  yield call(setupZendesk);
  // Try to get the total messages of the user
  yield put(zendeskRequestTicketNumber.request());
}

function* getUnreadTicketsCount() {
  yield call(setupZendesk);
  // Try to get the new messages of the user
  try {
    const response: SagaReturnType<typeof getTotalNewResponses> = yield call(
      getTotalNewResponses
    );
    yield put(zendeskGetTotalNewResponses.success(response));
  } catch (e) {
    yield put(zendeskGetTotalNewResponses.failure(getError(e)));
  }
}

/**
 * when the zendesk is opened it starts to check the number of unread tickets cyclically
 * it stops when the user makes some changes inside the app (ex. SCREEN_CHANGE)
 */
function* refreshUnreadTicketsCountWhileSupportIsOpen() {
  // a predicate that return true if the given action is different from all
  // these ones defined in the array
  const stoppersPredicate = (action: Action) =>
    [
      zendeskGetTotalNewResponses.request,
      zendeskGetTotalNewResponses.success,
      zendeskGetTotalNewResponses.failure,
      zendeskRequestTicketNumber.request,
      zendeskRequestTicketNumber.failure,
      zendeskRequestTicketNumber.success,
      backendStatusLoadSuccess,
      versionInfoLoadFailure,
      versionInfoLoadSuccess
    ].every(skipAction => !isActionOf(skipAction, action));
  while (true) {
    yield take(zendeskSupportOpened);
    while (true) {
      yield call(getUnreadTicketsCount);
      const { stoppers } = yield race({
        wait: delay(2000),
        stoppers: take(stoppersPredicate)
      });

      if (stoppers) {
        break;
      }
    }
  }
}

/**
 * check cyclically the number of unread tickets
 * the check is done when
 * - a waiting timer elapses
 * - when the user session changes (login/logout/session)
 */
function* refreshUnreadTicketsCount() {
  while (true) {
    yield call(getUnreadTicketsCount);
    yield call(getTicketsCount);
    yield race({
      wait: delay(getTotalNewResponsesRefreshRate),
      signals: take([
        sessionInvalid,
        sessionExpired,
        logoutRequest,
        sessionInformationLoadSuccess
      ])
    });
  }
}

// retrieve the number of ticket opened by the user from the Zendesk SDK
export function* handleGetTotalNewResponses() {
  yield fork(refreshUnreadTicketsCount);
  yield fork(refreshUnreadTicketsCountWhileSupportIsOpen);
}

export const testTotalNewResponsesFunction = isTestEnv
  ? refreshUnreadTicketsCount
  : undefined;
