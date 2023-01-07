import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import ExchangesView from "@/views/ExchangesView.vue";
import SignUpView from "@/views/SignUpView.vue";
import NotFound from "@/views/NotFoundView.vue";
import NetworkError from "@/views/NetworkErrorView.vue";
import NotAuthorized from "@/views/NotAuthorizedView.vue";

// définition des routes accessible en front (URI)
const routes = [
  // page d'accueil
  {
    path: "/",
    name: "HomePage",
    component: HomeView,
    meta: {
      title: "Groupomania - Accueil",
    },
  },
  // page de connexion
  {
    path: "/login",
    name: "Login",
    component: LoginView,
    meta: {
      title: "Groupomania - Connexion",
    },
  },
  // page de création de compte
  {
    path: "/signup",
    name: "SignUp",
    component: SignUpView,
    meta: {
      title: "Groupomania - Nouveau compte",
    },
  },
  // page principale de consultation et de publication (messages et conversations)
  {
    path: "/exchanges",
    name: "Exchanges",
    component: ExchangesView,
    meta: {
      title: "Groupomania - The Social Network",
    },
  },
  // page d'erreur 404, ressource non trouvée
  {
    path: "/404/:resource",
    name: "404Resource",
    component: NotFound,
    props: true,
    meta: {
      title: "Erreur - Ressource non trouvée",
    },
  },
  // page d'erreur 500, erreur serveur
  {
    path: "/network-error",
    name: "NetworkError",
    component: NetworkError,
    meta: {
      title: "Erreur - Erreur réseau",
    },
  },
  // page d'erreur 401 ou 403, action non autorisée
  {
    path: "/unauthorized",
    name: "NotAuthorized",
    component: NotAuthorized,
    meta: {
      title: "Erreur - Action non autorisée",
    },
  },
  // gestion des tentatives d'ouverture de toutes les autres pages :
  // interception et redirection vers la page d'erreur "Page non trouvée"
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: "Erreur - Page non trouvée",
    },
  },
];

// initialisation du router
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// avant chaque ouverture de page, modification de la balise meta <title> pour nommer correctement l'onglet
router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title}`;
  next();
});

export default router;
