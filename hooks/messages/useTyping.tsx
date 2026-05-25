import { supabase } from "@/lib/supabase";
import { User } from "@/models/auth.model";
import { RealtimeChannel } from "@supabase/supabase-js";
import throttle from "lodash/throttle";
import { useCallback, useEffect, useRef, useState } from "react";
export interface TypingIndicatorProps {
  roomId: string;
  user: User | null;
}

export const useTyping = ({ roomId, user }: TypingIndicatorProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [payload, setPayload] = useState<any | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    const newChannel = supabase.channel(`typing:${roomId}`);

    const onTyping = (receivedPayload: any) => {
      setPayload(receivedPayload.payload);
      setIsTyping(true);
      hideTypingIndicator();
    };

    const hideTypingIndicator = () => {
      setTimeout(() => setIsTyping(false), 2000);
    };

    newChannel.on("broadcast", { event: "typing" }, onTyping);
    const subscription = newChannel.subscribe();
    channelRef.current = newChannel;

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId]);

  const throttledTypingEvent = throttle(() => {
    if (!channelRef.current) return;
    channelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { user },
    });
  }, 3000);

  const sendTypingEvent = useCallback(() => {
    throttledTypingEvent();
  }, [throttledTypingEvent]);

  const typingUsers = payload?.user
    ? [
        {
          ...payload.user,
          user_name:
            payload.user.username ||
            payload.user.email ||
            payload.user.display_name ||
            "Someone",
        },
      ]
    : [];

  return { typingUsers, isTyping, sendTypingEvent };
};
