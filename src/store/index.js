import { createStore } from "@/vuex/index";

const store = createStore({
  state: {
    count: 0,
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },
  // mutations: {
  //   increment(state) {
  //     state.count += 1;
  //   },
  //   decrement(state) {
  //     state.count -= 1;
  //   },
  //   incrementBy(state, amount) {
  //     state.count += amount;
  //   },
  // },
  // actions: {
  //   incrementAsync({ commit }) {
  //     setTimeout(() => {
  //       commit("increment");
  //     }, 300);
  //   },
  // },
});

export default store;
