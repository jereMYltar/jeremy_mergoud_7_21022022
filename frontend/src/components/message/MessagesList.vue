<template>
  <div class="container__col w75">
    <h2 id="messages-title" class="titre__tertiaire w100" tabindex="0">
      Conversation active : {{ conversationsStore.activeConversation.name }}
    </h2>
    <button class="bouton__tertiaire w100" @click.prevent="conversationChange">
      Changer de conversation
    </button>
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
import { useMessagesStore } from "@/store/messagesStore";
import { useConversationsStore } from "@/store/conversationsStore";
import MessageInputField from "@/components/message/MessageInputField.vue";
import SingleMessageTile from "@/components/message/SingleMessageTile.vue";

const messagesStore = useMessagesStore();
const conversationsStore = useConversationsStore();

function conversationChange() {
  conversationsStore.removeActiveConversation();
}
</script>

<style scoped></style>
