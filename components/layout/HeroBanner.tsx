import { PRIMARY_COLOR } from "@/constants/constants";
import { LiveStream } from "@/models/livechat.model";
import { useRoomStore } from "@/store/roomStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import { useToast } from "../context/ToastContext";
import { LiveCard } from "../live/LiveCard";
import EmptyState from "../ui/EmptyState";

const ROTATE_INTERVAL = 8000;

interface HeroBannerProps {
  rooms: LiveStream[];
  setSearch: (search: string) => void;
}

export function HeroBanner({ rooms, setSearch }: HeroBannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const setRoom = useRoomStore((s) => s.setRoom);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const { showToast } = useToast();
  const next = useCallback(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();

    setActiveIndex((i) => (i + 1) % rooms.length);
    setProgress(0);
  }, [rooms.length]);

  useEffect(() => {
    if (paused || rooms.length <= 1) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + 100 / (ROTATE_INTERVAL / 50);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [paused, rooms.length, next]);

  if (!rooms.length) {
    return (
      <EmptyState
        title="No trending live streams right now"
        description="Check back later or refresh to see new rooms."
        icon={<Ionicons name="trending-up" color={PRIMARY_COLOR} size={40} />}
        buttonText="Tap to refresh"
        onButtonPress={() => {
          setActiveIndex(0);
          setProgress(0);
          setSearch("");
        }}
      />
    );
  }

  const room = rooms[activeIndex];

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={() => setPaused(true)}
        onPressOut={() => setPaused(false)}
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          <LiveCard
            messageCount={room.viewers}
            avatarUrl={room.avatarUrl}
            channelName={room.channelName}
            channelVerified={room.channelVerified}
            title={room.title}
            banner={room.banner}
            viewers={room.viewers}
            reactions={room.reactions}
            extraReactionsCount={room.extraReactionsCount}
            participantAvatars={room.participantAvatars}
            endsAt={room.endsAt}
            watchedBefore={room.watchedBefore}
            progress={progress}
            roomStatus={room.roomStatus}
            onPress={() => {
              setRoom(room);
              router.push({
                pathname: "/home/[roomChatId]",
                params: { roomChatId: `${room.id}` },
              });
            }}
          />
        </Animated.View>
      </TouchableOpacity>

      {rooms.length > 1 && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          {rooms.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setActiveIndex(i);
                setProgress(0);
              }}
              style={{
                width: i === activeIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 4,
                backgroundColor: i === activeIndex ? "#ef4444" : "#9ca3af",
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
