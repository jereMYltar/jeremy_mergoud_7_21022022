<template>
  <div class="container__col">
    <h2 class="titre__secondaire w75">Connexion</h2>
    <Form
      class="container__col jc__center ai__start w75"
      name="connectionForm"
      @submit="login"
    >
      <label for="email" class="text">Id de connection</label>
      <Field
        id="email"
        v-model="email"
        name="email"
        type="text"
        maxlength="255"
        placeholder="Votre identifiant de connexion"
        :rules="validateEmail"
      />
      <ErrorMessage name="email" class="alerte" />
      <label for="mdp" class="text">Mot de passe</label>
      <Field
        id="mdp"
        v-model="password"
        name="password"
        type="password"
        maxlength="255"
        placeholder="Votre mot de passe"
        :rules="validatePassword"
      />
      <ErrorMessage name="password" class="alerte" />
      <input
        class="bouton__principal w100"
        type="submit"
        value="Se connecter"
      />
    </Form>
    <router-link :to="{ name: 'HomePage' }" class="bouton__tertiaire"
      >Annuler</router-link
    >
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useRouter } from "vue-router";
import { useUsersStore } from "@/store/usersStore";
import EventService from "@/services/EventService.js";

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
    sessionStorage.setItem("token", response.data.token);
    usersStore.addActiveUser(response.data.activeUser);
    await nextTick();
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
