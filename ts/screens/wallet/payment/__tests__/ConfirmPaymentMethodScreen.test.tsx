import { createStore, DeepPartial, Store } from "redux";
import I18n from "../../../../i18n";
import ROUTES from "../../../../navigation/routes";
import { appReducer } from "../../../../store/reducers/";
import {
  bancomatPayConfigSelector,
  isPaypalEnabledSelector
} from "../../../../store/reducers/backendStatus";
import { GlobalState } from "../../../../store/reducers/types";
import { pspSelectedV2ListSelector } from "../../../../store/reducers/wallet/payment";
import { paymentMethodByIdSelector } from "../../../../store/reducers/wallet/wallets";
import {
  BPayPaymentMethod,
  CreditCardPaymentMethod,
  PayPalPaymentMethod
} from "../../../../types/pagopa";
import { getTranslatedShortNumericMonthYear } from "../../../../utils/dates";
import { formatNumberCentsToAmount } from "../../../../utils/stringBuilder";
import {
  AuthSeq,
  myInitialAmount,
  myPsp,
  myRptId,
  myVerifiedData,
  myWallet
} from "../../../../utils/testFaker";
import { reproduceSequence } from "../../../../utils/tests";
import { renderScreenFakeNavRedux } from "../../../../utils/testWrapper";
import ConfirmPaymentMethodScreen, {
  ConfirmPaymentMethodScreenNavigationParams
} from "../ConfirmPaymentMethodScreen";

// Mock react native share
jest.mock("react-native-share", () => jest.fn());

// Mock the internal payment method
jest.mock("../../../../store/reducers/wallet/wallets", () => {
  const actualModule = jest.requireActual(
    "../../../../store/reducers/wallet/wallets"
  );

  return {
    __esModule: true,
    ...actualModule,
    paymentMethodByIdSelector: jest.fn()
  };
});

// Mock payment
jest.mock("../../../../store/reducers/wallet/payment", () => {
  const actualModule = jest.requireActual(
    "../../../../store/reducers/wallet/payment"
  );

  return {
    __esModule: true,
    ...actualModule,
    pspSelectedV2ListSelector: jest.fn()
  };
});

// Mock feature flags
jest.mock("../../../../store/reducers/backendStatus", () => {
  const actualModule = jest.requireActual(
    "../../../../store/reducers/backendStatus"
  );

  return {
    __esModule: true,
    ...actualModule,
    isPaypalEnabledSelector: jest.fn(),
    bancomatPayConfigSelector: jest.fn()
  };
});

// Credit card payment method stub
const creditCardPaymentMethod = {
  kind: "CreditCard",
  info: {
    type: "CRD",
    holder: "holder",
    expireMonth: "03",
    expireYear: "2022"
  },
  caption: "caption"
} as CreditCardPaymentMethod;

// PayPal card payment method stub
const paypalEmail = "email@email.com";
const payPalPaymentMethod = {
  kind: "PayPal",
  info: {
    pspInfo: [
      {
        email: paypalEmail,
        default: true
      }
    ]
  },
  caption: "caption"
} as DeepPartial<PayPalPaymentMethod>;

const bpayPaymentMethod = {
  kind: "BPay",
  caption: "BPay caption",
  info: {
    numberObfuscated: "***123"
  }
} as DeepPartial<BPayPaymentMethod>;

