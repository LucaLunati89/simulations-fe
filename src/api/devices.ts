import api from "./client";
import type { Device } from "./types";

export async function getAllDevices(): Promise<Device[]> {
  const { data } = await api.get<Device[]>("/devices/");
  return data;
}
