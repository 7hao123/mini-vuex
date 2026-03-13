import { createStore } from "@/vuex/index";

function customPlugin(store) {
  let local = localStorage.getItem("state");
  if (local) {
    store.replaceState(JSON.parse(local));
  }
  store.subscribe((mutation, state) => {
    localStorage.setItem("state", JSON.stringify(state));
  });
}

const store = createStore({
  plugins: [customPlugin],
  state: {
    count: 0,
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },
  mutations: {
    // 同步修改state
    increment(state) {
      state.count += 1;
    },
    decrement(state) {
      state.count -= 1;
    },
    incrementBy(state, payload) {
      state.count += payload;
    },
  },
  actions: {
    //调用mutations  可以异步操作
    incrementAsync({ commit }, payload) {
      setTimeout(() => {
        commit("increment", payload);
      }, 300);
    },
  },
  modules: {
    //子模块，实现逻辑的拆分
    aCount: {
      namespaced: true,
      state: {
        count: 0,
      },
      mutations: {
        add(state, payload) {
          state.count += payload;
        },
      },
      modules: {
        cCount: {
          namespaced: true,
          state: { count: 0 },
          mutations: {
            add(state, payload) {
              state.count += payload;
            },
          },
        },
      },
    },
    bCount: {
      namespaced: true,
      state: { count: 0 },
      mutations: {
        add(state, payload) {
          state.count += payload;
        },
      },
    },
  },
});

export default store;
