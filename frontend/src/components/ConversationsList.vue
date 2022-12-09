<template>
  <div class="main1 container">
    <button
      v-for="conversation in conversationsStore.conversations"
      :key="conversation.id"
      :conversation="conversation"
      @click="showDetails(conversation)"
    >
      <h4>{{ conversation.name }}</h4>
      <button v-if="conversation.hasRightsOn" @click.stop="warn">...</button>
    </button>
    <Modal :global="true" ref="modalRef1">
      <template #callButton>
        <p>Nouvelle conversation</p>
      </template>
      <h1>Créer une nouvelle conversation</h1>
      <p>Sélectionner les participants à cette conversation :</p>
      <p>Ici mon outil de choix de personnes</p>
      <form>
        <div>
          <p>
            <label for="conversationName">Nom de la conversation : </label>
            <input type="text" id="conversationName" />
          </p>
          <p v-if="usersStore.activeUser.isAdmin">
            <label for="isPublic">Conversation publique :</label>
            <input type="checkbox" id="isPublic" v-model="isPublic" />
          </p>
          <multiselect
            v-model="selectedUsers"
            :options="usersStore.users"
            mode="tags"
            :close-on-select="false"
            :searchable="true"
            placeholder="Sélectionner un ou plusieurs interlocuteurs"
            label="name"
            valueProp="id"
            :object="true"
            v-if="!isPublic"
          ></multiselect>
        </div>
        <button @click.prevent="createConversation">
          Créer la conversation
        </button>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import EventService from "@/services/EventService.js";
import Modal from "@/components/modal/ModalComponent.vue";
import Multiselect from "@vueform/multiselect";
import { ref } from "vue";
import { useConversationsStore } from "@/store/conversationsStore";
import { useUsersStore } from "@/store/usersStore";
import { useMessagesStore } from "@/store/messagesStore";

const conversationsStore = useConversationsStore();
const usersStore = useUsersStore();
const messagesStore = useMessagesStore();

const isPublic = ref(false);
const selectedUsers = ref([]);
const modalRef1 = ref();

//methodes
function warn() {
  alert("ça fonctionne");
}

function showDetails(conversation) {
  conversationsStore.addActiveConversations(conversation);
}

async function createConversation() {
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

conversationsStore.$subscribe(async () => {
  if (conversationsStore.activeConversation) {
    try {
      let messageList = await EventService.getAllMessagesByConversationId(
        conversationsStore.activeConversation.id
      );
      messagesStore.addMessages(messageList.data);
    } catch (error) {
      console.error(error);
      return "Problème serveur";
    }
  }
});
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped></style>
