import axios from "axios";

export const API = axios.create({
  baseURL: "https://lead-management-system-plum.vercel.app/api",
  withCredentials: true, // allows httpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

