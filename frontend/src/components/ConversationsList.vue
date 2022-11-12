<template>
  <div class="main1 container">
    <button
      v-for="conversation in conversations"
      :key="conversation.id"
      :conversation="conversation"
      @click="showDetails(conversation)"
    >
      <h4>{{ conversation.name }}</h4>
      <button v-if="conversation.hasRightsOn" @click.stop="warn">...</button>
    </button>
    <Modal :global="true" ref="modalRef1">
      <template #callButton>
        <p>Nouvelle conversation</p>
      </template>
      <h1>Créer une nouvelle conversation</h1>
      <p>Sélectionner les participants à cette conversation :</p>
      <p>Ici mon outil de choix de personnes</p>
      <form>
        <div>
          <p>
            <label for="conversationName">Nom de la conversation : </label>
            <input type="text" id="conversationName" />
          </p>
          <p>
            <label for="isPublic">Conversation publique :</label>
            <input type="checkbox" id="isPublic" v-model="isPublic" />
          </p>
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
import Modal from "@/components/modal/ModalComponent.vue";
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
      isPublic: false,
    };
  },
  methods: {
    warn() {
      alert("ça fonctionne");
    },

    showDetails(payload) {
      this.$emit("detailsExpended", payload);
    },

    createConversation() {
      const payload = {
        name: document.getElementById("conversationName").value,
        users: Array.from(this.selectedValue, (x) => x.id),
        isPublic: this.isPublic,
      };
      EventService.createConversation(payload)
        .then((newConversation) => {
          this.conversations.unshift(newConversation.data.body);
        })
        .catch();
      this.selectedValue = [];
      document.getElementById("conversationName").value = "";
      this.$refs.modalRef1.closeModal();
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
