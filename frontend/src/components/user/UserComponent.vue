<template>
  <div class="main1 container">
    <h2 class="titre1">Création de compte</h2>
    <Form class="container" name="signUpForm" @submit="signUp">
      <div class="question">
        <label for="firstName" class="titre2">Prénom</label>
        <Field
          id="firstName"
          v-model="firstName"
          name="firstName"
          type="text"
          maxlength="20"
          placeholder="Votre prénom"
          :rules="validateName"
        />
        <ErrorMessage name="firstName" class="errorMessage" />
      </div>
      <div class="question">
        <label for="lastName" class="titre2">Nom</label>
        <Field
          id="lastName"
          v-model="lastName"
          name="lastName"
          type="text"
          maxlength="20"
          placeholder="Votre nom d'usage"
          :rules="validateName"
        />
        <ErrorMessage name="lastName" class="errorMessage" />
      </div>
      <div class="question">
        <label for="email" class="titre2">Id de connection</label>
        <Field
          id="email"
          v-model="email"
          name="email"
          type="text"
          maxlength="255"
          placeholder="Votre identifiant de connexion"
          :rules="validateEmail"
        />
        <ErrorMessage name="email" class="errorMessage" />
      </div>
      <div v-if="props.userId" class="question">
        <h3>
          Si vous souhaitez modifier votre mot de passe, saisissez votre mot de
          passe actuel puis saississez un nouveau mot de passe, sinon laissez ce
          champs vide.
        </h3>
        <label for="existingPassword" class="titre2">
          Votre mot de passe actuel
        </label>
        <Field
          id="existingPassword"
          v-model="initialPassword"
          name="existingPassword"
          type="password"
          maxlength="128"
          placeholder="Votre mot de passe actuel"
          :rules="validateExistingPassword"
        />
        <ErrorMessage name="existingPassword" class="errorMessage" />
      </div>
      <div v-if="!props.userId || initialPassword">
        <div class="question">
          <label for="mdp" class="titre2">Mot de passe</label>
          <Field
            id="mdp"
            v-model="password"
            name="password"
            type="password"
            maxlength="128"
            placeholder="Votre mot de passe"
            :rules="validatePassword"
          />
          <ErrorMessage name="password" class="errorMessage" />
        </div>
        <div class="question">
          <label for="mdp2" class="titre2">Confirmer votre mot de passe</label>
          <Field
            id="mdp2"
            v-model="password2"
            name="password2"
            type="password"
            maxlength="128"
            placeholder="Confirmer votre mot de passe"
            :rules="validatePassword2"
          />
          <ErrorMessage name="password2" class="errorMessage" />
        </div>
      </div>
      <div>
        <div class="question">
          <Field name="isAdminField" :value="isAdmin">
            <label for="isAdmin" class="titre2">
              Cochez cette case si vous êtes administrateur du site :
            </label>
            <input id="isAdmin" v-model="isAdmin" type="checkbox" />
          </Field>
        </div>
        <div v-if="isAdmin" class="question">
          <label for="adminPassword" class="titre2">
            Code spécifique de vérification transmis par votre organisation.
          </label>
          <Field
            id="adminPassword"
            v-model="adminPassword"
            name="adminPassword"
            type="password"
            placeholder="Mot de passe donné par votre organisation"
            :rules="validateAdminValue"
          />
          <ErrorMessage name="adminPassword" class="errorMessage" />
        </div>
      </div>
      <input
        v-if="!props.userId"
        class="basicButton"
        type="submit"
        value="Créer un compte"
      />
      <input
        v-if="props.userId"
        class="basicButton"
        type="submit"
        value="Modifier votre compte"
      />
    </Form>
    <button
      v-if="
        props.userId &&
        (props.userId == usersStore.activeUser.id ||
          usersStore.activeUser.isAdmin)
      "
      class="littleButton"
      @click="deleteAccount"
    >
      Supprimer le compte
    </button>
  </div>
</template>

<script setup>
import {
  ref,
  nextTick,
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
} from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useRouter } from "vue-router";
import { useUsersStore } from "@/store/usersStore";
import EventService from "@/services/EventService.js";

//stores
const router = useRouter();
const usersStore = useUsersStore();

//props
const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
});

//events
const emit = defineEmits(["close"]);

