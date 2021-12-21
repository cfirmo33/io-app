import { SagaIterator } from "redux-saga";
import { call, takeLatest } from "redux-saga/effects";
import { ActionType } from "typesafe-actions";
import { SessionToken } from "../../../types/SessionToken";
import { waitBackoffError } from "../../../utils/backoffError";
import { mvlDetailsLoad } from "../store/actions";
import { handleGetMvl } from "./networking/handleGetMvlDetails";
import { BackendMvlClient } from "../api/backendMvl";
import { apiUrlPrefix } from "../../../config";

/**
 * Handle the MVL Requests
 * TODO: stub entrypoint
 * @param bearerToken
 */
export function* watchMvlSaga(bearerToken: SessionToken): SagaIterator {
  // TODO: backendClient
  const mvlClient = BackendMvlClient(apiUrlPrefix, bearerToken);

  // handle the request for a new mvlDetailsLoad
  yield takeLatest(
    mvlDetailsLoad.request,
    function* (action: ActionType<typeof mvlDetailsLoad.request>) {
      // wait backoff time if there were previous errors
      yield call(waitBackoffError, mvlDetailsLoad.failure);
      yield call(handleGetMvl, mvlClient.getUserLegalMessage, action);
    }
  );
}
