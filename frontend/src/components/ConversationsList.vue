<template>
  <div class="main1 container">
    <button
      v-for="conversation in conversations"
      :key="conversation.id"
      :conversation="conversation"
      @click="showDetails(conversation.id)"
    >
      <h4>{{ conversation.name }}</h4>
    </button>
  </div>
</template>

<script>
import EventService from "@/services/EventService.js";
// import ConversationCard from "./ConversationCard.vue";

export default {
  name: "ConversationList",
  emits: ["detailsExpended"],
  data() {
    return {
      conversations: "",
    };
  },
  methods: {
    showDetails(id) {
      this.$emit("detailsExpended", id);
      this.$store.dispatch("setConversationId", id);
      console.log("store content : ", this.$store.state.conversationId);
    },
  },
  created() {
    EventService.getConversations()
      .then((response) => {
        this.conversations = response.data;
      })
      .catch();
  },
};
</script>
