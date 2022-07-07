<template>
  <div class="main1 container">
    <ConversationsList @detailsExpended="showConversationDetails" />
    <MessageEntry />
  </div>
</template>

<script>
import ConversationsList from "@/components/ConversationsList.vue";
import MessageEntry from "@/components/MessageEntry.vue";

export default {
  name: "ConversationVue",
  components: {
    ConversationsList,
    MessageEntry,
  },
  data() {
    return {};
  },
  methods: {
    showConversationDetails(id) {
      console.log(id, "abc");
      // aller chercher les données de la conversation
      // les enregister dans une propriété définie dans data
      //créer le composant affichant le détail de la conversation
      // passer à ce new component les data reçues (détails de la conversation)
    },
  },
};
</script>
