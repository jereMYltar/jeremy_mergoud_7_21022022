<template>
  <div class="main1 container">
    <h2 class="titre1">Connexion</h2>
    <form @submit.prevent="login" class="container" name="connectionForm">
      <div class="question">
        <label for="email" class="titre2">Id de connection</label>
        <input
          v-model="email"
          id="email"
          type="text"
          maxlength="255"
          placeholder="Votre identifiant de connexion"
          class="textInput"
        />
      </div>
      <div class="question">
        <label for="mdp" class="titre2">Mot de passe</label>
        <input
          v-model="password"
          id="mdp"
          type="password"
          maxlength="255"
          placeholder="Votre mot de passe"
          class="textInput"
        />
      </div>
      <input class="basicButton" type="submit" value="Se connecter" />
      <router-link :to="{ name: 'HomePage' }" class="littleButton"
        >Annuler</router-link
      >
    </form>
  </div>
</template>

<script>
import EventService from "@/services/EventService.js";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login() {
      let payload = {
        email: this.email,
        password: this.password,
      };
      EventService.login(payload)
        .then((response) => {
          sessionStorage.setItem("token", response.data.token);
          console.log(sessionStorage.getItem("token") == response.data.token);
          this.email = "";
          this.password = "";
        })
        .catch();
    },
  },
};
</script>
