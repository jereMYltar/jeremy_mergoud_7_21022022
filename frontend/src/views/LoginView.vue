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

<script setup>
import EventService from "@/services/EventService.js";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUsersStore } from "@/store/usersStore";

const email = ref("");
const password = ref("");
const router = useRouter();
const usersStore = useUsersStore();

async function login() {
  try {
    let payload = {
      email: email.value,
      password: password.value,
    };
    let response = await EventService.login(payload);
    usersStore.storeIsActiveUserAdmin(response.data.isAdmin);
    sessionStorage.setItem("token", response.data.token);
    router.push({
      name: "Exchanges",
    });
  } catch (error) {
    console.error(error);
    return "Mot de passe ou identifiant invalide";
  }
}
function validateEmail(value) {
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
}
function validatePassword(value) {
  // if the field is empty
  if (!value) {
    return "Ce champs est requis";
  }
  // if the field is not a valid email
  const regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g;
  if (!regex.test(value)) {
    return "Votre mot de passe doit contenir entre 8 et 64 caractères, avec au moins un lettre en minuscule, une en majuscule, un chiffre et un caractère spécial";
  }
  // All is good
  return true;
}
</script>
