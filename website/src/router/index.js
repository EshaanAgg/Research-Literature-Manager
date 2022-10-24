import { createRouter, createWebHistory } from "vue-router";
import CandidatePapers from "../views/CandidatePapers.vue";
import HomeView from "../views/HomeView.vue";
import PaperView from "../views/PaperView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/papers",
      name: "papers",
      component: PaperView,
    },
    {
      path: "/candidate",
      name: "candidate-papers",
      component: CandidatePapers,
    },
  ],
});

export default router;
