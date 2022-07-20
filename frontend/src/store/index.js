import { createStore } from "vuex";

export default createStore({
  state: {
    conversationId: 0,
  },
  getters: {},
  mutations: {
    SET_CONVERSATION_ID(state, id) {
      state.conversationId = id;
    },
  },
  actions: {
    setConversationId({ commit }, id) {
      commit("SET_CONVERSATION_ID", id);
    },
  },
  modules: {},
});
