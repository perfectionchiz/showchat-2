import { http } from "@/lib/httpHelper";
import { AuthSessionData } from "@/models/auth.sessions.model";

export const authSessionService = {
  getSessions: () => {
    return http.get<AuthSessionData>("/auth-sessions");
  },

  deleteSession: (id: string) => {
    return http.delete(`/auth-sessions-delete/${id}`);
  },
};
