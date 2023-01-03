<template>
  <div class="main container__col w20">
    <button
      id="conversations-title"
      class="titre__tertiaire w100"
      @click="toggleConversationsDisplay"
    >
      <h2
        aria-label="Cliquer pour afficher ou masquer la liste des conversations."
      >
        Liste des conversations
      </h2>
    </button>
    <div id="conversations-list" class="w100">
      <div class="container__col scrollbox scrollbox__big w100">
        <SingleConversationTile
          v-for="conversation in conversationsStore.conversations"
          :key="conversation.id"
          :conversation="conversation"
        >
        </SingleConversationTile>
      </div>
      <ModalComponent :global="true" :to-close="toClose">
        <template #callButton>
          <p>Nouvelle conversation</p>
        </template>
        <ConversationInputField
          :existing-conversation="0"
          @close="closeAllModals"
        />
      </ModalComponent>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useConversationsStore } from "@/store/conversationsStore";
import { useMessagesStore } from "@/store/messagesStore";
import { useUsersStore } from "@/store/usersStore";
import EventService from "@/services/EventService.js";
import SingleConversationTile from "@/components/conversation/SingleConversationTile.vue";
import ConversationInputField from "@/components/conversation/ConversationInputField.vue";
import ModalComponent from "@/components/modal/ModalComponent.vue";

//stores
const conversationsStore = useConversationsStore();
const messagesStore = useMessagesStore();
const usersStore = useUsersStore();

//refs
const toClose = ref(false);

//methodes
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
usersStore.$subscribe(async () => {
  if (usersStore.activeUser) {
    let conversations = await EventService.getAllConversationsForCurrentUser();
    conversationsStore.addConversations(conversations.data);
  }
});

async function closeAllModals() {
  toClose.value = true;
  await nextTick();
  toClose.value = false;
}

async function toggleConversationsDisplay() {
  let list = document.getElementById("conversations-list");
  const title = document
    .getElementById("conversations-title")
    .getElementsByTagName("h2");
  console.log(title[0]);
  if (window.getComputedStyle(list).display != "none") {
    list.style.display = "none";
    title[0].innerText = "Liste des conversations (masquée)";
  } else {
    list.style.display = "block";
    title[0].innerText = "Liste des conversations";
  }
}
</script>
