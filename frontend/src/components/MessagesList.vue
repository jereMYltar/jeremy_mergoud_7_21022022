<template>
  <div class="main1 container">
    <SingleMessageTile
      v-for="message in messages"
      :key="message.id"
      :messageData="message"
    />
    <MessageInputField v-if="id > 0" :id="this.id" @messageSend="addMessage" />
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
    id: {
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
    id(newValue) {
      if (newValue) {
        this.loadMessagesByConversationId(newValue);
      }
    },
  },
};
</script>

<style scoped></style>
