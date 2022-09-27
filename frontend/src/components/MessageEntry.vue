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
  props: {
    id: {
      type: Number,
      default: 0,
      required: false,
    },
  },
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
  emits: ["messageSend"],
  methods: {
    sendMessage() {
      let payload = {
        message: {
          conversation_id: this.id,
          user_id: 0,
          content: this.message,
        },
      };
      EventService.sendMessage(payload)
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
