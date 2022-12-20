<template>
  <div class="main1 container">
    <SingleConversationTile
      v-for="conversation in conversationsStore.conversations"
      :key="conversation.id"
      :conversation="conversation"
    >
    </SingleConversationTile>
    <ModalComponent :global="true" :toClose="toClose">
      <template #callButton>
        <p>Nouvelle conversation</p>
      </template>
      <ConversationInputField
        :existingConversation="0"
        @close="closeAllModals"
      />
    </ModalComponent>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useConversationsStore } from "@/store/conversationsStore";
import { useMessagesStore } from "@/store/messagesStore";
import EventService from "@/services/EventService.js";
import SingleConversationTile from "@/components/conversation/SingleConversationTile.vue";
import ConversationInputField from "@/components/conversation/ConversationInputField.vue";
import ModalComponent from "@/components/modal/ModalComponent.vue";

//stores
const conversationsStore = useConversationsStore();
const messagesStore = useMessagesStore();

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

async function closeAllModals() {
  toClose.value = true;
  await nextTick();
  toClose.value = false;
}
</script>
