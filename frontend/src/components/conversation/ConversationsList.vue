<!-- cmoposant donnant la liste des conversations accessibles par l'utilisateur -->
<template>
  <div class="container__col w28">
    <!-- bouton permettant d'afficher ou de masquer la liste des conversations -->
    <button
      id="conversations-title"
      class="bouton__secondaire bouton__secondaire--rev w100"
      aria-label="Cliquer pour afficher ou masquer la liste des conversations (liste affichée)."
      @click="toggleConversationsDisplay"
    >
      <h2>Liste des conversations</h2>
    </button>
    <!-- appel d'un exemplaire du composant SingleConversationTile par conversation à laquelle l'utilisateur actif a accès -->
    <div id="conversations-list" class="container__col w100 f1">
      <div class="container__col scrollbox w100 hv__conversations">
        <SingleConversationTile
          v-for="conversation in conversationsStore.conversations"
          :key="conversation.id"
          :conversation="conversation"
        >
        </SingleConversationTile>
      </div>
      <ModalComponent :global="true" :to-close="toClose">
        <template #callButton>
          <p>Nouvelle conversation</p>
        </template>
        <ConversationInputField
          :existing-conversation="0"
          @close="closeAllModals"
        />
      </ModalComponent>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useConversationsStore } from "@/store/conversationsStore";
import { useMessagesStore } from "@/store/messagesStore";
import { useUsersStore } from "@/store/usersStore";
import EventService from "@/services/EventService.js";
import SingleConversationTile from "@/components/conversation/SingleConversationTile.vue";
import ConversationInputField from "@/components/conversation/ConversationInputField.vue";
import ModalComponent from "@/components/modal/ModalComponent.vue";

//stores
const conversationsStore = useConversationsStore();
const messagesStore = useMessagesStore();
const usersStore = useUsersStore();

//refs
const toClose = ref(false);

//methodes
// souscription aux changements du conversationsStore (Pinia) :
// - si le state activeConversation change, alors la liste des messages de la conversation est mise à jour
conversationsStore.$subscribe(async () => {
  if (conversationsStore.activeConversation) {
    try {
      let messageList = await EventService.getAllMessagesByConversationId(
        conversationsStore.activeConversation.id
      );
      messagesStore.addMessages(messageList.data);
    } catch (error) {
      console.error(error);
      return "Problème serveur";
    }
  }
});
// souscription aux changements du usersStore (Pinia) :
// - si le state activeUser change, alors la liste des conversations disponible est mise à jour
usersStore.$subscribe(async () => {
  if (usersStore.activeUser) {
    let conversations = await EventService.getAllConversationsForCurrentUser();
    conversationsStore.addConversations(conversations.data);
  }
});
// fonction permettant de fermer d'un coup toutes les fenêtres modales
async function closeAllModals() {
  toClose.value = true;
  await nextTick();
  toClose.value = false;
}
// fonction permettant permettant d'afficher ou de masquer la liste des conversations,
// en mettant à jour le titre du bouton d'appel de la fonction
// et l'attribut aria-label pour une meilleure accessibilité
async function toggleConversationsDisplay() {
  let list = document.getElementById("conversations-list");
  const button = document.getElementById("conversations-title");
  const title = button.getElementsByTagName("h2");
  if (window.getComputedStyle(list).display != "none") {
    list.style.display = "none";
    title[0].innerText = "Liste des conversations (masquée)";
    button.setAttribute(
      "aria-label",
      "Cliquer pour afficher ou masquer la liste des conversations (liste masquée)."
    );
  } else {
    list.style.display = "block";
    title[0].innerText = "Liste des conversations";
    button.setAttribute(
      "aria-label",
      "Cliquer pour afficher ou masquer la liste des conversations (liste affichée)."
    );
  }
}
</script>
