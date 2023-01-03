<template>
  <div class="container__col jc__sb w75">
    <div class="container__col w100 f1">
      <ConversationHeader />
      <div class="container__col scrollbox hv__messages w100">
        <SingleMessageTile
          v-for="message in messagesStore.messages"
          :key="message.id"
          :message="message"
        />
      </div>
    </div>
    <div class="w100">
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
