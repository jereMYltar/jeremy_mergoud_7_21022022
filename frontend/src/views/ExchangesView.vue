<template>
  <div class="container__col">
    <div class="container__row container__row--end w90">
      <h2 class="text text--end w80">
        Vous êtes connectés en tant que : {{ usersStore.activeUser.name }}
      </h2>
      <div class="w20">
        <ModalComponent :global="false" :to-close="toClose">
          <template #callButton>
            <p>Mon compte</p>
            <div class="icone__utilisateur"></div>
          </template>
          <ModalComponent :global="true" :to-close="toClose">
            <template #callButton>
              <p>Mon compte</p>
            </template>
            <UserComponent
              :user-id="usersStore.activeUser.id"
              @close="closeAllModals"
            />
          </ModalComponent>
          <button class="bouton__secondaire" @click="logOut">
            Se déconnecter
          </button>
        </ModalComponent>
      </div>
    </div>
    <div class="container__row w90">
      <ConversationsList />
      <MessagesList v-if="conversationsStore.activeConversation" />
    </div>
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

//stores
const conversationsStore = useConversationsStore();
const usersStore = useUsersStore();

//variables
const router = useRouter();

//refs
const toClose = ref(false);

//methods
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

//vue lifecycle hooks
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

conversationsStore.$subscribe(async () => {
  await nextTick();
  if (conversationsStore.activeConversation) {
    document.getElementById("messages-title").focus();
  } else {
    document.getElementById("conversations-title").focus();
  }
});
</script>
