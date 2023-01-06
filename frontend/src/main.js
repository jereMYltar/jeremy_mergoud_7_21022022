import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./assets/style/style.scss";

//initialisation de pinia
const pinia = createPinia();

//création de l'application
const app = createApp(App);

//mise en oeuvre de Pinia, du router et montage de l'application
app.use(pinia).use(router).mount("#app");
