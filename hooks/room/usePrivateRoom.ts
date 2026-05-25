import { useToast } from "@/components/context/ToastContext";
import { privateRoomService } from "@/services/private-room.service";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useState } from "react";
import { Share } from "react-native";

const KEY = ["private-room"];

export const usePrivateRoom = (onClose?: (res?: any) => void) => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { session } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);

  const roomQuery = useQuery({
    queryKey: KEY,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await privateRoomService.getRoom();
      return res.room;
    },
  });

  const createMutation = useMutation({
    mutationFn: privateRoomService.createRoom,
    onSuccess: async (res) => {
      const { invite_link } = res;

      if (invite_link) {
        await Share.share({
          message: `Join me on showchats 🚀\n${invite_link}`,
        });
      }
      queryClient.invalidateQueries({ queryKey: KEY });
      showToast(res.message ?? "Room created successfully", "success");
      onClose?.(res);
    },
    onError: (err: any) => {
      showToast(err.message ?? "Room creation failed", "error");
    },
  });

  const handleCreateRoom = async (
    payload: any,
    file?: { uri: string; name: string; type: string },
  ) => {
    try {
      let finalPayload = { ...payload };

      if (file?.uri) {
        setIsUploading(true);
        const accessToken = session?.access_token;

        if (!accessToken) {
          throw new Error("User not authenticated");
        }
        const res = await userService.uploadAvatar(
          file,
          "private-rooms",
          accessToken,
        );
        finalPayload.image_url = res.avatar_url;

        setIsUploading(false);
      }

      await createMutation.mutateAsync(finalPayload);
    } catch (err: any) {
      setIsUploading(false);
      showToast(err.message || "An unexpected error occurred", "error");
    }
  };

  const deleteRoom = useMutation({
    mutationFn: privateRoomService.deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      onClose?.();
      router.replace("/chats");
      showToast("Room deleted successfully", "success");
    },
    onError: (err: any) => {
      showToast(err.message ?? "Something went wrong", "error");
    },
  });

  const joinRoom = useMutation({
    mutationFn: privateRoomService.joinRoom,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: KEY });
      router.push("/chats/room");
      onClose?.();
      showToast(res.message ?? "Room joined successfully", "success");
    },
    onError: (err: any) => {
      showToast(err.message ?? "Something went wrong", "error");
    },
  });

  const leaveRoom = useMutation({
    mutationFn: privateRoomService.leaveRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
      showToast("Room exited successfully", "success");
    },
    onError: (err: any) => {
      showToast(err.message ?? "Something went wrong", "error");
    },
  });

  const regenerateLink = useMutation({
    mutationFn: privateRoomService.regenerateLink,
    onSuccess: async (data) => {
      const link = data?.invite_link;
      if (link) {
        await Share.share({
          message: `Join me on showchats 🚀\n${link}`,
        });
      }
      onClose?.();
      showToast(
        data.message ?? "Invite link generated successfully",
        "success",
      );
    },
  });

  const removeMember = useMutation({
    mutationFn: privateRoomService.removeMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
  });

  return {
    room: roomQuery.data,
    isLoadingRoom: roomQuery.isLoading || roomQuery.isFetching,
    isCreating: createMutation.isPending || isUploading,
    handleCreateRoom,
    regenerateLink,
    deleteRoom,
    joinRoom,
    leaveRoom,
    removeMember,
  };
};
