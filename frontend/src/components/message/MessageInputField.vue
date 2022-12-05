<template>
  <div class="main1 container">
    <h1 class="titre1">Votre message</h1>
    <Form @submit="createMessage" class="container" name="connectionForm">
      <label for="message" class="text">Votre message</label>
      <Field
        v-model="message"
        id="message"
        name="message"
        type="text"
        maxlength="1000"
        placeholder="Votre message"
        class="textInput"
      />
      <ErrorMessage name="message" class="errorMessage" />
      <p v-if="conversationsStore.activeConversation.hasRightsOn">
        <label for="isGlobal">Message global ? </label>
        <input type="checkbox" id="isGlobal" v-model="isGlobal" />
      </p>
      <input class="basicButton" type="submit" value="Envoyer" />
    </Form>
  </div>
</template>

<script setup>
import EventService from "@/services/EventService.js";
import { Form, Field, ErrorMessage } from "vee-validate";
import { ref } from "vue";
import { useConversationsStore } from "@/store/conversationsStore";
import { useMessagesStore } from "@/store/messagesStore";

const conversationsStore = useConversationsStore();
const messagesStore = useMessagesStore();
const message = ref("");
const isGlobal = ref(false);

async function createMessage() {
  let payload = {
    content: message.value,
    isGlobal: isGlobal.value,
  };
  try {
    let newMessage = await EventService.sendMessage(
      conversationsStore.activeConversation.id,
      payload
    );
    console.log(newMessage);
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
}
</script>
