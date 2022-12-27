<template>
  <div class="main container__col">
    <h1 class="titre__tertiaire">Votre message</h1>
    <Form class="container__col" @submit="saveMessage">
      <label for="message" class="text">Votre message</label>
      <Field
        id="messageContent"
        v-model="messageContent"
        name="messageContent"
        type="text"
        maxlength="1000"
        placeholder="Contenu de votre message"
        :rules="isNotEmpty"
      />
      <div>Nombre de caractères restants : {{ charactersLeftInContent }}</div>
      <ErrorMessage name="messageContent" class="alerte" />
      <p v-if="conversationsStore.activeConversation.hasRightsOn">
        <label for="isGlobal">Message global ? </label>
        <input id="isGlobal" v-model="isGlobal" type="checkbox" />
      </p>
      <input
        v-if="Object.keys(props.message).length == 0"
        class="bouton__principal"
        type="submit"
        value="Envoyer"
      />
      <input
        v-if="Object.keys(props.message).length > 0"
        class="bouton__principal"
        type="submit"
        value="Modifier"
      />
    </Form>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from "vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import { useConversationsStore } from "@/store/conversationsStore";
import { useMessagesStore } from "@/store/messagesStore";
import EventService from "@/services/EventService.js";

//props
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});

//events
const emit = defineEmits(["close"]);

//variables
const conversationsStore = useConversationsStore();
const messagesStore = useMessagesStore();

//ref
const messageContent = ref(
  Object.keys(props.message).length == 0 ? "" : props.message.content
);
const isGlobal = ref(
  Object.keys(props.message).length == 0 ? false : !!props.message.isGlobal
);

//computed
const charactersLeftInContent = computed(() => {
  return 1000 - messageContent.value.length;
});

//methods
function isNotEmpty() {
  if (!messageContent.value) {
    return "Vous devez saisir un contenu pour votre message !";
  } else {
    return true;
  }
}

async function saveMessage() {
  let payload = {
    content: messageContent.value,
    isGlobal: isGlobal.value,
  };
  if (Object.keys(props.message).length == 0) {
    try {
      let newMessage = await EventService.sendMessage(
        conversationsStore.activeConversation.id,
        payload
      );
      newMessage = newMessage.data.body;
      messagesStore.messages.unshift(newMessage);
      messageContent.value = "";
      isGlobal.value = false;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(error);
      return "Problème serveur";
    }
  } else {
    try {
      let updatedMessage = await EventService.updateMessage(
        props.message.id,
        payload
      );
      updatedMessage = updatedMessage.data.body;
      messagesStore.updateMessage(updatedMessage);
      emit("close");
    } catch (error) {
      console.error(error);
      return "Problème serveur";
    }
  }
}
</script>
