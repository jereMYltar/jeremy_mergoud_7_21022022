/* eslint-disable */
<template>
  <transition name="fade">
    <div class="vue-modal" @click.self="$emit('close')" v-show="open">
      <transition name="drop-in">
        <div class="vue-modal-inner" v-show="open">
          <div class="vue-modal-content">
            <button
              type="button"
              ref="firstButton"
              aria-label="Fermer"
              title="Fermer cette fenêtre modale"
              @click="$emit('close')"
            >
              X
            </button>
            <slot />
            <button type="button" ref="lastButton" @click="$emit('close')">
              Annuler
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, onUnmounted, watch, defineProps, defineEmits } from "vue";

//props
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
    default: false,
  },
});

//emit
const emit = defineEmits(["close"]);

//variables
let firstButton = "";
let lastButton = "";

//functions
const close = () => {
  firstButton = "";
  lastButton = "";
  emit("close");
};

const captureFocus = () => {
  const focusableElementsArray = [
    "[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ];
  const modal = document.getElementsByClassName("vue-modal-content");
  const focusableElements = modal[0].querySelectorAll(focusableElementsArray);
  firstButton = focusableElements[0];
  lastButton = focusableElements[focusableElements.length - 1];
  firstButton.focus();
};

const handleKeyUp = (event) => {
  switch (true) {
    case event.code === "Escape" && props.open:
      close();
      break;
    default:
      break;
  }
};

const handleKeyDown = (event) => {
  switch (true) {
    case !event.shiftKey &&
      event.code === "Tab" &&
      props.open &&
      lastButton === document.activeElement:
      event.preventDefault();
      firstButton.focus();
      break;
    case event.shiftKey &&
      event.code === "Tab" &&
      props.open &&
      firstButton === document.activeElement:
      event.preventDefault();
      lastButton.focus();
      break;
    default:
      break;
  }
};

//watchers
watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      setTimeout(() => {
        captureFocus();
      }, 50);
    }
  }
);

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
});
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("keyup", handleKeyUp);
});

// return { close, firstButton, lastButton };
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

.vue-modal-content /deep/ :focus {
  border: solid 5px rgb(16, 161, 66);
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
