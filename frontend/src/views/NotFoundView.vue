<template>
  <div class="main container__col">
    <h1 class="titre__secondaire">Oops!</h1>
    <h2 class="titre__tertiaire">{{ resource }} n'existe pas.</h2>
    <router-link :to="{ name: 'HomePage' }" class="bouton__secondaire"
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
