<!-- vue permettant d'informer l'utilisateur d'un problème réseau,
et lui donnant la possibilité de revenir en arrière ou de retourner à la page d'accueil -->
<template>
  <div class="container__col">
    <!-- titre -->
    <h2 class="titre__secondaire w100">Mince !</h2>
    <!-- message d'information -->
    <p class="text w80">
      Il semblerait que vous recontriez actuellement des problèmes réseau,
      prenez une grande inspiration et :
    </p>
    <!-- lien pour revenir une étape en arrière -->
    <p>
      <a href="#" class="bouton__secondaire" @click="returnBack">cliquez ici</a>
      pour revenir en arrière, ou
    </p>
    <!-- lien pour se déconnecter (effacer le token d'authentification) et revenir à la page d'accueil -->
    <p>
      <a href="#" class="bouton__secondaire" @click="returnHome">cliquez ici</a>
      pour vous déconnecter et revenir à la page d'accueil.
    </p>
  </div>
</template>

<script setup>
import router from "@/router";

//fonction permettant de revenir une étape en arrière en s'appuyant sur l'historique du router
function returnBack() {
  router.go(-1);
}
//fonction permettant de supprimer le token d'authentification et de rediriger l'utilisateur vers la page d'accueil
function returnHome() {
  sessionStorage.clear();
  router.push({
    name: "HomePage",
  });
}
</script>
