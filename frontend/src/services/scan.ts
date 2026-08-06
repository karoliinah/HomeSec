import { api } from "./api";

export async function scanNetwork() {
  const response = await api.post("/scan/");
  return response.data;
}