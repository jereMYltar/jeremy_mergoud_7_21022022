<template>
  <div class="main1 container">
    <h2 class="titre1">Connexion</h2>
    <form @submit.prevent="connect" class="container" name="connectionForm">
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
      <input class="connectionButton" type="submit" value="Se connecter" />
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    connect() {
      let user = {
        email: this.email,
        password: this.password,
      };
      axios
        .post("http://localhost:3000/api/connection/login", user)
        .then((response) => {
          sessionStorage.setItem("token", response.data.token);
          console.log(sessionStorage.getItem("token") == response.data.token);
          // ne fonctionne pas pour effacer le formulaire
          // this.email = "";
          // this.password = "";
          document.connectionForm.reset();
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>
