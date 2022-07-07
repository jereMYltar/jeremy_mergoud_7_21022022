<template>
  <div class="main1 container">
    <h2 class="titre1">Connexion</h2>
    <Form @submit="login" class="container" name="connectionForm">
      <div class="question">
        <label for="email" class="titre2">Id de connection</label>
        <Field
          v-model="email"
          id="email"
          name="email"
          type="text"
          maxlength="255"
          placeholder="Votre identifiant de connexion"
          class="textInput"
          :rules="validateEmail"
        />
      </div>
      <ErrorMessage name="email" class="errorMessage" />
      <div class="question">
        <label for="mdp" class="titre2">Mot de passe</label>
        <Field
          v-model="password"
          id="mdp"
          name="password"
          type="password"
          maxlength="255"
          placeholder="Votre mot de passe"
          class="textInput"
          :rules="validatePassword"
        />
      </div>
      <ErrorMessage name="password" class="errorMessage" />
      <input class="basicButton" type="submit" value="Se connecter" />
      <router-link :to="{ name: 'HomePage' }" class="littleButton"
        >Annuler</router-link
      >
    </Form>
  </div>
</template>

<script>
import EventService from "@/services/EventService.js";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  methods: {
    login() {
      let payload = {
        email: this.email,
        password: this.password,
      };
      // EventService.post("/connection/login", payload)
      EventService.login(payload)
        .then((response) => {
          sessionStorage.setItem("token", response.data.token);
          this.$router.push({
            name: "Conversation",
          });
        })
        .catch();
    },
    validateEmail(value) {
      // if the field is empty
      if (!value) {
        return "Ce champs est requis";
      }
      // if the field is not a valid email
      const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      if (!regex.test(value)) {
        return "Ce champ doit contenir une adresse email valide";
      }
      // All is good
      return true;
    },
    validatePassword(value) {
      // if the field is empty
      if (!value) {
        return "Ce champs est requis";
      }
      // if the field is not a valid email
      // const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
      // if (!regex.test(value)) {
      //   return "This field must be a valid email";
      // }
      // All is good
      return true;
    },
  },
};
</script>
