<template>
  <div class="main1 container">
    <ConversationsList
      @detailsExpended="showConversationDetails"
      :isAdmin="isAdmin"
    />
    <MessagesList :conversation="conversation" />
    <button @click="logOut">Se déconnecter</button>
  </div>
</template>

<script setup>
import EventService from "@/services/EventService.js";
import ConversationsList from "@/components/ConversationsList.vue";
import MessagesList from "@/components/MessagesList.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useConversationsStore } from "@/store/conversationsStore";
import { useUsersStore } from "@/store/usersStore";

const router = useRouter();
const conversationsStore = useConversationsStore();
const usersStore = useUsersStore();

const conversation = ref({
  id: 0,
});
let isAdmin = sessionStorage.getItem("isAdmin") == "true";

function showConversationDetails(newConversation) {
  conversation.value = newConversation;
}
function logOut() {
  sessionStorage.clear();
  router.push({
    name: "Login",
  });
}

onMounted(async () => {
  try {
    if (JSON.stringify(usersStore.activeUser) === "{}") {
      let response = await EventService.getAdminInfoForCurrentUser();
      usersStore.storeIsActiveUserAdmin(response.data);
    }
    let conversations = await EventService.getAllConversationsForCurrentUser();
    conversationsStore.addConversations(conversations.data);
  } catch (error) {
    console.error(error);
    return "Problème serveur";
  }
});
</script>
