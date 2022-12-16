<template>
  <div class="main1 container">
    <UserComponent :userId="0" />
    <router-link :to="{ name: 'HomePage' }" class="littleButton"
      >Annuler</router-link
    >
  </div>
</template>

<script setup>
import UserComponent from "@/components/user/UserComponent.vue";
</script>
