<!-- titre de la conversations : nom + boutons d'actions spécifiques à la conversation -->
<template>
  <h2
    id="messages-title"
    class="container__row jc__sb titre__tertiaire w100"
    tabindex="0"
  >
    <!-- nom de la conversation -->
    Conversation active : {{ conversationsStore.activeConversation.name }}
    <!-- boutons d'actions sous forme de fenêtre modale personnalisée-->
    <div class="icone__box">
      <ModalComponent ref="modalRef1" :global="true" :to-close="toClose">
        <template #callButton>
          <div
            class="icone__parametres"
            role="img"
            alt="Propriétés de la conversation"
          ></div>
        </template>
        <!-- lien permettant de renvoyer l'utilisateur vers le bloc de saisie d'un message (accessibilité) -->
        <button class="bouton__secondaire w100" @click.stop="goToNewMessage()">
          Saisir un nouveau message
        </button>
        <!-- appel d'une fenêtre modale personnalisée pour modifier les éléments de la conversation -->
        <ModalComponent
          v-if="conversationsStore.activeConversation.hasRightsOn"
          :global="true"
          :to-close="toClose"
        >
          <!-- bouton d'appel de la fenêtre de modification -->
          <template #callButton>
            <p>Modifier la conversation</p>
          </template>
          <!-- appel du composant permettant de créer ou modifier une conversation, en mode modification de la conversation actuelle -->
          <ConversationInputField
            :existing-conversation="1"
            @close="closeAllModals"
          />
        </ModalComponent>
        <!-- bouton pour verrouiller ou déverrouiller la conversation selon son état actuel -->
        <button
          v-if="conversationsStore.activeConversation.hasRightsOn"
          class="bouton__secondaire w100"
          @click.stop="closeConversation(conversationsStore.activeConversation)"
        >
          <span v-if="conversationsStore.activeConversation.isClosed"
            >Déverrouiller la conversation</span
          >
          <span v-if="!conversationsStore.activeConversation.isClosed"
            >Verrouiller la conversation</span
          >
        </button>
        <!-- bouton pour supprimer la conversation -->
        <button
          v-if="
            usersStore.activeUser.isAdmin ||
            conversationsStore.activeConversation.conversationOwnerId ==
              usersStore.activeUser.id
          "
          class="bouton__secondaire w100"
          @click.stop="
            deleteConversation(conversationsStore.activeConversation.id)
          "
        >
          Supprimer la conversation
        </button>
        <!-- bouton pour changer de conversation : sort de la conversation actuelle et renvoie l'utilisateur sur la liste des conversations (accessibilité) -->
        <button
          class="bouton__secondaire w100"
          @click.stop="conversationChange()"
        >
          Changer de conversation
        </button>
      </ModalComponent>
    </div>
  </h2>
</template>

<script setup>
//imports
import { ref, nextTick } from "vue";
import { useUsersStore } from "@/store/usersStore";
import { useConversationsStore } from "@/store/conversationsStore";
import EventService from "@/services/EventService.js";
import ModalComponent from "@/components/modal/ModalComponent.vue";
import ConversationInputField from "@/components/conversation/ConversationInputField.vue";

//stores
const usersStore = useUsersStore();
const conversationsStore = useConversationsStore();

//refs
const toClose = ref(false);

//methods
// fonction permettant à l'utilisateur de sortir de la conversation actuelle et d'être renvoyé sur la liste des conversations (accessibilité)
async function conversationChange() {
  conversationsStore.removeActiveConversation();
  await nextTick();
  alert("Le focus va être déplacé vers la liste des conversations");
  document.getElementById("conversations-title").focus();
}
// fonction permettant à l'utilisateur d'être renvoyé vers le bloc de saisie d'un message (accessibilité)
async function goToNewMessage() {
  closeAllModals();
  await nextTick();
  alert(
    "Le focus va être déplacé vers le champs de saisie d'un nouveau message"
  );
  document.getElementById("messageContent").focus();
}
// fonction permettant de supprimer la conversation dont l'id est renseigné
async function deleteConversation(id) {
  if (
    window.confirm(`Vous vous apprêter à supprimer ce message.
    Cette action est irreversible, voulez-vous continuer ?`)
  ) {
    try {
      await EventService.deleteConversation(id);
      conversationsStore.removeActiveConversation();
      conversationsStore.deleteConversation(id);
    } catch (error) {
      return "Problème serveur";
    }
  } else {
    closeAllModals();
  }
}
// fonction permettant de verrouiller la conversation si elle ne l'est pas, ou de la déverrouiller si elle l'est
async function closeConversation(conversation) {
  let payload = {
    id: conversation.id,
    name: conversation.name,
    conversationOwnerId: conversation.conversationOwnerId,
    isClosed: !conversation.isClosed,
    isPublic: conversation.isPublic,
    members: {
      toAdd: [],
      toDelete: [],
    },
  };
  try {
    let newConversation = await EventService.upsertConversation(payload);
    newConversation = newConversation.data.body;
    conversationsStore.upsertConversationsStore(newConversation);
    closeAllModals();
  } catch (error) {
    return "Problème serveur";
  }
}
// fonction permettant de fermer d'un coup toutes les fenêtres modales
async function closeAllModals() {
  toClose.value = true;
  await nextTick();
  toClose.value = false;
}
</script>
