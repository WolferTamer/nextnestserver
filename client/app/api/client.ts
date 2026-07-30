import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

/*(apiClient.interceptors.request.use((config) => {
  const token = getAccessToken(); // wherever you store it — see note below
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});*/

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      // attempt refresh using the refresh-token cookie flow you already built,
      // then retry the original request once
    }
    return Promise.reject(error);
  },
);
