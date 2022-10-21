/* eslint-disable */
<template>
  <button @click="openModal">
    <slot name="callButton"></slot>
  </button>
  <transition name="fade">
    <div class="vue-modal" @click.self="closeModal" v-if="isOpen">
      <transition name="drop-in">
        <div class="vue-modal-inner">
          <div class="vue-modal-content">
            <button
              type="button"
              ref="firstButton1"
              aria-label="Fermer"
              title="Fermer cette fenêtre modale"
              @click="closeModal"
              v-if="props.global"
            >
              X
            </button>
            <slot></slot>
            <button
              type="button"
              ref="lastButton1"
              @click="closeModal"
              v-if="props.global"
            >
              Annuler
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup>
import { watch, defineProps, defineExpose, ref } from "vue";

//props
const props = defineProps({
  global: {
    type: Boolean,
    required: true,
    default: true,
  },
});

//variables
let isOpen = ref(false);
let firstButton = ref("");
let lastButton = ref("");

//functions

const openModal = () => {
  isOpen.value = true;
  document.addEventListener("keydown", handleKeyDown);
  document.addEventListener("keyup", handleKeyUp);
};

const closeModal = () => {
  isOpen.value = false;
  firstButton.value = "";
  document.removeEventListener("keydown", handleKeyDown);
  document.removeEventListener("keyup", handleKeyUp);
  lastButton.value = "";
};

defineExpose({ closeModal });

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
  if (focusableElements.length > 0) {
    firstButton.value = focusableElements[0];
    lastButton.value = focusableElements[focusableElements.length - 1];
    firstButton.value.focus();
  }
};

const handleKeyUp = (event) => {
  console.log("salut");
  switch (true) {
    case event.code === "Escape" && isOpen.value:
      closeModal();
      break;
    default:
      break;
  }
};

const handleKeyDown = (event) => {
  switch (true) {
    case !event.shiftKey &&
      event.code === "Tab" &&
      isOpen.value &&
      lastButton.value === document.activeElement:
      event.preventDefault();
      firstButton.value.focus();
      break;
    case event.shiftKey &&
      event.code === "Tab" &&
      isOpen.value &&
      firstButton.value === document.activeElement:
      event.preventDefault();
      lastButton.value.focus();
      break;
    default:
      break;
  }
};

//watchers
watch(isOpen, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      captureFocus();
    }, 50);
  }
});
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
