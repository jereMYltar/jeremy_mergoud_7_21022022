<template>
  <button
    class="bouton__conversation container__row"
    @click="showDetails(props.conversation.id)"
  >
    <div class="text">{{ props.conversation.name }}</div>
    <div class="container__col container__col icone__box">
      <div
        v-if="props.conversation.isClosed"
        aria-label="Conversation fermée"
        role="note"
      >
        <p class="icone__cadenas"></p>
      </div>
      <div
        v-if="props.conversation.isPublic"
        aria-label="Conversation publique"
        role="note"
      >
        <p class="icone__public"></p>
      </div>
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
import { defineProps } from "vue";
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
async function showDetails(id) {
  try {
    const conversationDetails = await EventService.getConversationDetail(id);
    conversationsStore.addActiveConversation(conversationDetails.data.body);
  } catch (error) {
    return "Problème serveur";
  }
}
</script>
