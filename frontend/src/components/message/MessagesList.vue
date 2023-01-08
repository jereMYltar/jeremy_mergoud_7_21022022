<!-- composant permettant d'afficher le nom de la conversation,
  les fonctionnalités disponibles, tous les messages de la conversation,
  ainsi que le champs de saise de nouveaux messages -->
<template>
  <div class="container__col jc__sb w70">
    <div class="container__col w100 f1">
      <!-- appel du composant affichant le nom de la conversation et ses fonctionnalités liées -->
      <ConversationHeader />
      <!-- appel d'un exemplaire du composant SingleMessageTile par message de la conversation -->
      <div class="container__col scrollbox hv__messages w100">
        <SingleMessageTile
          v-for="message in messagesStore.messages"
          :key="message.id"
          :message="message"
        />
      </div>
    </div>
    <!-- appel du composant permettant de saisir un nouveau message -->
    <div class="w100">
      <MessageInputField
        v-if="!conversationsStore.activeConversation.isClosed"
        :message="{}"
      />
    </div>
  </div>
</template>

<script setup>
//imports
import { useMessagesStore } from "@/store/messagesStore";
import { useConversationsStore } from "@/store/conversationsStore";
import ConversationHeader from "@/components/conversation/ConversationHeader.vue";
import MessageInputField from "@/components/message/MessageInputField.vue";
import SingleMessageTile from "@/components/message/SingleMessageTile.vue";

//stores
const messagesStore = useMessagesStore();
const conversationsStore = useConversationsStore();
</script>

<style scoped></style>
