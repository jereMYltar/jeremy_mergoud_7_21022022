import { defineStore } from "pinia";
import { ref } from "vue";

export const useConversationsStore = defineStore("conversations", () => {
  //state
  let conversations = ref([]);
  let activeConversation = ref(null);
  //getters
  //actions
  function addConversations(conversations) {
    this.conversations = conversations;
  }
  function addActiveConversation(conversation) {
    this.activeConversation = conversation;
  }
  function removeActiveConversation() {
    this.activeConversation = null;
  }
  function deleteConversation(conversationId) {
    const index = conversations.value.findIndex(
      (elt) => elt.id == conversationId
    );
    conversations.value.splice(index, 1);
  }
  function updateConversation(payload) {
    const index = conversations.value.findIndex(
      (conversation) => conversation.id == payload.id
    );
    delete payload.id;
    for (const key in payload) {
      conversations.value[index][key] = payload[key];
    }
  }
  return {
    conversations,
    activeConversation,
    addConversations,
    addActiveConversation,
    deleteConversation,
    updateConversation,
    removeActiveConversation,
  };
});
