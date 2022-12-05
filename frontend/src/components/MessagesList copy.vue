<template>
  <div class="main1 container">
    <SingleMessageTile
      v-for="message in messages"
      :key="message.id"
      :messageData="message"
    />
    <MessageInputField
      v-if="this.conversation.id > 0"
      :conversation="this.conversation"
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
    conversation: {
      type: Object,
      default: () => ({
        id: 0,
      }),
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
    conversation(newConversation) {
      if (newConversation != {}) {
        this.loadMessagesByConversationId(newConversation.id);
      }
    },
  },
};
</script>

<style scoped></style>
