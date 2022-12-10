<template>
  <div class="main1 container">
    <SingleMessageTile
      v-for="message in messagesStore.messages"
      :key="message.id"
      :messageData="message"
    />
    <!-- <MessageInputField :messageData="{ content: '', isGlobal: false }" /> -->
    <MessageInputField
      :messageData="{}"
      v-if="!conversationsStore.activeConversation.isClosed"
    />
  </div>
</template>

<script setup>
import MessageInputField from "@/components/message/MessageInputField.vue";
import SingleMessageTile from "@/components/message/SingleMessageTile.vue";
import { useMessagesStore } from "@/store/messagesStore";
import { useConversationsStore } from "@/store/conversationsStore";

const messagesStore = useMessagesStore();
const conversationsStore = useConversationsStore();
</script>

<style scoped></style>
