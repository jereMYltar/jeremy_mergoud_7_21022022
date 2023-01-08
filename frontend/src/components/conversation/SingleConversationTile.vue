<!-- composant permettant d'afficher certains éléments d'une conversation donnée en props -->
<template>
  <!-- bouton permettant de charger les détails de la conversation indiquée -->
  <button
    class="bouton__conversation container__row"
    @click="showDetails(props.conversation.id)"
  >
    <!-- nom de la conversation -->
    <div class="text">{{ props.conversation.name }}</div>
    <!-- liste d'icônes donnant des informations sur la conversation -->
    <div class="container__col container__col icone__box">
      <!-- icône indiquant si la conversation est fermée -->
      <div
        v-if="props.conversation.isClosed"
        aria-label="Conversation fermée"
        role="note"
      >
        <p class="icone__cadenas"></p>
      </div>
      <!-- icône indiquant si la conversation est publique -->
      <div
        v-if="props.conversation.isPublic"
        aria-label="Conversation publique"
        role="note"
      >
        <p class="icone__public"></p>
      </div>
      <!-- icône indiquant si l'utilisateur actif est gestionnaire de la conversation -->
      <div
        v-if="props.conversation.hasRightsOn"
        aria-label="Vous êtes gestionnaire de cette conversation"
        role="note"
      >
        <p class="icone__gestionnaire"></p>
      </div>
    </div>
  </button>
</template>

<script setup>
import { defineProps, nextTick } from "vue";
import { useConversationsStore } from "@/store/conversationsStore";
import EventService from "@/services/EventService.js";

//props
const props = defineProps({
  conversation: {
    type: Object,
    required: true,
  },
});

//stores
const conversationsStore = useConversationsStore();

//methods
// fonction permettant de charger les informations spécifiques de la conversation et de les stocker dans Pinia :
// - détail de la conversation dans le conversationsStore, state activeConversation
// puis l'utilisateur est averti que le focus change, et il est redirigé vers l'en-tête de la conversation
async function showDetails(id) {
  try {
    const conversationDetails = await EventService.getConversationDetail(id);
    conversationsStore.addActiveConversation(conversationDetails.data.body);
    await nextTick();
    alert("Le focus va être déplacé vers le titre de la conversation");
    document.getElementById("messages-title").focus();
  } catch (error) {
    return "Problème serveur";
  }
}
</script>
