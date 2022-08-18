<template>
  <div class="main1 container">
    <button
      v-for="conversation in conversations"
      :key="conversation.id"
      :conversation="conversation"
      @click="showDetails(conversation.id)"
    >
      <h4>{{ conversation.name }}</h4>
    </button>
    <button @click="isOpen = true">Show modal</button>
    <Modal :open="isOpen" @close="isOpen = !isOpen">
      <p>lorem ipsum dolor</p>
    </Modal>
  </div>
</template>

<script>
import EventService from "@/services/EventService.js";
import Modal from "@/components/ModalComponent.vue";
import { ref } from "vue";
export default {
  name: "ConversationList",
  emits: ["detailsExpended"],
  components: { Modal },
  setup() {
    const isOpen = ref(false);
    return { isOpen };
  },
  data() {
    return {
      conversations: "",
    };
  },
  methods: {
    showDetails(id) {
      this.$emit("detailsExpended", id);
    },
  },
  created() {
    EventService.getConversations()
      .then((response) => {
        this.conversations = response.data;
      })
      .catch();
  },
};
</script>
