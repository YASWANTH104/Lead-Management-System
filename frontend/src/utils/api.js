import axios from "axios";

export const API = axios.create({
  baseURL: "https://lead-management-system-plum.vercel.app/api",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

