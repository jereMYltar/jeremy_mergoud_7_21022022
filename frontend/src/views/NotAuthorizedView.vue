<template>
  <div class="container__col">
    <h1 class="titre__secondaire">Pas pour l'instant !</h1>
    <h2 class="titre__tertiaire">Vous n'êtes pas autorisé à continuer.</h2>
    <p>
      <a href="#" class="bouton__secondaire" @click="returnBack">cliquez ici</a>
      pour revenir en arrière, ou
    </p>
    <p>
      <a href="#" class="bouton__secondaire" @click="returnHome">cliquez ici</a>
      pour vous déconnecter et revenir à la page d'accueil.
    </p>
  </div>
</template>

<script setup>
// import { EventService } from "../services/EventService";
import router from "@/router";

function returnBack() {
  router.go(-1);
}

function returnHome() {
  sessionStorage.clear();
  router.push({
    name: "Login",
  });
}
</script>
