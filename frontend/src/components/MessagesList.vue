<template>
  <div class="main1 container">
    <div v-for="message in messages" :key="message.id" class="message">
      <div>{{ message.author }}</div>
      <div v-if="message.createdAt != message.updatedAt">
        Message modifié le {{ dayFormat(message.updatedAt) }} à
        {{ hourFormat(message.updatedAt) }}
      </div>
      <div v-if="!message.isModerated">{{ message.content }}</div>
      <div v-if="message.isModerated">
        Le contenu de ce message a été modéré en raison d'un non-respect des
        règles de bonne conduite de notre entreprise.
      </div>
      <div>
        Message posté le {{ dayFormat(message.createdAt) }} à
        {{ hourFormat(message.createdAt) }}
      </div>
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
      console.log(this.messages);
      this.messages.unshift(message);
      console.log(this.messages);
    },
    dayFormat(a) {
      return moment(a).locale("fr").format("LL");
    },
    hourFormat(a) {
      return moment(a).locale("fr").format("LTS");
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

<style scoped>
.message {
  margin: 5px;
  padding: 3px;
  background-color: beige;
  border: 1px grey solid;
  border-radius: 3px;
  width: 70%;
}
</style>
