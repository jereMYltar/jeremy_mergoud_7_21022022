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
    <button @click="isOpen = true" ref="modalButton">
      Nouvelle conversation
    </button>
    <Modal :open="isOpen" @close="closeModal">
      <h1>Créer une nouvelle conversation</h1>
      <p>Sélectionner les participants à cette conversation :</p>
      <p>Ici mon outil de choix de personnes</p>
      <form>
        <div>
          <label for="conversationName">Nom de la conversation : </label>
          <input type="text" id="conversationName" />
          <multiselect
            v-model="selectedValue"
            :options="users"
            mode="tags"
            :close-on-select="false"
            :searchable="true"
            placeholder="Sélectionner un ou plusieurs interlocuteurs"
            label="name"
            valueProp="id"
            :object="true"
          ></multiselect>
        </div>
        <button @click.prevent="createConversation">
          Créer la conversation
        </button>
      </form>
    </Modal>
  </div>
</template>

<script>
import EventService from "@/services/EventService.js";
import Modal from "@/components/ModalComponent.vue";
import { ref } from "vue";
import Multiselect from "@vueform/multiselect";
export default {
  name: "ConversationList",
  emits: ["detailsExpended"],
  components: { Modal, Multiselect },
  data() {
    return {
      conversations: "",
      selectedValue: [],
      users: [],
    };
  },
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
  methods: {
    showDetails(id) {
      this.$emit("detailsExpended", id);
    },

    createConversation() {
      const payload = {
        name: document.getElementById("conversationName").value,
        users: Array.from(this.selectedValue, (x) => x.id),
      };
      EventService.createConversation(payload)
        .then((newConversation) => {
          this.conversations.unshift(newConversation.data.body);
        })
        .catch();
      this.selectedValue = [];
      document.getElementById("conversationName").value = "";
      this.closeModal();
    },
  },
  created() {
    EventService.getAllConversationsForCurrentUser()
      .then((response) => {
        this.conversations = response.data;
      })
      .catch();
    EventService.getAllUsers()
      .then((response) => {
        this.users = response.data;
      })
      .catch();
  },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped></style>
