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
            mode="tags"
            placeholder="Sélectionner un ou plusieurs interlocuteurs"
            :close-on-select="false"
            :searchable="true"
            :object="true"
            trackBy="name"
            valueProp="name"
            label="name"
            ref="multiselect"
            :options="options"
            @change="showValue"
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
      options: [],
    };
  },
  setup() {
    const isOpen = ref(false);
    const modalButton = ref();
    const multiselect = ref();

    function closeModal() {
      isOpen.value = false;
      setTimeout(() => {
        modalButton.value.focus();
      }, 50);
    }

    function showValue() {
      console.log(multiselect);
    }

    return { isOpen, modalButton, multiselect, closeModal, showValue };
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
        this.options = response.data;
        console.log(this.options);
      })
      .catch();
  },
};
</script>

<style src="@vueform/multiselect/themes/default.css"></style>
<style scoped></style>
