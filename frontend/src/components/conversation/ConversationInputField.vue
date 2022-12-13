<template>
  <Modal :global="true" ref="modalRef1">
    <template #callButton>
      <p>Nouvelle conversation</p>
    </template>
    <h1>Créer une nouvelle conversation</h1>
    <p>Sélectionner les participants à cette conversation :</p>
    <p>Ici mon outil de choix de personnes</p>
    <Form @submit="createConversation" class="container" name="connectionForm">
      <div>
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
          Nombre de caractères restants : {{ charactersLeftInConversationName }}
        </div>
        <ErrorMessage name="conversationName" class="errorMessage" />
      </div>
      <div>
        <Field
          name="ownerField"
          ref="ownerFieldRef"
          :rules="hasOwner"
          :value="selectedOwner"
        >
          <label for="ownerList">Gestionnaire de la conversation : </label>
          <Multiselect
            id="ownerList"
            label="name"
            mode="tags"
            placeholder="Sélectionner un gestionnaire"
            valueProp="id"
            v-model="selectedOwner"
            @focusout="triggerOwnerFieldAudit"
            :close-on-select="true"
            :max="1"
            :object="true"
            :options="usersStore.users"
            :searchable="false"
          />
          <ErrorMessage name="ownerField" class="errorMessage" />
        </Field>
      </div>
      <div v-if="usersStore.activeUser.isAdmin">
        <label for="isPublic">Conversation publique :</label>
        <input type="checkbox" id="isPublic" v-model="isPublic" />
      </div>
      <div v-if="props.existingConversation && props.conversation.hasRightsOn">
        <label for="isClosed">Conversation close :</label>
        <input type="checkbox" id="isClosed" v-model="isClosed" />
      </div>
      <div v-if="!isPublic">
        <Field
          name="conversationMembers"
          ref="memberListFieldRef"
          :rules="hasMembers"
          :value="selectedUsers"
        >
          <label for="membersList">Membres de la conversation : </label>
          <Multiselect
            id="membersList"
            label="name"
            mode="tags"
            placeholder="Sélectionner un ou plusieurs interlocuteurs"
            valueProp="id"
            v-model="selectedUsers"
            @focusout="triggerMemberListFieldAudit"
            :close-on-select="false"
            :clear-on-select="false"
            :multiple="true"
            :object="true"
            :options="usersStore.users"
            :searchable="false"
          />
          <ErrorMessage name="conversationMembers" class="errorMessage" />
        </Field>
      </div>
      <div>
        <input
          class="basicButton"
          type="submit"
          value="Créer la conversation"
          v-if="!props.existingConversation"
        />
        <input
          class="basicButton"
          type="submit"
          value="Modifier la conversation"
          v-if="props.existingConversation"
        />
      </div>
    </Form>
  </Modal>
</template>

<script setup>
import EventService from "@/services/EventService.js";
import Modal from "@/components/modal/ModalComponent.vue";
import Multiselect from "@vueform/multiselect";
import { Form, Field, ErrorMessage } from "vee-validate";
import {
  ref,
  defineProps,
  defineEmits,
  computed,
  onMounted,
  onUpdated,
} from "vue";
import { useConversationsStore } from "@/store/conversationsStore";
import { useUsersStore } from "@/store/usersStore";

//props
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
const modalRef1 = ref();
const memberListFieldRef = ref();
const ownerFieldRef = ref();
const selectedOwner = ref(
  props.existingConversation
    ? [{
        id: usersStore.activeUser.id,
        name: usersStore.activeUser.name,
      }]
    : [conversationsStore.activeConversation.owner]
);
const selectedUsers = ref(
  props.existingConversation
    ? null
    : conversationsStore.activeConversation.members
);
const conversationName = ref(
  props.existingConversation ? "" : conversationsStore.activeConversation.name
);
const isPublic = ref(
  props.existingConversation
    ? false
    : conversationsStore.activeConversation.isPublic
);
const isClosed = ref(
  props.existingConversation
    ? false
    : conversationsStore.activeConversation.isClosed
);

//computed
const charactersLeftInConversationName = computed(() => {
  return 80 - conversationName.value.length;
});
const members = computed(() => {
  if (selectedUsers.value) {
    return Array.from(selectedUsers.value, (x) => x.id);
  } else {
    return [];
  }
});
const owner = computed(() => {
  if (selectedOwner.value) {
    return Array.from(selectedOwner.value, (x) => x.id);
  } else {
    return [];
  }
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
  if (isPublic.value || (!isPublic.value && members.value.length)) {
    return true;
  } else {
    return "Vous devez saisir au moins un participant à cette conversation !";
  }
}

function hasOwner() {
  if (owner.value.length == 1) {
    return true;
  } else {
    return "Vous devez saisir un gestionnaire pour cette conversation !";
  }
}

function triggerMemberListFieldAudit() {
  memberListFieldRef.value.validate();
}

function triggerOwnerFieldAudit() {
  ownerFieldRef.value.validate();
}

async function createConversation() {
  if (props.existingConversation) {
    emit("close");
  } else {
    const payload = {
      name: document.getElementById("conversationName").value,
      users: isPublic.value ? [] : members.value,
      isPublic: isPublic.value,
    };
    try {
      let newConversation = await EventService.createConversation(payload);
      conversationsStore.conversations.unshift(newConversation.data.body);
      conversationName.value = "";
      isPublic.value = false;
      selectedUsers.value = null;
      modalRef1.value.closeModal();
    } catch (error) {
      console.error(error);
      return "Problème serveur";
    }
  }
}

onMounted(async () => {
  console.log(props.existingConversation);
  try {
    if (props.existingConversation) {
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
