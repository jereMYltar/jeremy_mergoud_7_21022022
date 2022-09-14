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
            trackBy="name"
            valueProp="name"
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
      const conversationName =
        document.getElementById("conversationName").value;
      //rédiger ici l'appel au back pour la création de la conversation puis supprimer le log
      console.log(
        "nom : ",
        conversationName,
        "  -  utilisateurs : ",
        this.selectedValue
      );
      this.selectedValue = [];
      document.getElementById("conversationName").value = "";
    },
  },
  created() {
    EventService.getConversations()
      .then((response) => {
        this.conversations = response.data;
      })
      .catch();
    EventService.getAllUsers()
      .then((response) => {
        this.users = response.data;
        console.log(this.users);
      })
      .catch();
  },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped></style>
