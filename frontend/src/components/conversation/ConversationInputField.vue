<!-- module permettant de créer ou modifier une conversation selon si une conversation lui est passée en props -->
<template>
  <!-- titre du composant qui s'adapte selon la situation -->
  <h2 v-if="!props.existingConversation" class="titre__tertiaire w100">
    Créer une nouvelle conversation
  </h2>
  <h2 v-if="props.existingConversation" class="titre__tertiaire w100">
    Modifier la conversation
  </h2>
  <!-- formulaire de saisie des informations -->
  <Form
    class="container__col jc__center ai__start w75"
    name="connectionForm"
    @submit="saveConversation"
  >
    <!-- nom de la conversation : label, champs de saisie, nombre de caractères restants, message d'erreur après vérification automatique -->
    <div>
      <label for="conversationName" class="text"
        >Nom de la conversation :
      </label>
      <Field
        id="conversationName"
        v-model="conversationName"
        name="conversationName"
        type="text"
        maxlength="80"
        placeholder="Le nom de votre conversation"
        :rules="isNotEmpty"
      />
      <div class="text__details">
        Nombre de caractères restants : {{ charactersLeftInConversationName }}
      </div>
      <ErrorMessage name="conversationName" class="alerte" />
    </div>
    <!-- gestion du gestionnaire de la conversation : label, liste déroulante de choix, message d'erreur après vérification automatique -->
    <div
      v-if="props.existingConversation"
      class="container__col jc__center ai__start w100"
    >
      <Field
        ref="ownerFieldRef"
        name="ownerField"
        :rules="hasOwner"
        :value="selectedOwner"
      >
        <label for="ownerList" class="text"
          >Gestionnaire de la conversation :
        </label>
        <Multiselect
          id="ownerList"
          v-model="selectedOwner"
          label="name"
          mode="tags"
          placeholder="Sélectionner un gestionnaire"
          value-prop="id"
          :close-on-select="true"
          :max="1"
          :object="true"
          :options="selectedUsers"
          :searchable="false"
          @focusout="triggerOwnerFieldAudit"
        />
        <ErrorMessage name="ownerField" class="alerte" />
      </Field>
    </div>
    <!-- gestion de l'information conversation publique : label et case à cocher -->
    <div v-if="usersStore.activeUser.isAdmin" class="w100">
      <label for="isPublic" class="text">Conversation publique :</label>
      <input id="isPublic" v-model="isPublic" type="checkbox" />
    </div>
    <!-- gestion de l'information conversation verrouillée : label et case à cocher -->
    <div
      v-if="
        props.existingConversation &&
        conversationsStore.activeConversation.hasRightsOn
      "
      class="w100"
    >
      <label for="isClosed" class="text">Conversation verrouillée :</label>
      <input id="isClosed" v-model="isClosed" type="checkbox" />
    </div>
    <!-- gestion des participants à la conversation : label, liste déroulante de choix, message d'erreur après vérification automatique -->
    <div v-if="!isPublic" class="container__col jc__center ai__start w100">
      <Field
        ref="memberListFieldRef"
        name="conversationMembers"
        :rules="hasMembers"
        :value="selectedUsers"
      >
        <label for="membersList" class="text"
          >Membres de la conversation :
        </label>
        <Multiselect
          id="membersList"
          v-model="selectedUsers"
          label="name"
          mode="tags"
          placeholder="Sélectionner un ou plusieurs interlocuteurs"
          value-prop="id"
          :close-on-select="false"
          :clear-on-select="false"
          :multiple="true"
          :object="true"
          :options="usersStore.users"
          :searchable="false"
          @focusout="triggerMemberListFieldAudit"
        />
        <ErrorMessage name="conversationMembers" class="alerte" />
      </Field>
    </div>
    <!-- bouton de création de la conversation renseignée / modification selon la situation -->
    <div class="w100">
      <input
        v-if="!props.existingConversation"
        class="bouton__principal w100"
        type="submit"
        value="Créer la conversation"
      />
      <input
        v-if="props.existingConversation"
        class="bouton__principal w100"
        type="submit"
        value="Modifier la conversation"
      />
    </div>
  </Form>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, onMounted } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useConversationsStore } from "@/store/conversationsStore";
