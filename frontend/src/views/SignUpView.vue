<template>
  <div class="main container__col">
    <UserComponent :user-id="0" />
    <router-link :to="{ name: 'HomePage' }" class="bouton__secondaire w50"
      >Annuler</router-link
    >
  </div>
</template>

<script setup>
import UserComponent from "@/components/user/UserComponent.vue";
</script>
