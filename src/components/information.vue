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
    absolute
    z-15
    w-full
    h-full
    flex="~"
    flex-col
    items-center
    box-border
    p-x-10
    v-show="show"
  >
    <h1 p="y-10" c-white text-3xl>n puzzle</h1>
    <div p-b-10 c-yellow-2>
      备注：姓名会被记录到排名，按照步数交少排名，相同步数按用时较少排名
    </div>
    <div c-white>
      请输入你的名字：<input
        m-t-2
        border-rd-1
        c-dark
        indent-1
        type="text"
        v-model="name"
      />
    </div>

    <button type="submit" w-50 h-10 m-t-10 border-rd="1" bg-warmGray @click="closeShow">
      确认
    </button>
  </div>
</template>

<style scoped></style>
