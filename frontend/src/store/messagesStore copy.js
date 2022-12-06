import { defineStore } from "pinia";

export const useMessagesStore = defineStore("messages", {
  state: () => ({
    messages: [],
    activeMessage: {},
  }),
  getters: {},
  actions: {
    addMessages(payload) {
      console.log(typeof payload);
      console.log(payload);
      this.messages = payload;
      console.log(typeof this.messages);
      console.log(this.messages);
    },
    deleteMessage(id) {
      console.log("id du message : ", id);
      console.log(typeof this.messages);
      console.log(this.messages);
      const index = this.messages.findIndex((message) => {
        message.id = id;
      });
      console.log("index : ", index);
      // messagesStore.messages.splice(index, 1);
    },
  },
});
