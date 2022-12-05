import { defineStore } from "pinia";

export const useConversationsStore = defineStore("conversations", {
  state: () => ({
    conversations: [],
    activeConversation: null,
  }),
  getters: {},
  actions: {
    addConversations(conversations) {
      this.conversations = conversations;
    },
    addActiveConversations(conversation) {
      this.activeConversation = conversation;
    },
  },
});
