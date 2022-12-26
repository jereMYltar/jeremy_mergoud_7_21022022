<template>
  <button @click="showDetails(props.conversation.id)">
    <h4>{{ props.conversation.name }}</h4>
    <p v-if="props.conversation.isClosed">Conversation fermée</p>
    <ModalComponent
      v-if="props.conversation.hasRightsOn"
      ref="modalRef1"
      :global="false"
      :to-close="toClose"
    >
      <template #callButton>
        <img src="@/assets/Images/gear-solid.svg" height="20" width="20" />
      </template>
      <ModalComponent :global="true" :to-close="toClose">
        <template #callButton>
          <p>Modifier</p>
        </template>
        <ConversationInputField
          :existing-conversation="1"
          @close="closeAllModals"
        />
      </ModalComponent>
      <button @click.stop="closeConversation(props.conversation)">
        <span v-if="props.conversation.isClosed">Rouvrir la conversation</span>
        <span v-if="!props.conversation.isClosed">Fermer la conversation</span>
      </button>
      <button
        v-if="props.conversation.conversationOwnerId"
        @click.stop="deleteConversation(props.conversation.id)"
      >
        Supprimer
      </button>
    </ModalComponent>
  </button>
</template>

<script setup>
import { defineProps, ref, nextTick } from "vue";
import { useConversationsStore } from "@/store/conversationsStore";
import EventService from "@/services/EventService.js";
import ModalComponent from "../modal/ModalComponent.vue";
import ConversationInputField from "./ConversationInputField.vue";
//props
const props = defineProps({
  conversation: {
    type: Object,
    required: true,
  },
});

//refs
const toClose = ref(false);

//stores
const conversationsStore = useConversationsStore();

//methods
async function showDetails(id) {
  try {
    const conversationDetails = await EventService.getConversationDetail(id);
    conversationsStore.addActiveConversation(conversationDetails.data.body);
  } catch (error) {
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
      return "Problème serveur";
    }
  } else {
    closeAllModals();
  }
}

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

async function closeAllModals() {
  toClose.value = true;
  await nextTick();
  toClose.value = false;
}
</script>
