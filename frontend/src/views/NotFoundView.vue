<!-- vue permettant d'informer l'utilisateur de l'inexistance d'un élément, par défaut la page -->
<template>
  <div class="container__col">
    <!-- titre -->
    <h2 class="titre__secondaire w100">Oops!</h2>
    <!-- message d'information s'adaptant à la situation -->
    <p class="text w80">{{ resource }} n'existe pas.</p>
    <router-link :to="{ name: 'HomePage' }" class="bouton__secondaire"
      >Retour à la page d'accueil</router-link
    >
  </div>
</template>

<script>
export default {
  // récupération de l'information concernant l'élément inexistant via les propriétés,
  // par défaut "La page recherchée"
  props: {
    resource: {
      type: String,
      required: true,
      default: "La page recherchée",
    },
  },
};
</script>
