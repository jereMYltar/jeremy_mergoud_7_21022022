// Pinia : définition du store des messages
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMessagesStore = defineStore("messages", () => {
  //state
  let messages = ref([]);
  const activeMessage = ref(null);
  //getters
  //actions
  // fonction stockant des données(un tableau de messages) dans le state messages
  function addMessages(payload) {
    messages.value = payload;
  }
  // fonction supprimant des données(un message)
  // dans le state messages en fonctiond e l'id de celui-ci
  function deleteMessage(messageId) {
    const index = messages.value.findIndex((elt) => elt.id == messageId);
    messages.value.splice(index, 1);
  }
  // fonction permettant la mise à jour des données(un message) dans le state messages
  function updateMessage(payload) {
    const index = messages.value.findIndex(
      (message) => message.id == payload.id
    );
    delete payload.id;
    for (const key in payload) {
      messages.value[index][key] = payload[key];
    }
  }
  // renvoi des éléments (states, getters et actions disponibles à l'extérieur du module)
  return { messages, activeMessage, addMessages, deleteMessage, updateMessage };
});
