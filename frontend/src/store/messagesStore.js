import { defineStore } from "pinia";
import { ref } from "vue";

export const useMessagesStore = defineStore("messages", () => {
  //state
  let messages = ref([]);
  const activeMessage = ref(null);
  //getters
  //actions
  function addMessages(payload) {
    messages.value = payload;
  }
  function deleteMessage(message) {
    const index = messages.value.indexOf(message);
    messages.value.splice(index, 1);
  }
  return { messages, activeMessage, addMessages, deleteMessage };
});
