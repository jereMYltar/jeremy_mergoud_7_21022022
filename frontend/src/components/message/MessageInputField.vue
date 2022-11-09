<template>
  <div class="main1 container">
    <h1 class="titre1">Votre message</h1>
    <Form @submit="sendMessage" class="container" name="connectionForm">
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
      <p>
        <label for="isGlobal">Message global ? </label>
        <input type="checkbox" id="isGlobal" v-model="isGlobal" />
      </p>
      <input class="basicButton" type="submit" value="Envoyer" />
    </Form>
  </div>
</template>

<script>
import EventService from "@/services/EventService.js";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  name: "MessageEntry",
  props: {
    conversationId: {
      type: Number,
      default: 0,
      required: false,
    },
  },
  data() {
    return {
      message: "",
      isGlobal: "",
    };
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["messageSend"],
  methods: {
    sendMessage() {
      let payload = {
        content: this.message,
        isGlobal: this.isGlobal,
      };
      EventService.sendMessage(this.conversationId, payload)
        .then((response) => {
          this.$emit("messageSend", response.data.body);
          this.message = "";
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        })
        .catch();
    },
  },
};
</script>
