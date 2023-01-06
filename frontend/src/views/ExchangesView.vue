<!-- vue principale contenant les échanges : la liste des conversations et les messages de la conversation sélectionnée -->
<template>
  <div class="container__col f1">
    <!-- entête permettant de voir le nom de l'utilisateur connecté
    et donnant accès aux fonctions liées à cet utilisateur -->
    <div class="container__row jc__end w100">
      <!-- affichage du nom de l'utilisateur connecté -->
      <h2 class="text text--end">Vous êtes connectés en tant que :</h2>
      <div>
        <!-- appel à la structure custom de fenêtre modale -->
        <ModalComponent :global="true" :to-close="toClose">
          <!-- bouton d'appel personnalisé pour la première modale -->
          <template #callButton>
            <p>{{ usersStore.activeUser.name }}</p>
            <div class="icone__utilisateur"></div>
          </template>
          <!-- contenu de la première modale (une autre modale et un bouton)-->
          <ModalComponent :global="true" :to-close="toClose">
            <!-- bouton d'appel personnalisé pour la seconde modale -->
            <template #callButton>
              <p>Mon compte</p>
            </template>
            <!-- contenu de la seconde modale (le composant permettant de modifier / créer / supprimer l'utilisateur connecté)-->
            <UserComponent
              :user-id="usersStore.activeUser.id"
              @close="closeAllModals"
            />
          </ModalComponent>
          <!-- bouton permettant de se déconnecter -->
          <button class="bouton__secondaire w100" @click="logOut">
            Se déconnecter
          </button>
        </ModalComponent>
      </div>
    </div>
    <!-- contenu de la vue des échanges : la liste des conversations et celle des messages -->
    <div class="container__row ai__start w90 f1 ai__stretch">
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
// fonction de déconnexion : suppression du token d'authentification et redirection vers la page d'accueil
function logOut() {
  sessionStorage.clear();
  router.push({
    name: "HomePage",
  });
}
//fonction asynchrone permettant de fermer toutes les fenêtres modales en même temps
async function closeAllModals() {
  toClose.value = true;
  await nextTick();
  toClose.value = false;
}

//vue lifecycle hooks
//fonction se déclenchant au montage de l'application pour récupérer les données de l'utilisateur actif (données propres + conversations)
//et celles des autres utilisateurs (données propres restreintes)
// afin de les stocker dans pinia
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
