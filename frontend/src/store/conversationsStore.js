import { defineStore } from "pinia";
import { ref } from "vue";
import moment from "moment";

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
      activeConversation.value[key] = payload[key];
    }
    sortConversationArray(conversations.value);
  }
  function upsertConversationsStore(payload) {
    const index = conversations.value.findIndex(
      (conversation) => conversation.id == payload.id
    );
    const initialPayload = payload;
    delete payload.createdAt;
    delete payload.owner;
    delete payload.members;
    if (index == -1) {
      this.conversations.unshift(payload);
      this.activeConversation = initialPayload;
    } else {
      for (const key in payload) {
        conversations.value[index][key] = payload[key];
        activeConversation.value[key] = payload[key];
      }
    }
    sortConversationArray(conversations.value);
  }
  function updateActiveConversation(payload) {
    delete payload.id;
    for (const key in payload) {
      activeConversation.value[key] = payload[key];
    }
  }
  function sortConversationArray(array) {
    array.sort((a, b) => {
      if (moment(a.updatedAt).isBefore(moment(b.updatedAt))) {
        return 1;
      } else if (moment(a.updatedAt).isAfter(moment(b.updatedAt))) {
        return -1;
      } else {
        return 0;
      }
    });
  }
  return {
    conversations,
    activeConversation,
    addConversations,
    deleteConversation,
    updateConversation,
    addActiveConversation,
    updateActiveConversation,
    removeActiveConversation,
    upsertConversationsStore,
  };
});
