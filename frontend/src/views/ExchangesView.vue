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
import ConversationsList from "@/components/ConversationsList.vue";
import MessagesList from "@/components/MessagesList.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const conversation = ref({
  id: 0,
});
let isAdmin = sessionStorage.getItem("isAdmin") == "true";
const router = useRouter();

function showConversationDetails(newConversation) {
  conversation.value = newConversation;
}
function logOut() {
  sessionStorage.clear();
  router.push({
    name: "Login",
  });
}

onMounted(() => {
  alert(`Vous êtes admin ? => ${isAdmin}`);
});
</script>
