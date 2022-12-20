<template>
  <div class="main1 container">
    <div>
      <h4>Vous êtes connectés en tant que :</h4>
      <ModalComponent :global="false" :toClose="toClose">
        <template #callButton>
          <p>
            {{ usersStore.activeUser.name }}
            <img src="../assets/Images/user-solid.svg" height="20" width="20" />
          </p>
        </template>
        <ModalComponent :global="true" :toClose="toClose">
          <template #callButton>
            <p>Mon compte</p>
          </template>
          <UserComponent
            :userId="usersStore.activeUser.id"
            @close="closeAllModals"
          />
        </ModalComponent>
        <button @click="logOut">Se déconnecter</button>
      </ModalComponent>
    </div>
    <ConversationsList />
    <MessagesList v-if="conversationsStore.activeConversation" />
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
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

const toClose = ref(false);

function logOut() {
  sessionStorage.clear();
  router.push({
    name: "Login",
  });
}

async function closeAllModals() {
  toClose.value = true;
  await nextTick();
  toClose.value = false;
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
