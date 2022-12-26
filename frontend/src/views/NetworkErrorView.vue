<template>
  <div class="main1 container">
    <h1 class="titre1">Mince !</h1>
    <p class="text">
      Il semblerait que vous recontriez actuellement des problèmes réseau,
      prenez une grande inspiration et :
    </p>
    <a href="#" class="basicButton" @click="$router.go(-1)"
      >cliquez ici pour réessayer
    </a>
    <a href="#" class="basicButton" @click="returnHome"
      >cliquez ici pour revenir à la page d'accueil
    </a>
  </div>
</template>

<script>
export default {
  methods: {
    returnHome() {
      if (sessionStorage.getItem("token")) {
        this.$router.push({ name: "Conversation" });
      } else {
        this.$router.push({ name: "HomePage" });
      }
    },
  },
};
</script>
