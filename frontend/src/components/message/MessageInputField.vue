<template>
  <div class="main1 container">
    <h1 class="titre1">Votre message</h1>
    <Form @submit="saveMessage" class="container">
      <label for="message" class="text">Votre message</label>
      <Field
        v-model="messageContent"
        id="messageContent"
        name="messageContent"
        type="text"
        maxlength="1000"
        placeholder="Votre messageContent"
        class="textInput"
        :rules="isNotEmpty"
      />
      <div>Nombre de caractères restants : {{ charactersLeftInContent }}</div>
      <ErrorMessage name="messageContent" class="errorMessage" />
      <p v-if="conversationsStore.activeConversation.hasRightsOn">
        <label for="isGlobal">Message global ? </label>
        <input type="checkbox" id="isGlobal" v-model="isGlobal" />
      </p>
      <input
        class="basicButton"
        type="submit"
        value="Envoyer"
        v-if="Object.keys(props.message).length == 0"
      />
      <input
        class="basicButton"
        type="submit"
        value="Modifier"
        v-if="Object.keys(props.message).length > 0"
      />
    </Form>
  </div>
</template>

<script setup>
import EventService from "@/services/EventService.js";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, defineProps, defineEmits, computed } from "vue";
import { useConversationsStore } from "@/store/conversationsStore";
import { useMessagesStore } from "@/store/messagesStore";

//props
const props = defineProps({
  message: {
    type: Object,
    required: true,
  },
});
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
    return "Vous devez saisir un message !";
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
