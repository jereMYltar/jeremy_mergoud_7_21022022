<template>
  <div
    :class="[
      'message',
      props.messageData.isAuthor ? 'written' : 'read',
      props.messageData.isGlobal ? 'global' : '',
    ]"
  >
    <div v-if="!props.messageData.isAuthor">{{ props.messageData.author }}</div>
    <div v-if="props.messageData.isAuthor">Moi</div>
    <div v-if="props.messageData.createdAt != props.messageData.updatedAt">
      Message modifié le {{ timeFormat(props.messageData.updatedAt) }}
    </div>
    <div v-if="!props.messageData.isModerated">
      {{ props.messageData.content }}
    </div>
    <div v-if="props.messageData.isModerated">
      Le contenu de ce message a été modéré en raison d'un non-respect des
      règles de bonne conduite de notre entreprise.
    </div>
    <div>Message posté le {{ timeFormat(props.messageData.createdAt) }}</div>
    <ModalComponent
      :global="false"
      :toClose="toClose"
      ref="modalRef1"
      v-if="props.messageData.hasRightsOn"
    >
      <template #callButton>
        <p>...</p>
      </template>
      <ModalComponent :global="true" :toClose="toClose">
        <template #callButton>
          <p>Modifier</p>
        </template>
        <MessageInputField
          :messageData="props.messageData"
          @close="closeAllModals"
        />
      </ModalComponent>
      <ModalComponent :global="true" :toClose="toClose">
        <template #callButton>
          <p>Supprimer</p>
        </template>
        <h1>Supprimer le message ?</h1>
        <p>
          Vous vous apprêter à supprimer ce message. Cette action est
          irreversible, voulez-vous continuer ?
        </p>
        <button @click.stop="deleteMessage(props.messageData)">Oui</button>
      </ModalComponent>
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

//props
const props = defineProps({
  messageData: {
    type: Object,
    required: true,
  },
});

//variable
const toClose = ref(false);
const messagesStore = useMessagesStore();

//methods
const timeFormat = (a) => {
  return moment(a).locale("fr").format("LL à LTS");
};

async function deleteMessage(message) {
  try {
    messagesStore.deleteMessage(message);
    await EventService.deleteMessage(message.id);
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
