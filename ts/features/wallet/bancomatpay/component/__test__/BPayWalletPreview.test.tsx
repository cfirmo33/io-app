import { CommonActions } from "@react-navigation/native";
import { fireEvent } from "@testing-library/react-native";
import { none, some } from "fp-ts/lib/Option";
import * as React from "react";
import { Store } from "redux";
import configureMockStore from "redux-mock-store";
import NavigationService from "../../../../../navigation/NavigationService";
import ROUTES from "../../../../../navigation/routes";
import { BPayPaymentMethod } from "../../../../../types/pagopa";
import { renderScreenFakeNavRedux } from "../../../../../utils/testWrapper";
import * as hooks from "../../../onboarding/bancomat/screens/hooks/useImageResize";
import BPayWalletPreview from "../BPayWalletPreview";
import { ToolEnum } from "../../../../../../definitions/content/AssistanceToolConfig";
import { Config } from "../../../../../../definitions/content/Config";
import { BackendStatus } from "../../../../../../definitions/content/BackendStatus";

describe("BPayWalletPreview component", () => {
  const mockStore = configureMockStore();
  // eslint-disable-next-line functional/no-let
  let store: ReturnType<typeof mockStore>;

  const aBPay: BPayPaymentMethod = {
    walletType: "BPay",
    createDate: "2021-07-08",
    enableableFunctions: ["FA", "pagoPA", "BPD"],
    favourite: false,
    idWallet: 25572,
    info: {
      numberObfuscated: "*******0000",
      paymentInstruments: [],
      uidHash:
        "d48a59cdfbe3da7e4fe25e28cbb47d5747720ecc6fc392c87f1636fe95db22f90004"
    },
    onboardingChannel: "IO",
    pagoPA: true,
    updateDate: "2020-11-20",
    kind: "BPay",
    caption: "BANCOMAT Pay",
    icon: 37
  } as BPayPaymentMethod;

  beforeEach(() => {
    store = mockStore({
      backendStatus: {
        status: some({
          config: {
            assistanceTool: { tool: ToolEnum.none },
            cgn: { enabled: true },
            fims: { enabled: true }
          } as Config
        } as BackendStatus)
      }
    });
  });
  it("should show the caption if useImageResize return none", () => {
    const myspy = jest.spyOn(hooks, "useImageResize").mockReturnValue(none);
    const component = getComponent(aBPay, store);
    const bankLogo = component.queryByTestId("bankLogoFallback");

    expect(bankLogo).not.toBeNull();
    expect(bankLogo).toHaveTextContent("BANCOMAT Pay");
    expect(myspy).toHaveBeenCalledTimes(1);
  });

  it("should show nothing if useImageResize return a size but there isn't the logoUrl", () => {
    jest.spyOn(hooks, "useImageResize").mockReturnValue(some([15, 15]));
    const component = getComponent(aBPay, store);
    const bankLogo = component.queryByTestId("bankLogo");
    const bankLogoFallback = component.queryByTestId("bankLogoFallback");

    expect(bankLogo).toBeNull();
    expect(bankLogoFallback).toBeNull();
  });

  it("should show the logo image if there is the abiInfo logoUrl", () => {
    jest.spyOn(hooks, "useImageResize").mockReturnValue(some([15, 15]));

    const infobankName = "a different bank name";
    const abiInfoBankName = "INTESA SANPAOLO - S.P.A.";
    const logoUrl = "http://127.0.0.1:3000/static_contents/logos/abi/03069.png";
    const component = getComponent(
      {
        ...aBPay,
        info: { ...aBPay.info, bankName: infobankName },
        abiInfo: {
          abi: "03069",
          name: abiInfoBankName,
          logoUrl
        }
      },
      store
    );
    const bankLogo = component.queryByTestId("bankLogo");

    expect(bankLogo).not.toBeNull();
    expect(bankLogo).toHaveProp("source", { uri: logoUrl });
  });

  it("should call navigateToBPayDetails when press on it", () => {
    jest.spyOn(hooks, "useImageResize").mockReturnValue(none);
    const spy = jest.spyOn(NavigationService, "dispatchNavigationAction");
    const component = getComponent(aBPay, store);
    const cardComponent = component.queryByTestId("cardPreview");
    if (cardComponent) {
      fireEvent.press(cardComponent);
      expect(spy).toHaveBeenCalledWith(
        CommonActions.navigate(ROUTES.WALLET_NAVIGATOR, {
          screen: ROUTES.WALLET_BPAY_DETAIL,
          params: { bPay: aBPay }
        })
      );
    }
  });
});

const getComponent = (bPay: BPayPaymentMethod, store: Store<unknown>) =>
  renderScreenFakeNavRedux(
    () => <BPayWalletPreview bPay={bPay} />,
    "WALLET_HOME",
    {},
    store
  );
