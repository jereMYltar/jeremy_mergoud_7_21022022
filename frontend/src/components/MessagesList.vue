<template>
  <div class="main1 container">
    <div v-for="message in messages" :key="message.id">
      <div>{{ message.auteur }}</div>
      <div>{{ message.contenu }}</div>
      <div>{{ format(message.timestamp) }}</div>
    </div>
    <MessageEntry v-if="id > 0" :id="this.id" @messageSend="addMessage" />
  </div>
</template>

<script>
import EventService from "@/services/EventService.js";
import MessageEntry from "@/components/MessageEntry.vue";
import moment from "moment";
export default {
  name: "MessagesList",
  components: {
    MessageEntry,
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
    loadMessage(id) {
      EventService.getMessagesFromThisConversation(id)
        .then((response) => {
          this.messages = response.data;
        })
        .catch();
    },
    addMessage(message) {
      this.messages.unshift(message);
    },
    format(a) {
      return moment(a).format("j, MMMM Do aaaa, h:mm:ss a");
    },
  },
  watch: {
    id(newValue) {
      if (newValue) {
        this.loadMessage(newValue);
      }
    },
  },
};
</script>
