<template>
  <Modal :global="true" ref="modalRef1">
    <template #callButton>
      <p>Nouvelle conversation</p>
    </template>
    <h1>Créer une nouvelle conversation</h1>
    <p>Sélectionner les participants à cette conversation :</p>
    <p>Ici mon outil de choix de personnes</p>
    <Form @submit="createConversation" class="container" name="connectionForm">
      <label for="conversationName">Nom de la conversation : </label>
      <Field
        v-model="conversationName"
        id="conversationName"
        name="conversationName"
        type="text"
        maxlength="80"
        placeholder="Le nom de votre conversation"
        class="textInput"
        :rules="isNotEmpty"
      />
      <div>
        Nombre de caractères restants : {{ caractersLeftInConversationName }}
      </div>
      <ErrorMessage name="conversationName" class="errorMessage" />
      <p v-if="usersStore.activeUser.isAdmin">
        <label for="isPublic">Conversation publique :</label>
        <input type="checkbox" id="isPublic" v-model="isPublic" />
      </p>
      <Field
        name="conversationMembers"
        ref="memberListField"
        :rules="hasMembers"
        :value="selectedUsers"
      >
        <Multiselect
          id="membersList"
          label="name"
          mode="tags"
          placeholder="Sélectionner un ou plusieurs interlocuteurs"
          valueProp="id"
          v-model="selectedUsers"
          @focusout="triggerFieldAudit"
          :close-on-select="false"
          :object="true"
          :options="usersStore.users"
          :searchable="true"
          v-if="!isPublic"
        />
        <ErrorMessage name="conversationMembers" class="errorMessage" />
      </Field>
      <input
        class="basicButton"
        type="submit"
        value="Créer la conversation"
        v-if="Object.keys(props.conversation).length == 0"
      />
      <input
        class="basicButton"
        type="submit"
        value="Modifier la conversation"
        v-if="Object.keys(props.conversation).length > 0"
      />
    </Form>
  </Modal>
</template>

<script setup>
import EventService from "@/services/EventService.js";
import Modal from "@/components/modal/ModalComponent.vue";
import Multiselect from "@vueform/multiselect";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, defineProps, computed, onMounted, onUpdated } from "vue";
import { useConversationsStore } from "@/store/conversationsStore";
import { useUsersStore } from "@/store/usersStore";

//props
const props = defineProps({
  conversation: {
    type: Object,
    required: true,
  },
});

//variables
const conversationsStore = useConversationsStore();
const usersStore = useUsersStore();

//refs
const selectedUsers = ref(null);
const modalRef1 = ref();
const memberListField = ref();
const isPublic = ref(
  Object.keys(props.conversation).length == 0
    ? false
    : !!props.conversation.isPublic
);
const conversationName = ref(
  Object.keys(props.conversation).length == 0 ? "" : props.conversation.name
);

//computed
const members = computed(() => {
  if (selectedUsers.value) {
    return Array.from(selectedUsers.value, (x) => x.id);
  } else {
    return [];
  }
});
const caractersLeftInConversationName = computed(() => {
  return 80 - conversationName.value.length;
});

//methods
function isNotEmpty() {
  console.log("vérification du nom effectuée");
  if (!conversationName.value) {
    return "Vous devez saisir le nom de votre conversation !";
  } else {
    return true;
  }
}

function hasMembers() {
  if (!isPublic.value && !members.value.length) {
    return "Vous devez saisir au moins un participant à cette conversation !";
  } else {
    return true;
  }
}

function triggerFieldAudit() {
  memberListField.value.validate();
}

async function createConversation() {
  if (!isPublic.value && selectedUsers.value.length == 0) {
    return window.alert(
      "Vous devez saisir au moins un participant à cette conversation !"
    );
  }
  const payload = {
    name: document.getElementById("conversationName").value,
    users: Array.from(selectedUsers.value, (x) => x.id),
    isPublic: isPublic.value,
  };
  try {
    let newConversation = await EventService.createConversation(payload);
    conversationsStore.conversations.unshift(newConversation.data.body);
    selectedUsers.value = [];
    document.getElementById("conversationName").value = "";
    isPublic.value = false;
    modalRef1.value.closeModal();
  } catch (error) {
    console.error(error);
    return "Problème serveur";
  }
}

onMounted(async () => {
  try {
    if (!Object.keys(props.conversation).length == 0) {
      selectedUsers.value = await EventService.getConversationMembers(
        props.conversation.id
      );
    }
  } catch (error) {
    console.error(error);
    return "Problème serveur";
  }
});
onUpdated(() => {
  console.log("module 'nouvelle conversation' mis à jour");
});
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped></style>
