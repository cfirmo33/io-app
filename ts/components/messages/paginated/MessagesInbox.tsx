import { View } from "native-base";
import React from "react";
import { StyleSheet } from "react-native";

import { UIMessage } from "../../../store/reducers/entities/messages/types";
import I18n from "../../../i18n";
import { EmptyListComponent } from "../EmptyListComponent";

import { useItemsSelection } from "../../../utils/hooks/useItemsSelection";
import ListSelectionBar from "../../ListSelectionBar";
import { UaDonationsBanner } from "../../../features/uaDonations/components/UaDonationsBanner";
import MessageList from "./MessageList";

const styles = StyleSheet.create({
  listWrapper: {
    flex: 1
  },
  listContainer: {
    flex: 1
  }
});

type Props = {
  messages: ReadonlyArray<UIMessage>;
  navigateToMessageDetail: (message: UIMessage) => void;
  archiveMessages: (messages: ReadonlyArray<UIMessage>) => void;
};

/**
 * Container for the message inbox.
 * It looks redundant at the moment but will be used later on once we bring back
 * states and filtering in the Messages.
 *
 * @param messages used for handling messages selection
 * @param navigateToMessageDetail
 * @param archiveMessages a function called when the user taps on the archive CTA
 * @constructor
 */
const MessagesInbox = ({
  messages,
  navigateToMessageDetail,
  archiveMessages
}: Props) => {
  const { selectedItems, toggleItem, resetSelection } = useItemsSelection();

  const isSelecting = selectedItems.isSome();
  const selectedItemsCount = selectedItems.toUndefined()?.size ?? 0;
  const allItemsCount = messages.length;

  const onPressItem = (message: UIMessage) => {
    if (selectedItems.isSome()) {
      toggleItem(message.id);
    } else {
      navigateToMessageDetail(message);
    }
  };

  const onLongPressItem = (id: string) => {
    toggleItem(id);
  };

  const ListEmptyComponent = () => (
    <EmptyListComponent
      image={require("../../../../img/messages/empty-message-list-icon.png")}
      title={I18n.t("messages.inbox.emptyMessage.title")}
      subtitle={I18n.t("messages.inbox.emptyMessage.subtitle")}
    />
  );

  return (
    <View style={styles.listWrapper}>
      <View style={styles.listContainer}>
        <MessageList
          filter={{ getArchived: false }}
          onPressItem={onPressItem}
          onLongPressItem={onLongPressItem}
          selectedMessageIds={selectedItems.toUndefined()}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={<UaDonationsBanner />}
        />
      </View>
      {isSelecting && (
        <ListSelectionBar
          selectedItems={selectedItemsCount}
          totalItems={allItemsCount}
          onToggleSelection={() => {
            archiveMessages(
              messages.filter(_ => selectedItems.getOrElse(new Set()).has(_.id))
            );
            resetSelection();
          }}
          onResetSelection={resetSelection}
          primaryButtonText={I18n.t("messages.cta.archive")}
        />
      )}
    </View>
  );
};

export default MessagesInbox;
