import axios from "axios";

const baseURL = "https://rosie-boost-api.vercel.app";

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
