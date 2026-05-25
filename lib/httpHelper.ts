import api from "./api";

export const http = {
  get: async <T>(url: string, params?: any): Promise<T> => {
    const res = await api.get<T>(url, { params });
    return res.data;
  },

  post: async <T, P = unknown>(url: string, data?: P): Promise<T> => {
    const res = await api.post<T>(url, data);
    return res.data;
  },

  put: async <T, P = unknown>(url: string, data?: P): Promise<T> => {
    const res = await api.put<T>(url, data);
    return res.data;
  },

  patch: async <T, P = unknown>(url: string, data?: P): Promise<T> => {
    const res = await api.patch<T>(url, data);
    return res.data;
  },

  delete: async <T>(url: string): Promise<T> => {
    const res = await api.delete<T>(url);
    return res.data;
  },
};
