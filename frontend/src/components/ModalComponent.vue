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
    const firstButton = ref(null);
    const lastButton = ref(null);

    const close = () => {
      ctx.emit("close");
    };

    // const handleKeyUp = (event) => {
    //   if (event.keyCode === 27) {
    //     if (props.open) {
    //       close();
    //     }
    //   }
    // };
    const handleKeyUp = (event) => {
      switch (true) {
        case event.keyCode === 27 && props.open:
          close();
          break;
        default:
          break;
      }
    };
    const handleKeyDown = (event) => {
      switch (true) {
        case !event.shiftKey &&
          event.keyCode === 9 &&
          props.open &&
          lastButton.value === document.activeElement:
          event.preventDefault();
          firstButton.value.focus();
          break;
        case event.shiftKey &&
          event.keyCode === 9 &&
          props.open &&
          firstButton.value === document.activeElement:
          event.preventDefault();
          lastButton.value.focus();
          break;
        default:
          break;
      }
    };

    watch(
      () => props.open,
      (isOpen) => {
        if (isOpen) {
          setTimeout(() => {
            firstButton.value.focus();
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

    return { close, firstButton, lastButton };
  },
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
