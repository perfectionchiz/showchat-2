import { useToast } from "@/components/context/ToastContext";
import { queryClient } from "@/lib/queryClient";
import { roomService } from "@/services/room.service";
import { useMutation } from "@tanstack/react-query";
type RoomActionCallbacks = {
  onJoinSuccess?: (res: any, variables: any) => void;
  onLeaveSuccess?: (res: any, variables: any) => void;
  onReactSuccess?: (res: any, variables: any) => void;
};

export const useRoomActions = (callbacks?: RoomActionCallbacks) => {
  const { showToast } = useToast();

  const invalidateRoom = (room_id: string, room_type: string) =>
    queryClient.invalidateQueries({
      queryKey: ["room", room_id, room_type],
    });

  const reactToRoom = useMutation({
    mutationFn: roomService.reactToRoom,

    onSuccess: (res: any, variables) => {
      showToast(res?.message || "reaction sent", "success");

      callbacks?.onReactSuccess?.(res, variables);

      invalidateRoom(variables.room_id, variables.room_type);
    },

    onError: (err: any) => {
      showToast(err?.message || "failed to send reaction", "error");
    },
  });

  const joinRoom = useMutation({
    mutationFn: roomService.joinRoom,
    onSuccess: (res: any, variables) => {
      showToast(res?.message || "joined room", "success");

      callbacks?.onJoinSuccess?.(res, variables);
      invalidateRoom(variables.room_id, variables.room_type);
    },

    onError: (err: any) => {
      showToast(err?.message || "failed to join room", "error");
    },
  });

  const leaveRoom = useMutation({
    mutationFn: roomService.leaveRoom,

    onSuccess: (res: any, variables) => {
      showToast(res?.message || "left room", "info");

      callbacks?.onLeaveSuccess?.(res, variables);

      queryClient.invalidateQueries({
        queryKey: ["rooms"],
      });
    },

    onError: (err: any) => {
      showToast(err?.message || "failed to leave room", "error");
    },
  });

  return {
    reactToRoom,
    joinRoom,
    leaveRoom,
  };
};
