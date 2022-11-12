<template>
  <div class="main1 container">
    <ConversationsList @detailsExpended="showConversationDetails" />
    <MessagesList :conversation="conversation" />
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
      conversation: {
        id: 0,
      },
    };
  },
  methods: {
    showConversationDetails(conversation) {
      this.conversation = conversation;
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
