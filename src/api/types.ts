export type ID = number;

export interface Device {
  id: ID;
  model: string;
  monthly_cost: number;
  brand: string;
}

export const SimulationStatus = {
  CREATED: "CREATED",
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
} as const;

export type SimulationStatus =
  (typeof SimulationStatus)[keyof typeof SimulationStatus];

export interface Simulation {
  id: number;
  name?: string | null;
  created_at: string;
  employee_simulation: number;
  status: SimulationStatus;
}

export interface SimulationsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Simulation[];
}

export interface EmployeeSimulation {
  id: number;
  gross_salary: string;
  tax_rate: string;
  contract_months: number;
  base_cost: string;
}

export interface EmployeeSimulationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EmployeeSimulation[];
}

export interface SimulationDevice {
  id: ID;
  simulation: number;
  device: Device;
  months: number;
  total_cost: number;
}

export interface SimulationDevicePatch {
  months: number;
}
