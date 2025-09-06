import api from "./client";
import type { EmployeeSimulationResponse, EmployeeSimulation } from "./types";

interface FetchParams {
  min_salary?: number;
  max_salary?: number;
  order_by?: string;
  page?: number;
  page_size?: number;
}

export const fetchEmployeeSimulations = async (
  params: FetchParams = {}
): Promise<EmployeeSimulationResponse> => {
  try {
    const res = await api.get<EmployeeSimulationResponse>(
      "employee-simulations/",
      {
        params,
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error fetching employee simulations:", err);
    throw err;
  }
};

export const fetchEmployeeSimulationById = async (
  id: number
): Promise<EmployeeSimulation> => {
  try {
    const res = await api.get<EmployeeSimulation>(`employee-simulations/${id}`);
    return res.data;
  } catch (err) {
    console.error(`Error fetching employee simulation with id ${id}:`, err);
    throw err;
  }
};
