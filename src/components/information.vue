<script setup lang="ts">
const { show, close } = defineProps<{
  show: boolean;
  close: Function;
}>();
import { name } from "../config";

function closeShow() {
  if (!name.value) {
    alert("请输入姓名");
  } else {
    close();
  }
}
</script>

<template>
  <div bg-dark-400 fixed top-0 left-0 w-full h-full z-10 v-show="show"></div>
  <div
    class="information"
    fixed
    z-15
    top-0
    w-full
    h-full
    flex="~"
    flex-col
    items-center
    box-border
    p-x-10
    v-show="show"
  >
    <h1 p="y-10" c-white text-3xl>N PUZZLE</h1>

    <div p-b-10 c-yellow-3 text-sm text-left max-w-xs>
      Notice:<br />
      Your log name is required before you start this puzzle journey! And your name will
      be displayed in the ranking when you hit the top three with fewer steps. If same
      steps, the shortest time wins! <br /><br />Let’s rock and roll NOW!
    </div>
    <div c-white p-y-10>
      Player: <input m-t-2 border-rd-1 c-dark indent-2 m-l-1 type="text" v-model="name" />
    </div>

    <button
      type="submit"
      w-50
      h-10
      m-t-15
      border-rd="1"
      box-border
      p-x-6
      p-y-1
      flex="~"
      items-center
      justify-center
      bg-white
      @click="closeShow"
      animate-bounce
    >
      <img src="/start.jpg" alt="Game Start" />
    </button>
  </div>
</template>

<style scoped>
.information:before {
  content: "";
  background-image: url("/cover.png");
  opacity: 0.2;
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 0.5rem;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  width: 100%;
  height: 100%;
}
</style>
