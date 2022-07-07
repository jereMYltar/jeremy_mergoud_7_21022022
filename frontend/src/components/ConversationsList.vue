<template>
  <div class="main1 container">
    <!-- <ConversationCard
      v-for="conversation in conversations"
      :key="conversation.id"
      :conversation="conversation"
      @click="showDetails(conversation.id)"
    /> -->
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
  // components: {
  //   ConversationCard,
  // },
  data() {
    return {
      conversations: "",
    };
  },
  methods: {
    showDetails(id) {
      this.$emit("detailsExpended", id);
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
