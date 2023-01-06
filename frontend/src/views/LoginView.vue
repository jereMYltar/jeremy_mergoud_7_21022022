<!-- vue permettant la connexion de l'utilisateur -->
<template>
  <div class="container__col">
    <!-- titre -->
    <h2 class="titre__secondaire w75">Connexion</h2>
    <!-- formulaire de saisie des informations -->
    <Form
      class="container__col jc__center ai__start w75"
      name="connectionForm"
      @submit="login"
    >
      <!-- champs de saisi de l'identifiant de connexion (email)
      en utilisant vee-validate : label, input, message d'erreur -->
      <label for="email" class="text">Id de connection</label>
      <Field
        id="email"
        v-model="email"
        name="email"
        type="text"
        maxlength="255"
        placeholder="Votre identifiant de connexion"
        aria-autocomplete="username"
        :rules="validateEmail"
      />
      <ErrorMessage name="email" class="alerte" />
      <!-- champs de saisi du mot de passe 
      en utilisant vee-validate : label, input, message d'erreur -->
      <label for="mdp" class="text">Mot de passe</label>
      <Field
        id="mdp"
        v-model="password"
        name="password"
        type="password"
        maxlength="255"
        placeholder="Votre mot de passe"
        aria-autocomplete="current-password"
        :rules="validatePassword"
      />
      <ErrorMessage name="password" class="alerte" />
      <!-- bouton de validation du formulaire -->
      <input
        class="bouton__principal w100"
        type="submit"
        value="Se connecter"
      />
    </Form>
    <!-- lien d'annulation pour retourner à la page d'accueil -->
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

//refs
const email = ref("");
const password = ref("");

// variables
const router = useRouter();
const usersStore = useUsersStore();

// fonction asynchrone permettant à l'utilisateur de se connecter :
// - envoi de l'email et du mot de passe
// - récupération et stockage du token d'authentification dans sessionStorage
// - enregistrement des données de l'utilisateur connecté dans Pinia
// - redirection vers la page principale
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
// fonction de validation de l'identififiant de connexion : présent et respecte le formalisme d'un email
function validateEmail(value) {
  // vérifie si le champ est rempli
  if (!value) {
    return "Ce champs est requis";
  }
  // vérifie si le champ respecte le formalisme d'un email
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!regex.test(value)) {
    return "Ce champ doit contenir une adresse email valide";
  }
  // si tout est bon : cas passant
  return true;
}
// fonction de validation du mot de passe : présent et respecte le formalisme imposé
function validatePassword(value) {
  // vérifie si le champ est rempli
  if (!value) {
    return "Ce champs est requis";
  }
  // vérifie si le champ respecte le formalisme imposé
  const regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g;
  if (!regex.test(value)) {
    return "Votre mot de passe doit contenir entre 8 et 64 caractères, avec au moins un lettre en minuscule, une en majuscule, un chiffre et un caractère spécial";
  }
  // si tout est bon : cas passant
  return true;
}
</script>
