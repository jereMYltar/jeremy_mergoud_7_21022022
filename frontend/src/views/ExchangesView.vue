<template>
  <div class="main1 container">
    <div>
      <h4>Vous êtes connectés en tant que :</h4>
      <ModalComponent :global="false">
        <template #callButton>
          <p>
            {{ usersStore.activeUser.name }}
            <img src="../assets/Images/user-solid.svg" height="20" width="20" />
          </p>
        </template>
        <ModalComponent :global="true">
          <template #callButton>
            <p>Mon compte</p>
          </template>
          <UserComponent :userId="usersStore.activeUser.id" />
        </ModalComponent>
        <button @click="logOut">Se déconnecter</button>
      </ModalComponent>
    </div>
    <ConversationsList />
    <MessagesList v-if="conversationsStore.activeConversation" />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useConversationsStore } from "@/store/conversationsStore";
import { useUsersStore } from "@/store/usersStore";
import EventService from "@/services/EventService.js";
import ConversationsList from "@/components/conversation/ConversationsList.vue";
import MessagesList from "@/components/message/MessagesList.vue";
import ModalComponent from "@/components/modal/ModalComponent.vue";
import UserComponent from "@/components/user/UserComponent.vue";

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
    if (!usersStore.activeUser.id) {
      let response = await EventService.getCurrentUser();
      usersStore.addActiveUser(response.data.activeUser);
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
