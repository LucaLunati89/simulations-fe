import api from "./client";
import type {
  Simulation,
  EmployeeSimulation,
  SimulationsResponse,
} from "./types";

export async function findSimulationById(id: number): Promise<Simulation> {
  const { data } = await api.get<Simulation>(`/simulation/${id}/`);
  return data;
}

export async function findEmployeeSimulationById(
  id: number
): Promise<EmployeeSimulation> {
  const { data } = await api.get<EmployeeSimulation>(
    `/employee-simulation/${id}/`
  );
  return data;
}

export const fetchEmployeeSimulations = async (
  employeeSimulationId: number
): Promise<SimulationsResponse> => {
  try {
    const res = await api.get<SimulationsResponse>("simulations/", {
      params: { employee_simulation_id: employeeSimulationId },
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching simulations:", err);
    throw err;
  }
};

export const createSimulation = async (
  employee_simulation: number,
  name: string
): Promise<Simulation> => {
  try {
    const res = await api.post<Simulation>("/simulations/create/", {
      employee_simulation,
      name,
    });
    return res.data;
  } catch (err) {
    console.error("Error creating simulation:", err);
    throw err;
  }
};
