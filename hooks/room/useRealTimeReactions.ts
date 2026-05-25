import { supabase } from "@/lib/supabase";
import { User } from "@/models/auth.model";
import { useAuthStore } from "@/store/authStore";
import { useCallback, useEffect, useRef } from "react";

export interface FloatingEmojiItem {
  id: string;
  emoji: string;
  user: {
    id: string;
    display_name: string;
    profile_url: string;
  };
  isMe: boolean;
}

type ReactionCallback = (
  updater: (prev: FloatingEmojiItem[]) => FloatingEmojiItem[],
) => void;

export const useRealtimeReactions = (
  roomId: string,
  currentUser: User | null,
  onReaction: ReactionCallback,
) => {
  const channelRef = useRef<any>(null);
  const { session } = useAuthStore();

  const removeEmoji = useCallback(
    (id: string) => {
      onReaction((prev) => prev.filter((e) => e.id !== id));
    },
    [onReaction],
  );

  useEffect(() => {
    if (!roomId || !currentUser || !session?.access_token) return;

    supabase.realtime.setAuth(session.access_token);

    const channel = supabase.channel(`reactions:${roomId}`, {
      config: {
        broadcast: { self: true },
      },
    });

    channel
      .on("broadcast", { event: "reaction" }, ({ payload }) => {
        const isMe = payload.user.id === currentUser.id;

        onReaction((prev) => [
          ...prev,
          {
            id: `${payload.user.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            emoji: payload.emoji,
            user: payload.user,
            isMe: isMe,
          },
        ]);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [roomId, currentUser?.id, session?.access_token, onReaction]);

  const sendReaction = async (emoji: string) => {
    if (!channelRef.current || !currentUser) return;

    const payload = {
      emoji,
      user: {
        id: currentUser.id,
        display_name: currentUser.display_name,
        profile_url: currentUser.avatar_url,
      },
    };

    await channelRef.current.send({
      type: "broadcast",
      event: "reaction",
      payload,
    });
  };

  return {
    sendReaction,
    removeEmoji,
  };
};
