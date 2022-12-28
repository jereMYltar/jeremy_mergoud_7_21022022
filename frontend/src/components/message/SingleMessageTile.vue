<template>
  <div
    :class="[
      'message',
      'container__row',
      props.message.isAuthor ? 'message__written' : 'message__read',
      props.message.isGlobal ? 'message__global' : '',
    ]"
  >
    <div>
      <div v-if="!props.message.isAuthor" class="text__details">
        {{ props.message.author }}
      </div>
      <div v-if="props.message.isAuthor" class="text__details">Moi</div>
      <div v-if="!props.message.isModerated" class="text">
        {{ props.message.content }}
      </div>
      <div v-if="props.message.isModerated" class="text">
        Le contenu de ce message a été modéré en raison d'un non-respect des
        règles de bonne conduite de notre entreprise.
      </div>
      <div class="text__details">
        Posté le {{ timeFormat(props.message.createdAt) }}
      </div>
      <div
        v-if="props.message.createdAt != props.message.updatedAt"
        class="text__details"
      >
        Modifié le {{ timeFormat(props.message.updatedAt) }}
      </div>
    </div>
    <div class="icone__box">
      <ModalComponent
        v-if="
          props.message.hasRightsOn ||
          conversationsStore.activeConversation.hasRightsOn
        "
        :global="false"
        :to-close="toClose"
      >
        <template #callButton>
          <div class="icone__parametres"></div>
        </template>
        <ModalComponent
          v-if="props.message.isAuthor"
          :global="true"
          :to-close="toClose"
        >
          <template #callButton>
            <p>Modifier</p>
          </template>
          <MessageInputField :message="props.message" @close="closeAllModals" />
        </ModalComponent>
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
import moment from "moment";
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
const timeFormat = (a) => {
  return moment(a).locale("fr").format("LL à LTS");
};

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

async function closeAllModals() {
  toClose.value = true;
  await nextTick();
  toClose.value = false;
}
</script>

<style scoped></style>
