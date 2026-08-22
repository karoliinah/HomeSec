import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const getDevices = async () => {
  const response = await api.get("/devices/");
  return response.data;
};

export const scanNetwork = async () => {
  const response = await api.post("/scan/");
  return response.data;
};

export const getScanHistory = async () => {
  const response = await api.get("/scan/history");
  return response.data;
};

export const getAlerts = async () => {
  const response = await api.get("/scan/alerts");
  return response.data;
};