describe("Integration Tests With Actual Store and Simplified Navigation", () => {
  afterAll(() => jest.resetAllMocks());
  beforeEach(() => jest.useFakeTimers());

  const initState = reproduceSequence({} as GlobalState, appReducer, AuthSeq);

  const params: ConfirmPaymentMethodScreenNavigationParams = {
    rptId: myRptId,
    initialAmount: myInitialAmount,
    verifica: myVerifiedData,
    idPayment: "hjkdhgkdj",
    wallet: myWallet,
    psps: [myPsp]
  };

  // Store with the true appReducer
  const myStore: Store<GlobalState> = createStore(appReducer, initState as any);

  it("should display all the informations correctly for a `CreditCard` payment method", () => {
    (paymentMethodByIdSelector as unknown as jest.Mock).mockReturnValue(
      creditCardPaymentMethod
    );

    (bancomatPayConfigSelector as unknown as jest.Mock).mockReturnValue({
      display: false,
      onboarding: false,
      payment: true
    });

    const rendered = renderScreenFakeNavRedux<GlobalState>(
      ConfirmPaymentMethodScreen,
      ROUTES.PAYMENT_CONFIRM_PAYMENT_METHOD,
      params,
      myStore
    );

    // Should display the payment reason
    rendered.getByText(params.verifica.causaleVersamento);

    // Should display the payment amount
    rendered.getByText(
      formatNumberCentsToAmount(params.verifica.importoSingoloVersamento, true)
    );

    // Should display the payment method
    rendered.getByText(creditCardPaymentMethod.caption);

    rendered.getByText(
      `${
        creditCardPaymentMethod.info.holder
      } · ${getTranslatedShortNumericMonthYear(
        creditCardPaymentMethod.info.expireYear,
        creditCardPaymentMethod.info.expireMonth
      )}`
    );

    // Should render the PSP with the fees
    rendered.getByText(
      formatNumberCentsToAmount(params.wallet.psp?.fixedCost.amount ?? -1, true)
    );

    rendered.getByText(
      `${I18n.t("wallet.ConfirmPayment.providedBy")} ${
        params.wallet.psp?.businessName
      }`
    );

    // It should retrieve two `Edit` text
    // one for the payment method and one
    // for the PSP.
    expect(
      rendered.getAllByText(I18n.t("wallet.ConfirmPayment.edit"))
    ).toHaveLength(2);
  });

  it("should display all the informations correctly for a `PayPal` payment method", () => {
    const paypalPspFee = 2;
    const paypalPspName = "name";
    const paypalPrivacyUrl = "https://host.com";

    (paymentMethodByIdSelector as unknown as jest.Mock).mockReturnValue(
      payPalPaymentMethod
    );

    (bancomatPayConfigSelector as unknown as jest.Mock).mockReturnValue({
      display: false,
      onboarding: false,
      payment: true
    });

    (isPaypalEnabledSelector as unknown as jest.Mock).mockReturnValue(true);

    (pspSelectedV2ListSelector as unknown as jest.Mock).mockReturnValue({
      fee: paypalPspFee,
      ragioneSociale: paypalPspName,
      privacyUrl: paypalPrivacyUrl
    });

    const paypalParams = {
      ...params,
      wallet: {
        ...params.wallet,
        paymentMethod: payPalPaymentMethod as PayPalPaymentMethod
      }
    };

    const rendered = renderScreenFakeNavRedux<GlobalState>(
      ConfirmPaymentMethodScreen,
      ROUTES.PAYMENT_CONFIRM_PAYMENT_METHOD,
      paypalParams,
      myStore
    );

    // Should display the payment reason
    rendered.getByText(paypalParams.verifica.causaleVersamento);

    // Should display the payment amount
    rendered.getByText(
      formatNumberCentsToAmount(
        paypalParams.verifica.importoSingoloVersamento,
        true
      )
    );

    // Should display the payment method
    rendered.getByText(I18n.t("wallet.onboarding.paypal.name"));

    rendered.getByText(`${paypalEmail}`);

    // Should render the PSP with the fees
    rendered.getByText(formatNumberCentsToAmount(paypalPspFee, true));

    rendered.getByText(
      `${I18n.t("wallet.ConfirmPayment.providedBy")} ${paypalPspName}`
    );

    // Should render the privacy url for PayPal
    rendered.getByText(
      `${I18n.t(
        "wallet.onboarding.paypal.paymentCheckout.privacyDisclaimer"
      )} ${I18n.t("wallet.onboarding.paypal.paymentCheckout.privacyTerms")}`
    );

    // It should retrieve one `Edit` text, only
    // the one for the payment method.
    expect(
      rendered.getAllByText(I18n.t("wallet.ConfirmPayment.edit"))
    ).toHaveLength(1);
  });

  it("should display all the information correctly for a `BPay` payment method", () => {
    (paymentMethodByIdSelector as unknown as jest.Mock).mockReturnValue(
      bpayPaymentMethod
    );

    (bancomatPayConfigSelector as unknown as jest.Mock).mockReturnValue({
      display: false,
      onboarding: false,
      payment: true
    });

    const bpayParams = {
      ...params,
      wallet: {
        ...params.wallet,
        paymentMethod: bpayPaymentMethod as BPayPaymentMethod
      }
    };

    const rendered = renderScreenFakeNavRedux<GlobalState>(
      ConfirmPaymentMethodScreen,
      ROUTES.PAYMENT_CONFIRM_PAYMENT_METHOD,
      bpayParams,
      myStore
    );

    // Should display the payment reason
    rendered.getByText(bpayParams.verifica.causaleVersamento);

    // Should display the payment amount
    rendered.getByText(
      formatNumberCentsToAmount(
        bpayParams.verifica.importoSingoloVersamento,
        true
      )
    );

    // Should display the payment method
    rendered.getByText(bpayPaymentMethod.caption!);

    rendered.getByText(bpayPaymentMethod.info!.numberObfuscated!);

    // Should render the PSP with the fees
    rendered.getByText(
      formatNumberCentsToAmount(params.wallet.psp?.fixedCost.amount ?? -1, true)
    );

    rendered.getByText(
      `${I18n.t("wallet.ConfirmPayment.providedBy")} ${
        params.wallet.psp?.businessName
      }`
    );

    /**
     * It should retrieve two `Edit` CTAs
     * one for the payment method.
     * one for the PSP
     */
    expect(
      rendered.getAllByText(I18n.t("wallet.ConfirmPayment.edit"))
    ).toHaveLength(2);
  });
});
