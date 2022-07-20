<template>
  <div class="main1 container">
    <ConversationsList @detailsExpended="showConversationDetails" />
    <MessagesList :conversationId="conversationId" />
    <MessageEntry />
  </div>
</template>

<script>
import ConversationsList from "@/components/ConversationsList.vue";
import MessageEntry from "@/components/MessageEntry.vue";
import MessagesList from "@/components/MessagesList.vue";

export default {
  name: "ConversationVue",
  components: {
    ConversationsList,
    MessageEntry,
    MessagesList,
  },
  data() {
    return {
      conversationId: "",
    };
  },
  methods: {
    showConversationDetails(id) {
      console.log("id by event", id);
      // aller chercher les données de la conversation
      // les enregister dans une propriété définie dans data
      //créer le composant affichant le détail de la conversation
      // passer à ce new component les data reçues (détails de la conversation)
    },
  },
};
</script>
