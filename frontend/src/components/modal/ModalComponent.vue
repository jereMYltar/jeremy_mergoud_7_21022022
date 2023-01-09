/* eslint-disable */
<!-- composant permettant de générer une fen^tre modale personnalisée et respectant le RGAA -->
<template>
  <!-- bouton d'appel de la modale contenant les éléments transmis via un slot -->
  <button
    class="container__row jc__center bouton__secondaire w100"
    @click.stop="openModal"
  >
    <slot name="callButton"></slot>
  </button>
  <transition name="fade"
    ><!-- transition permettant de masquer le reste de l'écran -->
    <div
      v-if="isOpen"
      class="vue-modal"
      :createdat="Date.now()"
      @click.self="closeModal"
    >
      <!-- transition donnant un léger mouvement vertical lors de l'arrivée de la fenêtre modale -->
      <transition name="drop-in">
        <div class="vue-modal-inner">
          <!-- contenu de la modale -->
          <div class="vue-modal-content container__col">
            <!-- bouton en croix permettant de fermer la modale -->
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
            <!-- contenu de la modale transmis via un slot -->
            <slot></slot>
            <!-- bouton annuler permettant de fermer la modale -->
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
import { defineProps, ref, nextTick, watch } from "vue";

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
// fonction permettant d'afficher la modale, tout en :
// - sauvegardant le bouton d'appel de la modale
// - sauvegardant l'ordre des modales (afin de gérer les modales imbriquées)
// - déplaçant le focus sur le premier élément focusable de la modale et le rendant captif de la modale
// - ajoutant des eventListener pour gérer les boutons ECHAP, TAB et SHIFT+TAB
const openModal = async () => {
  isOpen.value = true;
  await nextTick();
  latestModal.value = findLatestModal();
  callButton.value = defineCallButton();
  captureFocus();
  latestModal.value.addEventListener("keydown", handleKeyDown, false);
  latestModal.value.addEventListener("keyup", handleKeyUp, false);
};
// fonction permettant de fermer la modale et de supprimer tout ce qui a été mis en place lors de son ouverture
// - éléments et informations sauvegardés
// - eventListener
// - remettre le focus sur le bouton d'appel de la modale
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
// fonction permettant de trouver la dernière fenêtre modale créée
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
// fonction permettant de définir le bouton d'appel de la modale
const defineCallButton = () => {
  return latestModal.value.previousSibling;
};
// fonction permettant de récupérer tous les éléments focusables de la modale,
// de définir le premier élément, ainsi que le dernier
// de déplacer le focus sur le premier élément
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
// fonction permettant de gérer le relachement de la touche ECHAP :
// - fermeture de la dernière modale
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
// fonction permettant de gérer l'appui sur la touche TAB ou sur le combo SHIFT+TAB :
// - déplacement entre les éléments focusable de haut en bas et de bas en haut
// - focus rendu captif par une boucle du dernier au premier élément
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
// watcher permettant de surveiller les changements de la propriété toClose afin de fermer la fenêtre modale lorsque la demande vient de l'extérieur
watch(
  () => props.toClose,
  (newValue) => {
    if (newValue) {
      closeModal();
    }
  }
);
</script>

<!-- style spécifique à la modale (aspect des éléments et transitions) -->
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
