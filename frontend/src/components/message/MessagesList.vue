<template>
  <div class="container__col container__col--jc_start w75">
    <h3 class="titre__secondaire w100">
      {{ conversationsStore.activeConversation.name }}
    </h3>
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
</script>

<style scoped></style>
