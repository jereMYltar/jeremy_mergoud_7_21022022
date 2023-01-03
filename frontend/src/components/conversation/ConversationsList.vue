<template>
  <div class="main container__col w20">
    <h2 id="conversations-title" class="titre__tertiaire w100" tabindex="0">
      Liste des conversations
    </h2>
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
</script>
