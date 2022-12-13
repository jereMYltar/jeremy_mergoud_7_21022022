<template>
  <div class="main1 container">
    <SingleConversationTile
      v-for="conversation in conversationsStore.conversations"
      :key="conversation.id"
      :conversation="conversation"
    >
    </SingleConversationTile>
    <ConversationInputField :existingConversation="0" />
  </div>
</template>

<script setup>
import SingleConversationTile from "@/components/conversation/SingleConversationTile.vue";
import ConversationInputField from "@/components/conversation/ConversationInputField.vue";
import EventService from "@/services/EventService.js";
import { useConversationsStore } from "@/store/conversationsStore";
import { useMessagesStore } from "@/store/messagesStore";

const conversationsStore = useConversationsStore();
const messagesStore = useMessagesStore();

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
</script>
