import api from "./client";
import type { Device } from "./types";
import type { SimulationDevice } from "./types";

export const addDeviceToSimulation = async (
  simulationId: number,
  deviceId: number
): Promise<Device> => {
  try {
    const res = await api.post<Device>("/devices-simulation/add/", {
      simulation_id: simulationId,
      device_id: deviceId,
    });
    return res.data;
  } catch (err) {
    console.error("Error adding device to simulation:", err);
    throw err;
  }
};

export const fetchSimulationDevices = async (
  simulationId: number
): Promise<SimulationDevice[]> => {
  const res = await api.get(`/devices-simulation/${simulationId}`);
  return res.data;
};

export async function updateSimulationDevice(
  simDeviceId: number,
  months: number
) {
  const { data } = await api.patch(
    `/devices-simulation/${simDeviceId}/update`,
    {
      months,
    }
  );
  return data;
}

export async function deleteSimulationDevice(simDeviceId: number) {
  await api.delete(`/devices-simulation/${simDeviceId}/delete/`);
}
