<template>
  <div class="main1 container">
    <SingleMessageTile
      v-for="message in messages"
      :key="message.id"
      :messageData="message"
    />
    <MessageInputField
      v-if="conversationId > 0"
      :conversationId="this.conversationId"
      @messageSend="addMessage"
    />
  </div>
</template>

<script>
import EventService from "@/services/EventService.js";
import MessageInputField from "@/components/message/MessageInputField.vue";
import SingleMessageTile from "@/components/message/SingleMessageTile.vue";
export default {
  name: "MessagesList",
  components: {
    MessageInputField,
    SingleMessageTile,
  },
  props: {
    conversationId: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  data() {
    return {
      messages: [],
    };
  },
  methods: {
    loadMessagesByConversationId(id) {
      EventService.getAllMessagesByConversationId(id)
        .then((response) => {
          this.messages = response.data;
        })
        .catch();
    },
    addMessage(newMessage) {
      this.messages.unshift(newMessage);
    },
  },
  watch: {
    conversationId(newValue) {
      if (newValue) {
        this.loadMessagesByConversationId(newValue);
      }
    },
  },
};
</script>

<style scoped></style>
