<template>
  <div class="main1 container">
    <SingleMessageTile
      v-for="message in messagesStore.messages"
      :key="message.id"
      :message="message"
    />
    <!-- <MessageInputField :messageData="{ content: '', isGlobal: false }" /> -->
    <MessageInputField
      v-if="!conversationsStore.activeConversation.isClosed"
      :message="{}"
    />
  </div>
</template>

<script setup>
import { useMessagesStore } from "@/store/messagesStore";
import { useConversationsStore } from "@/store/conversationsStore";
import MessageInputField from "@/components/message/MessageInputField.vue";
import SingleMessageTile from "@/components/message/SingleMessageTile.vue";

const messagesStore = useMessagesStore();
const conversationsStore = useConversationsStore();
</script>

<style scoped></style>
