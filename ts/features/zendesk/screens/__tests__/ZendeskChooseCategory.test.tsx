import { fireEvent, RenderAPI } from "@testing-library/react-native";
import { ReactTestInstance } from "react-test-renderer";
import { createStore, Store } from "redux";
import { Zendesk } from "../../../../../definitions/content/Zendesk";
import { ZendeskCategories } from "../../../../../definitions/content/ZendeskCategories";
import { ZendeskCategory } from "../../../../../definitions/content/ZendeskCategory";
import { ZendeskSubCategories } from "../../../../../definitions/content/ZendeskSubCategories";
import MockZendesk from "../../../../__mocks__/io-react-native-zendesk";
import ROUTES from "../../../../navigation/routes";
import { applicationChangeState } from "../../../../store/actions/application";
import { appReducer } from "../../../../store/reducers";
import { GlobalState } from "../../../../store/reducers/types";
import { renderScreenFakeNavRedux } from "../../../../utils/testWrapper";
import * as zendeskAction from "../../store/actions";
import { getZendeskConfig } from "../../store/actions";
import ZendeskChooseCategory from "../ZendeskChooseCategory";

jest.useFakeTimers();

const mockedNavigation = jest.fn();

jest.mock("@react-navigation/native", () => {
  const actualNav = jest.requireActual("@react-navigation/native");
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: mockedNavigation,
      dispatch: jest.fn()
    })
  };
});

const mockedZendeskConfig: Zendesk = {
  panicMode: false,
  zendeskCategories: {
    id: "12345",
    categories: [
      {
        value: "mockedValue",
        description: {
          "it-IT": "mockedDescription",
          "en-EN": "mockedDescription"
        }
      }
    ]
  }
};

const mockedZendeskSubcategories: ZendeskSubCategories = {
  id: "67890",
  subCategories: [
    {
      value: "mockedSubcategoryValue",
      description: {
        "it-IT": "mockedSubcategorydescription",
        "en-EN": "mockedSubcategorydescription"
      }
    }
  ]
};

describe("the ZendeskChooseCategory screen", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const zendeskSupportFailureSpy = jest.spyOn(
    zendeskAction,
    "zendeskSupportFailure"
  );
  const globalState = appReducer(undefined, applicationChangeState("active"));

  describe("should call the zendeskSupportFailure", () => {
    it("if the ZendeskConfig is not ready", () => {
      const store: Store<GlobalState> = createStore(
        appReducer,
        globalState as any
      );
      renderComponent(store);
      store.dispatch(getZendeskConfig.request());
      expect(zendeskSupportFailureSpy).toBeCalled();
    });
    it("if there isn't a category id", () => {
      const store: Store<GlobalState> = createStore(
        appReducer,
        globalState as any
      );
      renderComponent(store);
      store.dispatch(
        getZendeskConfig.success({
          ...mockedZendeskConfig,
          zendeskCategories: {
            categories: mockedZendeskConfig?.zendeskCategories?.categories
          } as ZendeskCategories
        })
      );
      expect(zendeskSupportFailureSpy).toBeCalled();
    });
    it("if there isn't at least a category", () => {
      const store: Store<GlobalState> = createStore(
        appReducer,
        globalState as any
      );
      renderComponent(store);
      store.dispatch(
        getZendeskConfig.success({
          panicMode: mockedZendeskConfig.panicMode
        })
      );
      expect(zendeskSupportFailureSpy).toBeCalled();
    });
  });

  describe("if the Zendesk config is ready and there is at least a category", () => {
    beforeEach(() => {
      mockedNavigation.mockClear();
    });
    it("should render the received categories", () => {
      const store: Store<GlobalState> = createStore(
        appReducer,
        globalState as any
      );
      const component: RenderAPI = renderComponent(store);
      store.dispatch(
        getZendeskConfig.success({
          ...mockedZendeskConfig,
          zendeskCategories: {
            ...mockedZendeskConfig.zendeskCategories,
            categories: [
              {
                ...mockedZendeskConfig.zendeskCategories?.categories[0],
                zendeskSubCategories: mockedZendeskSubcategories
              } as ZendeskCategory
            ]
          } as ZendeskCategories
        })
      );

      expect(
        component.queryByTestId(
          mockedZendeskConfig.zendeskCategories?.categories[0].value as string
        )
      ).toBeDefined();
      expect(
        component.queryByTestId(
          mockedZendeskSubcategories.subCategories[0].value as string
        )
      ).toBeNull();
    });
    it("should call the addTicketCustomField and the navigateToZendeskChooseSubCategory functions when press the category if it has sub-categories", () => {
      const store: Store<GlobalState> = createStore(
        appReducer,
        globalState as any
      );
      const component: RenderAPI = renderComponent(store);
      store.dispatch(
        getZendeskConfig.success({
          ...mockedZendeskConfig,
          zendeskCategories: {
            ...mockedZendeskConfig.zendeskCategories,
            categories: [
              {
                ...mockedZendeskConfig.zendeskCategories?.categories[0],
                zendeskSubCategories: mockedZendeskSubcategories
              } as ZendeskCategory
            ]
          } as ZendeskCategories
        })
      );
      const categoryItem: ReactTestInstance = component.getByTestId(
        mockedZendeskConfig.zendeskCategories?.categories[0].value as string
      );
      fireEvent(categoryItem, "onPress");
      expect(MockZendesk.addTicketCustomField).toBeCalled();
      expect(mockedNavigation).toHaveBeenCalledTimes(1);
      expect(mockedNavigation).toHaveBeenCalledWith("ZENDESK_MAIN", {
        params: { assistanceForPayment: undefined },
        screen: "ZENDESK_ASK_PERMISSIONS"
      });
    });
    it("should call the navigateToZendeskAskPermissions action when press the category if it has not sub-categories", () => {
      const store: Store<GlobalState> = createStore(
        appReducer,
        globalState as any
      );
      const component: RenderAPI = renderComponent(store);
      store.dispatch(getZendeskConfig.success(mockedZendeskConfig));
      const categoryItem: ReactTestInstance = component.getByTestId(
        mockedZendeskConfig.zendeskCategories?.categories[0].value as string
      );
      fireEvent(categoryItem, "onPress");
      expect(mockedNavigation).toHaveBeenCalledTimes(1);
      expect(mockedNavigation).toHaveBeenCalledWith("ZENDESK_MAIN", {
        params: { assistanceForPayment: undefined },
        screen: "ZENDESK_ASK_PERMISSIONS"
      });
    });
  });
});

function renderComponent(store: Store<GlobalState>) {
  return renderScreenFakeNavRedux<GlobalState>(
    ZendeskChooseCategory,
    ROUTES.MAIN,
    {},
    store
  );
}
