<template>
  <h1 v-if="!props.existingConversation">Créer une nouvelle conversation</h1>
  <h1 v-if="props.existingConversation">Modifier la conversation</h1>
  <Form @submit="saveConversation" class="container" name="connectionForm">
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
    <div v-if="props.existingConversation">
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
          :options="selectedUsers"
          :searchable="false"
        />
        <ErrorMessage name="ownerField" class="errorMessage" />
      </Field>
    </div>
    <div v-if="usersStore.activeUser.isAdmin">
      <label for="isPublic">Conversation publique :</label>
      <input type="checkbox" id="isPublic" v-model="isPublic" />
    </div>
    <div
      v-if="
        props.existingConversation &&
        conversationsStore.activeConversation.hasRightsOn
      "
    >
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
</template>

<script setup>
import { ref, defineProps, defineEmits, computed, onMounted } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useConversationsStore } from "@/store/conversationsStore";
import { useUsersStore } from "@/store/usersStore";
import EventService from "@/services/EventService.js";
import Multiselect from "@vueform/multiselect";

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
const conversationName = ref("");
const selectedOwner = ref([]);
const isClosed = ref(false);
const isPublic = ref(false);
const selectedUsers = ref(null);
const memberListFieldRef = ref();
const ownerFieldRef = ref();

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

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped></style>
