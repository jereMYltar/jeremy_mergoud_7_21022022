<template>
  <div
    :class="[
      'message',
      props.message.isAuthor ? 'written' : 'read',
      props.message.isGlobal ? 'global' : '',
    ]"
  >
    <div v-if="!props.message.isAuthor">{{ props.message.author }}</div>
    <div v-if="props.message.isAuthor">Moi</div>
    <div v-if="props.message.createdAt != props.message.updatedAt">
      Message modifié le {{ timeFormat(props.message.updatedAt) }}
    </div>
    <div v-if="!props.message.isModerated">
      {{ props.message.content }}
    </div>
    <div v-if="props.message.isModerated">
      Le contenu de ce message a été modéré en raison d'un non-respect des
      règles de bonne conduite de notre entreprise.
    </div>
    <div>Message posté le {{ timeFormat(props.message.createdAt) }}</div>
    <ModalComponent
      :global="false"
      :toClose="toClose"
      ref="modalRef1"
      v-if="
        props.message.hasRightsOn ||
        conversationsStore.activeConversation.hasRightsOn
      "
    >
      <template #callButton>
        <p>...</p>
      </template>
      <ModalComponent
        :global="true"
        :toClose="toClose"
        v-if="props.message.isAuthor"
      >
        <template #callButton>
          <p>Modifier</p>
        </template>
        <MessageInputField :message="props.message" @close="closeAllModals" />
      </ModalComponent>
      <button
        @click.stop="moderateMessage(props.message)"
        v-if="
          conversationsStore.activeConversation.hasRightsOn &&
          !props.message.isAuthor
        "
      >
        <span v-if="props.message.isModerated">Rétablir</span>
        <span v-if="!props.message.isModerated">Modérer</span>
      </button>
      <button
        @click.stop="deleteMessage(props.message.id)"
        v-if="props.message.isAuthor"
      >
        Supprimer
      </button>
    </ModalComponent>
  </div>
</template>

<script setup>
import EventService from "@/services/EventService.js";
import { defineProps, ref, nextTick } from "vue";
import moment from "moment";
import ModalComponent from "@/components/modal/ModalComponent.vue";
import MessageInputField from "@/components/message/MessageInputField.vue";
import { useMessagesStore } from "@/store/messagesStore";
import { useConversationsStore } from "@/store/conversationsStore";

//props
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

//variable
const toClose = ref(false);
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
      messagesStore.deleteMessage(id);
      await EventService.deleteMessage(id);
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

<style scoped>
.message {
  margin: 5px;
  padding: 3px;
  border: 1px grey solid;
  border-radius: 3px;
  width: 70%;
}
.written {
  background-color: lightcyan;
  align-self: flex-end;
}
.read {
  background-color: lightgray;
  align-self: flex-start;
}

.global {
  background-color: lemonchiffon;
  width: 100%;
}
</style>
