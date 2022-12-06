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
import MessageInputField from "@/components/message/MessageInputField.vue";
import SingleMessageTile from "@/components/message/SingleMessageTile.vue";
import { useMessagesStore } from "@/store/messagesStore";

const messagesStore = useMessagesStore();
</script>

<style scoped></style>
