<template>
  <div class="main1 container">
    <h1 class="titre1">Votre message</h1>
    <Form @submit="saveMessage" class="container" name="connectionForm">
      <label for="message" class="text">Votre message</label>
      <Field
        v-model="message"
        id="message"
        name="message"
        type="text"
        maxlength="1000"
        placeholder="Votre message"
        class="textInput"
        :rules="isNotEmpty"
      />
      <ErrorMessage name="message" class="errorMessage" />
      <p v-if="conversationsStore.activeConversation.hasRightsOn">
        <label for="isGlobal">Message global ? </label>
        <input type="checkbox" id="isGlobal" v-model="isGlobal" />
      </p>
      <input
        class="basicButton"
        type="submit"
        value="Envoyer"
        v-if="Object.keys(props.messageData).length == 0"
      />
      <input
        class="basicButton"
        type="submit"
        value="Modifier"
        v-if="Object.keys(props.messageData).length > 0"
      />
    </Form>
  </div>
</template>

<script setup>
import EventService from "@/services/EventService.js";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref, defineProps, defineEmits } from "vue";
import { useConversationsStore } from "@/store/conversationsStore";
import { useMessagesStore } from "@/store/messagesStore";

//props
const props = defineProps({
  messageData: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["close"]);

//variables
const conversationsStore = useConversationsStore();
const messagesStore = useMessagesStore();
const message = ref(
  Object.keys(props.messageData).length == 0 ? "" : props.messageData.content
);
const isGlobal = ref(
  Object.keys(props.messageData).length == 0
    ? false
    : !!props.messageData.isGlobal
);

//methods
function isNotEmpty() {
  if (!message.value) {
    return "Vous devez saisir un message !";
  } else {
    return true;
  }
}

async function saveMessage() {
  let payload = {
    content: message.value,
    isGlobal: isGlobal.value,
  };
  if (Object.keys(props.messageData).length == 0) {
    try {
      let newMessage = await EventService.sendMessage(
        conversationsStore.activeConversation.id,
        payload
      );
      newMessage = newMessage.data.body;
      messagesStore.messages.unshift(newMessage);
      message.value = "";
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
        props.messageData.id,
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
