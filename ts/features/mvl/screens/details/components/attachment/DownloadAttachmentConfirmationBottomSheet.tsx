import { View } from "native-base";
import * as React from "react";
import { useState } from "react";
import { BottomSheetContent } from "../../../../../../components/bottomSheet/BottomSheetContent";
import { RawCheckBox } from "../../../../../../components/core/selection/checkbox/RawCheckBox";
import { Body } from "../../../../../../components/core/typography/Body";
import { IOStyles } from "../../../../../../components/core/variables/IOStyles";
import FooterWithButtons from "../../../../../../components/ui/FooterWithButtons";
import i18n from "../../../../../../i18n";
import { useIOBottomSheetRaw } from "../../../../../../utils/bottomSheet";
import {
  cancelButtonProps,
  confirmButtonProps
} from "../../../../../bonus/bonusVacanze/components/buttons/ButtonConfigurations";
import { MvlAttachment } from "../../../../types/mvlData";

type Props = {
  attachment: MvlAttachment;
  onConfirm: () => void;
  onCancel: () => void;
};

const DownloadAttachmentConfirmationBottomSheet = (
  props: Props
): React.ReactElement => {
  const [dontAskAgain, setDontAskAgain] = useState<boolean>(false);

  return (
    <BottomSheetContent
      footer={
        <FooterWithButtons
          type={"TwoButtonsInlineHalf"}
          leftButton={{
            ...cancelButtonProps(props.onCancel),
            onPressWithGestureHandler: true
          }}
          rightButton={{
            ...confirmButtonProps(
              props.onConfirm,
              i18n.t("global.buttons.continue")
            ),
            onPressWithGestureHandler: true
          }}
        />
      }
    >
      <View>
        <View spacer={true} />
        <Body>
          {i18n.t("features.mvl.details.attachments.bottomSheet.body")}
        </Body>
        <View spacer={true} />
        <View style={IOStyles.row}>
          <RawCheckBox
            checked={dontAskAgain}
            onPress={() => setDontAskAgain(!dontAskAgain)}
          />
          <Body
            style={{ paddingLeft: 8 }}
            onPress={() => setDontAskAgain(!dontAskAgain)}
          >
            {i18n.t("features.mvl.details.attachments.bottomSheet.checkBox")}
          </Body>
        </View>
      </View>
    </BottomSheetContent>
  );
};

export const useDownloadAttachmentConfirmationBottomSheet = (
  attachment: MvlAttachment
) => {
  const { present, dismiss } = useIOBottomSheetRaw(375);

  const openModalBox = () =>
    present(
      <DownloadAttachmentConfirmationBottomSheet
        attachment={attachment}
        onCancel={dismiss}
        onConfirm={dismiss}
      />,
      i18n.t("features.mvl.details.attachments.bottomSheet.title")
    );

  return { present: openModalBox, dismiss };
};
