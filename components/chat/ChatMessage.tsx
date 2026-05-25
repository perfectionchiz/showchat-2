import { useHaptic } from "@/hooks/useHaptic";
import { getInitials } from "@/utils/getInitials";

import { User } from "@/models/auth.model";
import React, { useState } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { DeleteConfirmationSheet } from "./DeleteMessageModal";
import { MessageActions } from "./MessageActionModal";
import { MessageContent } from "./MessageContent";

const REACTION_EMOJIS = ["🔥", "😂", "😱", "💀", "😭"] as const;

interface MessageReaction {
  emoji: string;
  count: number;
  user_ids: string[];
}

interface ChatMessageProps {
  id: string;
  displayName: string;
  message: string;
  createdAt: string;
  image?: string;
  profileUrl?: string;
  reactions?: MessageReaction[];
  isOwnMessage?: boolean;
  isPinned?: boolean;
  isPending: boolean;
  canReact?: boolean;
  onReact?: (messageId: string, emoji: string, toggledOff?: boolean) => void;
  onReport?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onPin?: (messageId: string) => void;
  level: number;
  isPremium: boolean;
  setShowEmojiSheet: (id: string) => void;
  user: User | null;
  isFailed?: boolean;
  onResend?: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  id,
  displayName,
  message,
  createdAt,
  image,
  profileUrl,
  reactions = [],
  isOwnMessage = false,
  isPinned = false,
  canReact = true,
  onReact,
  onReport,
  onDelete,
  onPin,
  isPending,
  level,
  isPremium,
  setShowEmojiSheet,
  isFailed,
  onResend,
  user,
}) => {
  const [showActions, setShowActions] = useState(false);

  const [showDeleteSheet, setShowDeleteSheet] = useState(false);

  const haptic = useHaptic();
  const createdDate = new Date(createdAt);
  const scale = useSharedValue(1);

  const animatedBubbleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleLongPress = () => {
    scale.value = withSpring(0.95, { damping: 20 });
    setShowActions(true);
    haptic?.();
  };

  const handlePress = () => {
    scale.value = withSpring(1);
    setShowActions(false);
  };

  const handleReact = (
    messageId: string,
    emoji: string,
    toggledOff: boolean,
  ) => {
    onReact?.(messageId, emoji, toggledOff);
    setShowActions(false);
  };
  const openEmojiSheet = () => {
    setShowActions(false);
    setShowEmojiSheet(id);
  };

  const isGrouped = isOwnMessage && !isPinned;

  const confirmDelete = () => {
    setShowActions(false);
    setShowDeleteSheet(true);
  };

  const executeDelete = () => {
    onDelete?.(id);
    setShowDeleteSheet(false);
  };

  return (
    <MessageContent
      user={user}
      setEmojiSheet={setShowEmojiSheet}
      isPremium={isPremium}
      level={level}
      profileUrl={profileUrl}
      displayName={displayName}
      isOwnMessage={isOwnMessage}
      isPinned={isPinned}
      createdDate={createdDate}
      message={message}
      handleLongPress={handleLongPress}
      handlePress={handlePress}
      isGrouped={isGrouped}
      image={image}
      animatedBubbleStyle={animatedBubbleStyle}
      isPending={isPending}
      reactions={reactions}
      isFailed={isFailed}
      onResend={onResend}
      canReact={canReact}
      onReact={handleReact}
      id={id}
      getInitials={getInitials}
    >
      <MessageActions
        handlePress={handlePress}
        showActions={showActions}
        onClose={handlePress}
        canReact={canReact}
        REACTION_EMOJIS={REACTION_EMOJIS}
        onReact={handleReact}
        openEmojiSheet={openEmojiSheet}
        setShowAction={setShowActions}
        confirmDelete={confirmDelete}
        isOwnMessage={isOwnMessage}
        isPinned={isPinned}
        id={id}
        onReport={onReport}
        onPin={onPin}
        onDelete={onDelete}
        animatedBubbleStyle={animatedBubbleStyle}
        message={message}
      />

      <DeleteConfirmationSheet
        onDelete={executeDelete}
        setShowVisible={setShowDeleteSheet}
        visible={showDeleteSheet}
      />
    </MessageContent>
  );
};
