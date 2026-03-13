<script setup>
import { computed } from "vue";
import { useStore } from "@/vuex/index";

const store = useStore();
console.log("store", store);
const count = computed(() => store.state.count);

// const increment = () => store.commit("increment");
// const decrement = () => store.commit("decrement");
// const incrementByFive = () => store.commit("incrementBy", 5);
// const incrementAsync = () => store.dispatch("incrementAsync");
</script>

<template>
  <main class="page">
    <section class="card">
      <h1 class="title">Vuex Count 示例</h1>
      <p class="count">{{ count }}</p>
      {{ $store.state.count }}
      <div class="actions">
        <button type="button" @click="$store.state.count--">-1</button>
        <button type="button" @click="$store.state.count++">+1</button>
        {{ $store.getters.doubleCount }}
        <button type="button" @click="incrementAsync">异步 +1</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #f6f7ff, #eef3ff);
  color: #1f2937;
}

.card {
  width: min(480px, 90vw);
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 28px;
  box-shadow: 0 18px 40px rgba(30, 58, 138, 0.12);
  text-align: center;
}

.title {
  margin: 0 0 12px;
  font-size: 24px;
  font-weight: 600;
}

.count {
  font-size: 56px;
  font-weight: 700;
  margin: 8px 0 24px;
}

.actions {
  display: grid;
  gap: 12px;
}

button {
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 16px;
  background: #2563eb;
  color: #ffffff;
  cursor: pointer;
  transition:
    transform 120ms ease,
    box-shadow 120ms ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(37, 99, 235, 0.2);
}

button:active {
  transform: translateY(0);
  box-shadow: none;
}
</style>
