import { CompatNavigationProp } from "@react-navigation/compat";
import { Content, Text, View } from "native-base";
import * as React from "react";
import { connect } from "react-redux";
import { Link } from "../../../components/core/typography/Link";
import { ScreenContentHeader } from "../../../components/screens/ScreenContentHeader";
import TopScreenComponent from "../../../components/screens/TopScreenComponent";
import FooterWithButtons from "../../../components/ui/FooterWithButtons";
import { openLink } from "../../../components/ui/Markdown/handlers/link";
import I18n from "../../../i18n";
import { IOStackNavigationProp } from "../../../navigation/params/AppParamsList";
import { AuthenticationParamsList } from "../../../navigation/params/AuthenticationParamsList";
import { resetToAuthenticationRoute } from "../../../store/actions/navigation";
import { ReduxProps } from "../../../store/actions/types";

type Props = {
  navigation: CompatNavigationProp<
    IOStackNavigationProp<AuthenticationParamsList, "CIE_EXPIRED_SCREEN">
  >;
} & ReduxProps;
const bookingUrl = I18n.t("cie.booking_url");
const browseToLink = () => openLink(bookingUrl);

class CieExpiredOrInvalidScreen extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }

  private handleGoBack = () => resetToAuthenticationRoute();

  public render(): React.ReactNode {
    return (
      <TopScreenComponent
        goBack={this.handleGoBack}
        headerTitle={I18n.t("authentication.landing.expiredCardHeaderTitle")}
      >
        <ScreenContentHeader
          title={I18n.t("authentication.landing.expiredCardTitle")}
        />
        <Content>
          <Text>{I18n.t("authentication.landing.expiredCardContent")}</Text>
          <View spacer={true} />
          <Link onPress={browseToLink}>
            {I18n.t("authentication.landing.expiredCardHelp")}
          </Link>
        </Content>
        <FooterWithButtons
          type={"SingleButton"}
          leftButton={{
            bordered: true,
            onPress: this.handleGoBack,
            title: I18n.t("global.buttons.cancel")
          }}
        />
      </TopScreenComponent>
    );
  }
}

export default connect()(CieExpiredOrInvalidScreen);
