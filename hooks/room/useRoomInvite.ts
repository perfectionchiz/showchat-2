import * as Linking from "expo-linking";
import { useEffect } from "react";

export function useRoomInviteLink(setToken: any, setShowModal: any) {
  useEffect(() => {
    const handleUrl = ({ url }: { url: string }) => {
      const parsed = Linking.parse(url);
      const token = parsed.queryParams?.token as string;

      if (token) {
        setToken(token);
        setShowModal(true);
      }
    };

    const sub = Linking.addEventListener("url", handleUrl);

    Linking.getInitialURL().then((url) => {
      if (!url) return;

      const parsed = Linking.parse(url);
      const token = parsed.queryParams?.token as string;

      if (token) {
        setToken(token);
        setShowModal(true);
      }
    });

    return () => sub.remove();
  }, []);
}
