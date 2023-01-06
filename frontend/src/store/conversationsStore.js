// Pinia : définition du store des conversations
import { defineStore } from "pinia";
import { ref } from "vue";
import moment from "moment";

export const useConversationsStore = defineStore("conversations", () => {
  //state
  let conversations = ref([]);
  let activeConversation = ref(null);
  //getters
  //actions
  // fonction stockant des données (un tableau de conversations) dans le state conversations
  function addConversations(conversations) {
    this.conversations = conversations;
  }
  // fonction stockant des données(une conversation) dans le state activeConversation
  function addActiveConversation(conversation) {
    this.activeConversation = conversation;
  }
  // fonction vidant le state activeConversation
  function removeActiveConversation() {
    this.activeConversation = null;
  }
  // fonction supprimant des données(une conversation)
  // dans le state conversations en fonctiond e l'id de celle-ci
  function deleteConversation(conversationId) {
    const index = conversations.value.findIndex(
      (elt) => elt.id == conversationId
    );
    conversations.value.splice(index, 1);
  }
  // fonction permettant la mise à jour des données(une conversation) dans le state conversations
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
  // fonction permettant la mise à jour du store dans son ensemble :
  // - ajout d'une conversation si celle-ci n'est pas présente dans le state conversation
  // - mise à jour de la conversation si elle existe dans le state conversation
  // - ajout de la conversation transmise dans le state activeConversation si celui-ci est vide
  // - mise à jour de la conversation si elle est présente dans le state activeConversation
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
  // fonction de mise à jour du state activeConversation
  function updateActiveConversation(payload) {
    delete payload.id;
    for (const key in payload) {
      activeConversation.value[key] = payload[key];
    }
  }
  // fonction permettant de trier un tableau d'objets (conversations)
  // en fonction de la clef "updatedAt" de ceux-ci (par ordre chronologique
  // du plus récent au plus vieux) afin de mettre en évidence les
  // dernières conversations modifiées
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
  // renvoi des éléments (states, getters et actions disponibles à l'extérieur du module)
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
