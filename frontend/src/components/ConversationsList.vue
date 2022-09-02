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
          <label for="input1">Nom de la conversation : </label>
          <input type="text" id="input1" />
          <multiselect
            v-model="value"
            :options="options"
            placeholder="Sélectionner un ou plusieurs interlocuteurs"
            mode="multiple"
            valueProp="language"
            label="name"
            trackBy="language"
            ref="multiselect"
          ></multiselect>
        </div>
        <button>Créer la conversation</button>
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
      value: null,
      options: [
        { name: "Vue.js", language: "JavaScript" },
        { name: "Rails", language: "Ruby" },
        { name: "Sinatra", language: "Ruby" },
        { name: "Laravel", language: "PHP" },
        { name: "Phoenix", language: "Elixir" },
      ],
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
  },
  created() {
    EventService.getConversations()
      .then((response) => {
        this.conversations = response.data;
      })
      .catch();
    EventService.getAllUsers()
      .then((response) => {
        console.log(response);
        // this.options = response.data;
      })
      .catch();
  },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped></style>