//refs
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const initialPassword = ref("");
const password = ref("");
const password2 = ref("");
const adminPassword = ref("");
const isAdmin = ref(false);
const isMale = ref(false);
const photo = ref("");
const pseudo = ref("");

//methods
function validateEmail(value) {
  // if the field is empty
  if (!value) {
    return "Ce champs est requis.";
  }
  // if the field is not a valid email
  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  if (!regex.test(value)) {
    return "Ce champ doit contenir une adresse email valide (exemple : mon-email@domaine.fr).";
  }
  // All is good
  return true;
}

function validatePassword(value) {
  // if the field is empty
  if (!value) {
    return "Ce champs est requis.";
  }
  // if the field is not a valid email
  const regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g;
  if (!regex.test(value)) {
    return "Votre mot de passe doit contenir entre 8 et 64 caractères, avec au moins un lettre en minuscule, une en majuscule, un chiffre et un caractère spécial.";
  }
  // All is good
  return true;
}

function validatePassword2(value) {
  // if the field is empty
  if (!value) {
    return "Ce champs est requis.";
  }
  if (password.value == password2.value) {
    return true;
  } else {
    return "Les mots de passe ne correspondent pas.";
  }
  // All is good
}

function validateExistingPassword(value) {
  // if the field is not a valid email
  const regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,64})/g;
  if (value && !regex.test(value)) {
    return "Votre mot de passe actuel contient entre 8 et 64 caractères, avec au moins un lettre en minuscule, une en majuscule, un chiffre et un caractère spécial. Vérifiez votre saisie.";
  } else {
    // All is good
    return true;
  }
}

function validateName(value) {
  // if the field is empty
  if (!value) {
    return "Ce champs est requis.";
  }
  // if the field is not a valid email
  const regex =
    /^(([A-ZÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{1}[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ]*){1}([ \-']{1}[A-ZÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ]{1}[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ]+)*)$/g;
  if (!regex.test(value)) {
    return "Vos prénoms et noms doivent être composés d'un ou plusieurs éléments séparés par un espace, un apostrophe ou un tiret ; chaque élément devant commencer par une majucule suivie de lettres minuscules, chaque lettre pouvant être accentuées ou non.";
  }
  // All is good
  return true;
}

function validateAdminValue() {
  if (
    isAdmin.value &&
    isAdmin.value != usersStore.userWatched.isAdmin &&
    !adminPassword.value
  ) {
    return "Pour vous inscrire en tant qu'administrateur, vous devez saisir le code spécifique transmis par votre organisation.";
  } else {
    return true;
  }
}

async function deleteAccount() {
  if (
    window.confirm(`Vous vous apprêter à supprimer cet utilisateur.
    Cette action est irreversible, voulez-vous continuer ?`)
  ) {
    try {
      await EventService.deleteUser(props.userId);
      sessionStorage.clear();
      router.push({
        name: "HomePage",
      });
    } catch (error) {
      return "Problème serveur";
    }
  } else {
    emit("close");
  }
}

async function signUp() {
  let userData = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    initialPassword: initialPassword.value,
    password: password.value,
    isAdmin: isAdmin.value,
    adminPassword: adminPassword.value,
    isMale: isMale.value, //unused yet
    photo: photo.value, //unused yet
    pseudo: pseudo.value, //unused yet
  };
  userData.id = props.userId ? props.userId : 0;
  try {
    const response = await EventService.signUp(userData);
    usersStore.updateUsersStore(response.data.user);
    await nextTick();
    if (response.data.token) {
      sessionStorage.setItem("token", response.data.token);
      router.push({
        name: "Exchanges",
      });
    } else {
      emit("close");
    }
  } catch (error) {
    if (error.response && error.response.status == 404) {
      router.push({
        name: "404Resource",
        params: { resource: "Le compte recherché" },
      });
    } else {
      router.push({ name: "NetworkError" });
    }
  }
}

onMounted(async () => {
  if (props.userId) {
    let user = await EventService.getUserDetails(props.userId);
    user = user.data.userDetails;
    firstName.value = user.firstName;
    lastName.value = user.lastName;
    email.value = user.email;
    initialPassword.value = "";
    isAdmin.value = user.isAdmin;
    usersStore.addUserWatched({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  }
});

onUnmounted(async () => {
  usersStore.removeUserWatched();
});
</script>
