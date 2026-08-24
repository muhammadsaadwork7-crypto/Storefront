import axiosClient from "./axiosClient";

export const authApi = {
  register: (data) => axiosClient.post("/auth/register", data).then((res) => res.data),
  login: (data) => axiosClient.post("/auth/login", data).then((res) => res.data),
  me: () => axiosClient.get("/auth/me").then((res) => res.data),
};
