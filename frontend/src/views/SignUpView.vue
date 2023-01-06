<!-- vue permettant à l'utilisateur de se connecter -->
<template>
  <div class="container__col">
    <!-- appel du composant de saisie de informations de l'utilisateur.
    l'attribut ':user-id=0' indique qu'il s'agit d'une création d'utilisateur -->
    <UserComponent :user-id="0" />
    <!-- lien renvoyant vers la page d'accueil -->
    <router-link :to="{ name: 'HomePage' }" class="bouton__tertiaire"
      >Annuler</router-link
    >
  </div>
</template>

<script setup>
// import des composants utiles pour cette view
import UserComponent from "@/components/user/UserComponent.vue";
</script>
