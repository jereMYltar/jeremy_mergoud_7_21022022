import { defineStore } from "pinia";

export const useMessagesStore = defineStore("messages", {
  state: () => ({
    messages: [],
    activeMessage: {},
  }),
  getters: {},
  actions: {
    addMessages(payload) {
      this.messages = payload;
    },
  },
});
