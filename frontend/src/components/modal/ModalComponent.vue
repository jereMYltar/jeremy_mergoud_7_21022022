/* eslint-disable */
<template>
  <button
    class="container__row jc__center bouton__secondaire w100"
    @click.stop="openModal"
  >
    <slot name="callButton"></slot>
  </button>
  <transition name="fade">
    <div
      v-if="isOpen"
      class="vue-modal"
      :createdat="Date.now()"
      @click.self="closeModal"
    >
      <transition name="drop-in">
        <div class="vue-modal-inner">
          <div class="vue-modal-content container__col">
            <button
              v-if="props.global"
              ref="firstButton1"
              type="button"
              aria-label="Fermer"
              title="Fermer cette fenêtre modale"
              class="bouton__fermer"
              @click="closeModal"
            >
              <p class="icone__fermeture"></p>
            </button>
            <slot></slot>
            <button
              v-if="props.global"
              ref="lastButton1"
              type="button"
              class="bouton__tertiaire"
              @click="closeModal"
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
import { defineProps, defineExpose, ref, nextTick, watch } from "vue";

//props
const props = defineProps({
  global: {
    type: Boolean,
    required: true,
    default: true,
  },
  toClose: {
    type: Boolean,
    default: false,
  },
});

//variables
let isOpen = ref(false);
let latestModal = ref();
let firstButton = ref("");
let lastButton = ref("");
let callButton = ref("");

//functions

const openModal = async () => {
  isOpen.value = true;
  await nextTick();
  latestModal.value = findLatestModal();
  callButton.value = defineCallButton();
  captureFocus();
  latestModal.value.addEventListener("keydown", handleKeyDown, false);
  latestModal.value.addEventListener("keyup", handleKeyUp, false);
};

const closeModal = () => {
  callButton.value.focus();
  latestModal.value.removeEventListener("keydown", handleKeyDown);
  latestModal.value.removeEventListener("keyup", handleKeyUp);
  latestModal.value = "";
  firstButton.value = "";
  lastButton.value = "";
  callButton.value = "";
  isOpen.value = false;
};

defineExpose({ closeModal });

const findLatestModal = () => {
  const modals = document.querySelectorAll("div.vue-modal");
  let latestTimeStamp = 0;
  modals.forEach((element) => {
    const createdAt = element.getAttribute("createdat");
    if (latestTimeStamp < createdAt) {
      latestTimeStamp = createdAt;
    }
  });
  const latestModal = document.querySelector(
    ".vue-modal[createdat='" + latestTimeStamp + "']"
  );
  return latestModal;
};

const defineCallButton = () => {
  return latestModal.value.previousSibling;
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
  const focusableElements = latestModal.value.querySelectorAll(
    focusableElementsArray
  );
  if (focusableElements.length > 0) {
    firstButton.value = focusableElements[0];
    lastButton.value = focusableElements[focusableElements.length - 1];
    firstButton.value.focus();
  }
};

const handleKeyUp = (event) => {
  event.stopPropagation();
  switch (true) {
    case event.code === "Escape" && isOpen.value:
      closeModal();
      break;
    default:
      break;
  }
};

const handleKeyDown = (event) => {
  event.stopPropagation();
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
watch(
  () => props.toClose,
  (newValue) => {
    if (newValue) {
      closeModal();
    }
  }
);
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

/* .vue-modal-content :deep(:focus) {
  border: solid 5px rgb(16, 161, 66);
} */

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
