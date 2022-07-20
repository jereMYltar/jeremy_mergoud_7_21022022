<template>
  <div class="main1 container">
    <div v-for="message in messages" :key="message.id" :conversation="message">
      <div>{{ message.author }}</div>
      <div>{{ message.contenu }}</div>
      <div>{{ message.timestamp }}</div>
    </div>
  </div>
</template>

<script>
import EventService from "@/services/EventService.js";
// import ConversationCard from "./ConversationCard.vue";

export default {
  name: "MessagesList",
  data() {
    return {
      messages: "",
      id: this.$store.state.conversationId,
    };
  },
  updated() {
    EventService.getMessagesFromThisConversation(this.id)
      .then((response) => {
        this.messages = response.data;
      })
      .catch();
  },
};
</script>
