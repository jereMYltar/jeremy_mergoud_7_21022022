<template>
  <button @click="showDetails(props.conversation)">
    <h4>{{ props.conversation.name }}</h4>
    <button v-if="props.conversation.hasRightsOn" @click.stop="warn">
      ...
    </button>
  </button>
</template>

<script setup>
import { defineProps } from "vue";
import { useConversationsStore } from "@/store/conversationsStore";
//props
const props = defineProps({
  conversation: {
    type: Object,
    required: true,
  },
});

//variables
const conversationsStore = useConversationsStore();

//methods
function warn() {
  // alert("ça fonctionne");
  console.log(props.conversation.id);
}

function showDetails(conversation) {
  conversationsStore.addActiveConversations(conversation);
}
</script>
