<template>
  <div>
    <h4>{{ conversation.name }}</h4>
  </div>
</template>

<script>
export default {
  name: "ConversationCard",
  props: {
    conversation: {
      type: Object,
      required: true,
    },
  },
};
</script>
