<template>
  <h2
    id="messages-title"
    class="container__row jc__sb titre__tertiaire w100"
    tabindex="0"
  >
    Conversation active : {{ conversationsStore.activeConversation.name }}
    <div class="icone__box">
      <ModalComponent ref="modalRef1" :global="true" :to-close="toClose">
        <template #callButton>
          <div
            class="icone__parametres"
            role="button"
            aria-label="Propriété de la conversation"
          ></div>
        </template>
        <ModalComponent
          v-if="conversationsStore.activeConversation.hasRightsOn"
          :global="true"
          :to-close="toClose"
        >
          <template #callButton>
            <p>Modifier</p>
          </template>
          <ConversationInputField
            :existing-conversation="1"
            @close="closeAllModals"
          />
        </ModalComponent>
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
          Supprimer
        </button>
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
function conversationChange() {
  conversationsStore.removeActiveConversation();
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
