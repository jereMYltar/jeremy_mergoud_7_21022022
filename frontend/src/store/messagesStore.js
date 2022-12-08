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
    const index = messages.value.findIndex((elt) => elt.id == message.id);
    messages.value.splice(index, 1);
  }
  function updateMessage(payload) {
    const index = messages.value.findIndex(
      (message) => message.id == payload.id
    );
    delete payload.id;
    for (const key in payload) {
      messages.value[index][key] = payload[key];
    }
  }
  return { messages, activeMessage, addMessages, deleteMessage, updateMessage };
});
