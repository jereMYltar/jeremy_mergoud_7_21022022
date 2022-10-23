import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import LoginView from "@/views/LoginView.vue";
import ConversationView from "@/views/ConversationView.vue";
import SignUpView from "@/views/SignUpView.vue";
import NotFound from "@/views/NotFoundView.vue";
import NetworkError from "@/views/NetworkErrorView.vue";
import NotAuthorized from "@/views/NotAuthorizedView.vue";

const routes = [
  {
    path: "/",
    name: "HomePage",
    component: HomeView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/signup",
    name: "SignUp",
    component: SignUpView,
  },
  {
    path: "/conversation",
    name: "Conversation",
    component: ConversationView,
  },
  {
    path: "/404/:resource",
    name: "404Resource",
    component: NotFound,
    props: true,
  },
  {
    path: "/network-error",
    name: "NetworkError",
    component: NetworkError,
  },
  {
    path: "/unauthorized",
    name: "NotAuthorized",
    component: NotAuthorized,
  },
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
