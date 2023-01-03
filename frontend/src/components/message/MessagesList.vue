<template>
  <div class="container__col w75">
    <ConversationHeader />
    <div class="container__col scrollbox w100 h260">
      <SingleMessageTile
        v-for="message in messagesStore.messages"
        :key="message.id"
        :message="message"
      />
    </div>
    <div class="h200 w100">
      <MessageInputField
        v-if="!conversationsStore.activeConversation.isClosed"
        :message="{}"
      />
    </div>
  </div>
</template>

<script setup>
//imports
import { useMessagesStore } from "@/store/messagesStore";
import { useConversationsStore } from "@/store/conversationsStore";
import ConversationHeader from "@/components/conversation/ConversationHeader.vue";
import MessageInputField from "@/components/message/MessageInputField.vue";
import SingleMessageTile from "@/components/message/SingleMessageTile.vue";

//stores
const messagesStore = useMessagesStore();
const conversationsStore = useConversationsStore();
</script>

<style scoped></style>
