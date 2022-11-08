<template>
  <div class="main1 container">
    <ConversationsList @detailsExpended="showConversationDetails" />
    <MessagesList :conversationId="conversationId" />
    <button @click="logOut">Se déconnecter</button>
  </div>
</template>

<script>
import ConversationsList from "@/components/ConversationsList.vue";
import MessagesList from "@/components/MessagesList.vue";

export default {
  name: "ConversationVue",
  components: {
    ConversationsList,
    MessagesList,
  },
  data() {
    return {
      conversationId: 0,
    };
  },
  methods: {
    showConversationDetails(id) {
      this.conversationId = id;
    },
    logOut() {
      sessionStorage.clear();
      this.$router.push({
        name: "Login",
      });
    },
  },
};
</script>
