import axios from "axios";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 60000,
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

export const analyzeDevice = async (deviceId: number) => {
  console.log(
    "Calling AI endpoint:",
    `/ai/analyze/${deviceId}`
  );

  try {
    const response = await api.get(
      `/ai/analyze/${deviceId}`
    );

    console.log(
      "AI HTTP status:",
      response.status
    );

    console.log(
      "AI response data:",
      response.data
    );

    console.log(
      "AI response type:",
      typeof response.data
    );

    console.log(
      "AI analysis field:",
      response.data?.analysis
    );

    return response.data;
  } catch (error) {
    console.error(
      "AI request failed:",
      error
    );

    throw error;
  }
};