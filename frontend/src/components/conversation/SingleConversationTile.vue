<template>
  <button @click="showDetails(props.conversation.id)">
    <h4>{{ props.conversation.name }}</h4>
    <p v-if="props.conversation.isClosed">Conversation fermée</p>
    <ModalComponent
      :global="false"
      :toClose="toClose"
      ref="modalRef1"
      v-if="props.conversation.hasRightsOn"
    >
      <template #callButton>
        <p>...</p>
      </template>
      <ModalComponent :global="true" :toClose="toClose">
        <template #callButton>
          <p>Modifier</p>
        </template>
        <ConversationInputField
          :existingConversation="0"
          @close="closeAllModals"
        />
      </ModalComponent>
      <button @click.stop="closeConversation(props.conversation)">
        <span v-if="props.conversation.isClosed">Rouvrir la conversation</span>
        <span v-if="!props.conversation.isClosed">Fermer la conversation</span>
      </button>
      <button
        @click.stop="deleteConversation(props.conversation.id)"
        v-if="props.conversation.conversationOwnerId"
      >
        Supprimer
      </button>
    </ModalComponent>
  </button>
</template>

<script setup>
import EventService from "@/services/EventService.js";
import ModalComponent from "../modal/ModalComponent.vue";
import ConversationInputField from "./ConversationInputField.vue";
import { defineProps, ref, nextTick } from "vue";
import { useConversationsStore } from "@/store/conversationsStore";
//props
const props = defineProps({
  conversation: {
    type: Object,
    required: true,
  },
});

//variables
const toClose = ref(false);
const conversationsStore = useConversationsStore();

//methods
async function showDetails(id) {
  try {
    const conversationDetails = await EventService.getConversationDetail(id);
    console.log(conversationDetails.data.body);
    conversationsStore.addActiveConversation(conversationDetails.data.body);
  } catch (error) {
    console.log(error);
    return "Problème serveur";
  }
}

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
      console.log(error);
      return "Problème serveur";
    }
  } else {
    closeAllModals();
  }
}

async function closeConversation(conversation) {
  let payload = conversation.isClosed
    ? { isClosed: false }
    : { isClosed: true };
  try {
    let updatedConversation = await EventService.updateConversation(
      conversation.id,
      payload
    );
    updatedConversation = updatedConversation.data.body;
    conversationsStore.updateConversation(updatedConversation);
    closeAllModals();
  } catch (error) {
    console.log(error);
    return "Problème serveur";
  }
}

async function closeAllModals() {
  toClose.value = true;
  await nextTick();
  toClose.value = false;
}
</script>
