<template>
  <div class="main1 container">
    <SingleMessageTile
      v-for="message in messagesStore.messages"
      :key="message.id"
      :messageData="message"
    />
    <MessageInputField />
  </div>
</template>

<script setup>
import EventService from "@/services/EventService.js";
import MessageInputField from "@/components/message/MessageInputField.vue";
import SingleMessageTile from "@/components/message/SingleMessageTile.vue";
import { useConversationsStore } from "@/store/conversationsStore";
import { useMessagesStore } from "@/store/messagesStore";

const conversationsStore = useConversationsStore();
const messagesStore = useMessagesStore();

conversationsStore.$subscribe(async () => {
  try {
    let messageList = await EventService.getAllMessagesByConversationId(
      conversationsStore.activeConversation.id
    );
    messagesStore.addMessages(messageList.data);
  } catch (error) {
    console.error(error);
    return "Problème serveur";
  }
});
</script>

<style scoped></style>
