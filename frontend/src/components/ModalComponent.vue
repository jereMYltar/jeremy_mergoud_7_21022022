/* eslint-disable */
<template>
  <!-- <transition name="fade"> -->
  <div class="vue-modal" @click.self="$emit('close')" v-show="open">
    <!-- <transition name="drop-in"> -->
    <div class="vue-modal-inner" v-show="open">
      <div class="vue-modal-content">
        <button
          type="button"
          ref="closeButton"
          aria-label="Fermer"
          title="Fermer cette fenêtre modale"
          @click="$emit('close')"
        >
          X
        </button>
        <slot />
        <button type="button" @click="$emit('close')">Annuler</button>
      </div>
    </div>
    <!-- </transition> -->
  </div>
  <!-- </transition> -->
</template>

<script>
import { onMounted, onUnmounted, watch, ref } from "vue";
export default {
  props: {
    open: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  setup(props, ctx) {
    const closeButton = ref(null);
    const close = () => {
      ctx.emit("close");
    };

    const handleKeyup = (event) => {
      if (event.keyCode === 27) {
        if (props.open) {
          close();
        }
      }
    };

    watch(
      () => props.open,
      (isOpen) => {
        console.log(isOpen);
        if (isOpen) {
          setTimeout(() => {
            console.log(closeButton);
            closeButton.value?.focus();
          }, 2000);
        }
      }
    );

    onMounted(() => {
      document.addEventListener("keyup", handleKeyup);
    });
    onUnmounted(() => document.removeEventListener("keyup", handleKeyup));

    return { close };
  },
  // methods: {},
};
</script>

<style scoped>
*,
::before,
::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.vue-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

.vue-modal-inner {
  max-width: 500px;
  margin: 2rem auto;
}

.vue-modal-content {
  position: relative;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.3);
  background-clip: padding-box;
  border-radius: 0.3rem;
  padding: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.drop-in-enter-active,
.drop-in-leave-active {
  transition: all 0.3s ease-out;
}

.drop-in-enter-from,
.drop-in-leave-to {
  opacity: 0;
  transform: translate(0, -50px);
}
</style>
