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
  <div
    border-1
    border-rd-1
    bg-dark-400
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
    <div p-b-10 c-yellow-2 text-sm text-left>
      Notice:<br />
      Your log name is required before you start this puzzle journey! And your name will
      be displayed in the ranking when you hit the top three with fewer steps. If same
      steps, the shortest time wins! <br /><br />Let’s rock and roll NOW!
    </div>
    <div c-white>
      name：<input m-t-2 border-rd-1 c-dark indent-1 type="text" v-model="name" />
    </div>

    <button type="submit" w-50 h-10 m-t-15 border-rd="1" bg-yellow @click="closeShow">
      Start Game
    </button>
  </div>
</template>

<style scoped></style>
