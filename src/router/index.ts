import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";
import EmployeeSimulationDetailPage from "../views/EmployeeSimulationDetailPage.vue";
import EmployeeSimulationsPage from "../views/EmployeeSimulationsPage.vue";
const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomePage,
  },
  {
    path: "/employee-simulations/",
    name: "EmployeeSimulationsPage",
    component: EmployeeSimulationsPage,
  },
  {
    path: "/employee-simulations/:id",
    name: "EmployeeSimulationDetail",
    component: EmployeeSimulationDetailPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
