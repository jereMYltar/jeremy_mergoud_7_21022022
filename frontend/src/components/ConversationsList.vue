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
    <button @click="isOpen = true" ref="modalButton">Show modal</button>
    <Modal :open="isOpen" @close="closeModal">
      <p>lorem ipsum dolor</p>
      <form>
        <div>
          <label for="input1">Mon libellé 1 : </label>
          <input type="text" id="input1" />
        </div>
        <div>
          <label for="input2">Mon libellé 2 : </label>
          <input type="text" id="input2" />
        </div>
      </form>
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
    const modalButton = ref();

    function closeModal() {
      isOpen.value = false;
      setTimeout(() => {
        modalButton.value.focus();
      }, 50);
    }

    return { isOpen, modalButton, closeModal };
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