import { useUsersStore } from "@/store/usersStore";
import EventService from "@/services/EventService.js";
import Multiselect from "@vueform/multiselect";

//props
// si modification alors cette propriété est égale à l'id de la conversation
const props = defineProps({
  existingConversation: {
    type: Number,
    required: true,
  },
});

//events
const emit = defineEmits(["close"]);

//variables
const conversationsStore = useConversationsStore();
const usersStore = useUsersStore();

//refs
const conversationName = ref("");
const selectedOwner = ref([]);
const isClosed = ref(false);
const isPublic = ref(false);
const selectedUsers = ref([]);
const memberListFieldRef = ref();
const ownerFieldRef = ref();

//computed
// nombre calculé automatiquement renseignant le nombre de caractères restant pour le nom de la conversation
const charactersLeftInConversationName = computed(() => {
  return 80 - conversationName.value.length;
});
// tableau des Id des utilisateurs membres de la conversation si modification, tableau vide si création
const members = computed(() => {
  if (selectedUsers.value) {
    return Array.from(selectedUsers.value, (x) => x.id);
  } else {
    return [];
  }
});
// tableau à un seul élément contenant l'Id du gestionnaire de la conversation si modification, tableau vide si création
const owner = computed(() => {
  if (selectedOwner.value) {
    return Array.from(selectedOwner.value, (x) => x.id);
  } else {
    return [];
  }
});

//methods
// fonction de vérification que le champs n'est pas vide
function isNotEmpty() {
  if (!conversationName.value) {
    return "Vous devez saisir le nom de votre conversation !";
  } else {
    return true;
  }
}
// fonction de vérification de l'existence d'utilisateurs participant à la conversation si la conversation est privée
function hasMembers() {
  if (isPublic.value || (!isPublic.value && members.value.length)) {
    return true;
  } else {
    return "Vous devez saisir au moins un participant à cette conversation !";
  }
}
// fonction de vérification de l'existence d'un gestionnaire de la conversation
function hasOwner() {
  if (owner.value.length == 1) {
    return true;
  } else {
    return "Vous devez saisir un gestionnaire pour cette conversation !";
  }
}
// fonction permettant de déclencher la vérification de la liste des membres depuis une autre fonction
function triggerMemberListFieldAudit() {
  memberListFieldRef.value.validate();
}
// fonction permettant de déclencher la vérification du champ gestionnaire depuis une autre fonction
function triggerOwnerFieldAudit() {
  ownerFieldRef.value.validate();
}
// fonction permettant de sauvegarder la conversation : création si nouvelle conversation / sauvegarde des modifications si existante
async function saveConversation() {
  let newMembers = isPublic.value ? [] : members.value;
  if (!newMembers.includes(owner.value[0])) {
    newMembers.concat(owner.value);
  }
  const oldMembers = props.existingConversation
    ? Array.from(conversationsStore.activeConversation.members, (x) => x.id)
    : [];
  let payload = {
    id: props.existingConversation
      ? conversationsStore.activeConversation.id
      : 0,
    name: conversationName.value,
    conversationOwnerId: props.existingConversation ? owner.value[0] : 0,
    isClosed: isClosed.value,
    isPublic: isPublic.value,
    members: {
      toAdd: newMembers.filter((id) => !oldMembers.includes(id)),
      toDelete: oldMembers.filter((id) => !newMembers.includes(id)),
    },
  };
  const upsertResponse = await EventService.upsertConversation(payload);
  let details = await EventService.getConversationDetail(
    upsertResponse.data.body.id
  );
  conversationsStore.upsertConversationsStore(details.data.body);
  if (!props.existingConversation) {
    conversationName.value = "";
    isPublic.value = false;
    selectedUsers.value = null;
  }
  emit("close");
}
// lifecycle hook
// au montage de ce composant, s'il s'agit d'une modification,
// les informations sont récupérées depuis le state activeConversation du conversationsStore (Pinia)
onMounted(async () => {
  if (props.existingConversation) {
    selectedOwner.value = [conversationsStore.activeConversation.owner];
    selectedUsers.value = conversationsStore.activeConversation.members;
    conversationName.value = conversationsStore.activeConversation.name;
    isPublic.value = conversationsStore.activeConversation.isPublic;
    isClosed.value = conversationsStore.activeConversation.isClosed;
  }
});
</script>

<style scoped></style>
