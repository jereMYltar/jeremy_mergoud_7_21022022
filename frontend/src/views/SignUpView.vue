<template>
  <div class="main1 container">
    <h2 class="titre1">Création de compte</h2>
    <form @submit.prevent="signUp" class="container" name="registrationForm">
      <div class="question">
        <label for="firstName" class="titre2">Prénom</label>
        <input
          v-model="firstName"
          id="firstName"
          type="text"
          maxlength="255"
          placeholder="Votre prénom"
          class="textInput"
        />
      </div>
      <div class="question">
        <label for="lastName" class="titre2">Nom d'usage</label>
        <input
          v-model="lastName"
          id="lastName"
          type="text"
          maxlength="255"
          placeholder="Votre nom d\'usage"
          class="textInput"
        />
      </div>
      <div class="question">
        <label for="pseudo" class="titre2">Pseudonyme en ligne</label>
        <input
          v-model="pseudo"
          id="pseudo"
          type="text"
          maxlength="255"
          placeholder="Votre pseudonyme qui s'affichera en ligne"
          class="textInput"
        />
      </div>
      <div class="question">
        <label for="email" class="titre2">Id de connection</label>
        <input
          v-model="email"
          id="email"
          type="text"
          maxlength="255"
          placeholder="Votre identifiant de connexion"
          class="textInput"
          required
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
          required
        />
      </div>
      <input class="basicButton" type="submit" value="Créer un compte" />
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
      isMale: 0,
      firstName: "",
      lastName: "",
      pseudo: "",
      isAdmin: 0,
      photo: "",
      email: "",
      password: "",
    };
  },
  methods: {
    signUp() {
      let payload = {
        user: {
          isMale: false,
          firstName: this.firstName,
          lastName: this.lastName,
          pseudo: this.pseudo,
          isAdmin: false,
          email: this.email,
          password: this.password,
          photo: null,
        },
      };
      EventService.signUp(payload)
        .then((response) => {
          sessionStorage.setItem("token", response.data.token);
          this.firstName = "";
          this.lastName = "";
          this.pseudo = "";
          this.email = "";
          this.password = "";
        })
        .catch((error) => {
          if (error.response && error.response.status == 404) {
            this.$router.push({
              name: "404Resource",
              params: { resource: "Le compte recherché" },
            });
          } else {
            this.$router.push({ name: "NetworkError" });
          }
        });
    },
  },
};
</script>
