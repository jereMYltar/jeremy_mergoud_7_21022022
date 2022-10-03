<template>
  <div class="main1 container">
    <div
      v-for="message in messages"
      :key="message.id"
      :class="['message', message.isAuthor ? 'written' : 'read']"
    >
      <div>{{ message.author }}</div>
      <div v-if="message.createdAt != message.updatedAt">
        Message modifié le {{ timeFormat(message.updatedAt) }}
      </div>
      <div v-if="!message.isModerated">{{ message.content }}</div>
      <div v-if="message.isModerated">
        Le contenu de ce message a été modéré en raison d'un non-respect des
        règles de bonne conduite de notre entreprise.
      </div>
      <div>Message posté le {{ timeFormat(message.createdAt) }}</div>
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
    timeFormat(a) {
      return moment(a).locale("fr").format("LL à LTS");
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

<style scoped>
.message {
  margin: 5px;
  padding: 3px;
  border: 1px grey solid;
  border-radius: 3px;
  width: 70%;
}
.written {
  background-color: lightcyan;
  align-self: flex-end;
}
.read {
  background-color: lightgray;
  align-self: flex-start;
}
</style>
