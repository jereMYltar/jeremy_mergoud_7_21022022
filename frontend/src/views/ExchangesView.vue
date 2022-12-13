<template>
  <div class="main1 container">
    <ConversationsList />
    <MessagesList v-if="conversationsStore.activeConversation" />
    <button @click="logOut">Se déconnecter</button>
  </div>
</template>

<script setup>
import EventService from "@/services/EventService.js";
import ConversationsList from "@/components/conversation/ConversationsList.vue";
import MessagesList from "@/components/message/MessagesList.vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useConversationsStore } from "@/store/conversationsStore";
import { useUsersStore } from "@/store/usersStore";

const router = useRouter();
const conversationsStore = useConversationsStore();
const usersStore = useUsersStore();

function logOut() {
  sessionStorage.clear();
  router.push({
    name: "Login",
  });
}

onMounted(async () => {
  try {
    if (!usersStore.activeUser) {
      let response = await EventService.getCurrentUser();
      usersStore.storeActiveUser(response.data.activeUser);
    }
    let conversations = await EventService.getAllConversationsForCurrentUser();
    conversationsStore.addConversations(conversations.data);
    let users = await EventService.getAllOtherUsers();
    usersStore.addUsers(users.data);
  } catch (error) {
    console.error(error);
    return "Problème serveur";
  }
});
</script>
