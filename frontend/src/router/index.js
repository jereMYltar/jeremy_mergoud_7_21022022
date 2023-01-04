import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import ExchangesView from "@/views/ExchangesView.vue";
import SignUpView from "@/views/SignUpView.vue";
import NotFound from "@/views/NotFoundView.vue";
import NetworkError from "@/views/NetworkErrorView.vue";
import NotAuthorized from "@/views/NotAuthorizedView.vue";

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomeView,
    meta: {
      title: "Groupomania - Accueil",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      title: "Groupomania - Connexion",
    },
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUpView,
    meta: {
      title: "Groupomania - Nouveau compte",
    },
  },
  {
    path: "/exchanges",
    name: "Exchanges",
    component: ExchangesView,
    meta: {
      title: "Groupomania - The Social Network",
    },
  },
  {
    path: "/404/:resource",
    name: "404Resource",
    component: NotFound,
    props: true,
    meta: {
      title: "Erreur - Ressource non trouvée",
    },
  },
  {
    path: "/network-error",
    name: "NetworkError",
    component: NetworkError,
    meta: {
      title: "Erreur - Erreur réseau",
    },
  },
  {
    path: "/unauthorized",
    name: "NotAuthorized",
    component: NotAuthorized,
    meta: {
      title: "Erreur - Action non autorisée",
    },
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "Erreur - Page non trouvée",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`;
  next();
});

export default router;
