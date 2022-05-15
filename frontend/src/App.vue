<template>
  <div class="container">
    <h1 class="titre">Together at Work</h1>
    <ConnectionView></ConnectionView>
  </div>
</template>

<script>
import ConnectionView from "@/views/ConnectionView.vue";
export default {
  components: { ConnectionView },
};
</script>
