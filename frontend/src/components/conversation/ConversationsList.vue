<template>
  <div class="main1 container">
    <SingleConversationTile
      v-for="conversation in conversationsStore.conversations"
      :key="conversation.id"
      :conversation="conversation"
    >
    </SingleConversationTile>
    <ConversationInputField />
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
  console.log("changement détecté dans conversationsStore");
  if (conversationsStore.activeConversation) {
    try {
      console.log("step 1");
      let messageList = await EventService.getAllMessagesByConversationId(
        conversationsStore.activeConversation.id
      );
      console.log("step 2 : ", messageList);
      messagesStore.addMessages(messageList.data);
      console.log("step 3");
    } catch (error) {
      console.error(error);
      return "Problème serveur";
    }
  }
});
</script>
