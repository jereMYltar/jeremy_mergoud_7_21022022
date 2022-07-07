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
      <input class="basicButton" type="submit" value="Envoyer" />
    </Form>
  </div>
</template>

<script>
import EventService from "@/services/EventService.js";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
  name: "MessageEntry",
  data() {
    return {
      message: "",
    };
  },
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  methods: {
    sendMessage() {
      let payload = {
        message: this.message,
      };
      EventService.sendMessage(payload)
        .then(() => {
          this.email = "";
          this.password = "";
        })
        .catch();
    },
  },
};
</script>
