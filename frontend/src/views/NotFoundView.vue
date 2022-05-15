<template>
  <div class="main1 container">
    <h1 class="titre1">Oops!</h1>
    <h2 class="titre2">{{ resource }} n'existe pas.</h2>
    <router-link :to="{ name: 'HomePage' }" class="littleButton"
      >Retour à la page d'accueil</router-link
    >
  </div>
</template>

<script>
export default {
  props: {
    resource: {
      type: String,
      required: true,
      default: "La page recherchée",
    },
  },
};
</script>
