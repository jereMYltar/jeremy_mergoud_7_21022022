<!-- composant permettant d'afficher le détail d'un message et les fonctionnalités qui lui sont liées -->
<template>
  <div
    :class="[
      'message',
      'container__row',
      props.message.isAuthor ? 'message__written' : 'message__read',
      props.message.isGlobal ? 'message__global' : '',
    ]"
  >
    <!-- détail du message -->
    <div>
      <!-- auteur du message -->
      <div v-if="!props.message.isAuthor" class="text__details">
        {{ props.message.author }}
      </div>
      <div v-if="props.message.isAuthor" class="text__details">Moi</div>
      <!-- contenu du message s'il n'est pas modéré -->
      <div v-if="!props.message.isModerated" class="text">
        {{ props.message.content }}
      </div>
      <!-- contenu du message standardisé s'il a été modéré -->
      <div v-if="props.message.isModerated" class="text">
        Le contenu de ce message a été modéré en raison d'un non-respect des
        règles de bonne conduite de notre entreprise.
      </div>
      <!-- timestamp de post initial -->
      <div class="text__details">
        Posté le {{ timeFormat(props.message.createdAt) }}
      </div>
      <!-- timestamp de dernière modification, si modification il y a eu -->
      <div
        v-if="props.message.createdAt != props.message.updatedAt"
        class="text__details"
      >
        Modifié le {{ timeFormat(props.message.updatedAt) }}
      </div>
    </div>
    <!-- fonctionnalités liées via l'appel d'un fenêtre modale personnalisée -->
    <div class="icone__box">
      <ModalComponent
        v-if="
          props.message.hasRightsOn ||
          conversationsStore.activeConversation.hasRightsOn
        "
        :global="true"
        :to-close="toClose"
      >
        <!-- bouton d'appel des fonctionnalités sous forme d'un engrenage -->
        <template #callButton>
          <div
            class="icone__parametres"
            role="img"
            alt="Propriétés du message"
          ></div>
        </template>
        <!-- appel d'une fenêtre modale personnalisée pour modifier les éléments du message -->
        <ModalComponent
          v-if="props.message.isAuthor"
          :global="true"
          :to-close="toClose"
        >
          <!-- bouton d'appel de la fenêtre de modification -->
          <template #callButton>
            <p>Modifier</p>
          </template>
          <!-- appel du composant permettant de créer ou modifier un message, en mode modification du message -->
          <MessageInputField :message="props.message" @close="closeAllModals" />
        </ModalComponent>
        <!-- bouton permettant de modérer ou rétablir un message -->
        <button
          v-if="
            conversationsStore.activeConversation.hasRightsOn &&
            !props.message.isAuthor
          "
          class="bouton__secondaire w100"
          @click.stop="moderateMessage(props.message)"
        >
          <span v-if="props.message.isModerated">Rétablir</span>
          <span v-if="!props.message.isModerated">Modérer</span>
        </button>
        <!-- bouton permettant de supprimer un message -->
        <button
          v-if="props.message.isAuthor"
          class="bouton__secondaire w100"
          @click.stop="deleteMessage(props.message.id)"
        >
          Supprimer
        </button>
      </ModalComponent>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, nextTick } from "vue";
import { useMessagesStore } from "@/store/messagesStore";
import { useConversationsStore } from "@/store/conversationsStore";
import EventService from "@/services/EventService.js";
import ModalComponent from "@/components/modal/ModalComponent.vue";
import MessageInputField from "@/components/message/MessageInputField.vue";

//props
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

//refs
const toClose = ref(false);

//variable
const messagesStore = useMessagesStore();
const conversationsStore = useConversationsStore();

//methods
// fonction permettant de convertir un timeStamp en STIRNG au format français
const timeFormat = (a) => {
  return new Date(a).toLocaleString("fr-fr", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};
// fonction permettant de supprimer un message après avoir demandé confirmation :
// - supprime le message de la base de donnée
// - met à jour Pinia
async function deleteMessage(id) {
  if (
    window.confirm(`Vous vous apprêter à supprimer ce message.
    Cette action est irreversible, voulez-vous continuer ?`)
  ) {
    try {
      await EventService.deleteMessage(id);
      messagesStore.deleteMessage(id);
    } catch (error) {
      console.error(error);
      return "Problème serveur";
    }
  } else {
    closeAllModals();
  }
}
// fonction permettant de modérer ou de rétablir un message selon son état actuel :
// - met à jour la base de donnée
// - met à jour Pinia
async function moderateMessage(message) {
  let payload = message.isModerated
    ? { isModerated: false }
    : { isModerated: true };
  try {
    let updatedMessage = await EventService.moderateMessage(
      message.id,
      payload,
      conversationsStore.activeConversation.id
    );
    updatedMessage = updatedMessage.data.body;
    messagesStore.updateMessage(updatedMessage);
    closeAllModals();
  } catch (error) {
    console.error(error);
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

<style scoped></style>
