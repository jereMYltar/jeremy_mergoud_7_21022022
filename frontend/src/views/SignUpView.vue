<template>
  <div class="container__col">
    <UserComponent :user-id="0" />
    <router-link :to="{ name: 'HomePage' }" class="bouton__tertiaire"
      >Annuler</router-link
    >
  </div>
</template>

<script setup>
import UserComponent from "@/components/user/UserComponent.vue";
</script>
