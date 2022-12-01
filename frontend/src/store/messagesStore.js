import { defineStore } from "pinia";

export const useMessagesStore = defineStore("messages", {
    state: () => ({
        messages: [],
        activeMessage: null,
    }),
    getters: {

    },
    actions: {

    },
});