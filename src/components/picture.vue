<script setup lang="ts">
import { initData, isWin, emptyFlag } from "../pic";
import {
  steps,
  win,
  n,
  start,
  arrayPic,
  name,
  base64,
  loading,
  ratio,
  preview,
  status,
  nightMode,
} from "../config";
import { updateRank, setData } from "../request";
import { PictureBlock } from "../type";
import axios from "axios";

let { countDown } = defineProps<{
  countDown: number;
}>();
const currentPos = $ref("");

nightMode.value = false;
win.value = false;
n.value = 3;
status.value = "Easy";
setData();
const mode = $ref("normal");
start.value = Date.now();

async function movepic(block: PictureBlock) {
  if (!block || block.url === emptyFlag) return;
  if (canMove(block)) {
    steps.value++;
    // 判断胜利条件
    if (isWin()) {
      win.value = true;
      updateRank(countDown, steps.value, name.value, status.value).then(
        (result) => (rankList = result)
      );
      alert(
        `Congratulations! You make it! Proud of you！ Check the rankings from the button on the upper right corner. `
      );
    }
  } else {
    // alert("改数字不能被交换");
  }
}

function canMove(block: Block): Boolean {
  const { x, y, url, pos } = block;
  if (y > 0 && arrayPic.value[y - 1][x].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = arrayPic.value[y - 1][x];
    arrayPic.value[y - 1][x].url = url;
    arrayPic.value[y - 1][x].pos = pos;
    arrayPic.value[y][x].url = tempUrl;
    arrayPic.value[y][x].pos = temPos;
    arrayPic.value[y][x].animateY = true;
    arrayPic.value[y - 1][x].animateY = true;
    setTimeout(() => {
      arrayPic.value[y - 1][x].animateY = false;
      arrayPic.value[y][x].animateY = false;
    }, 50);
    return true;
  }
  if (y < n.value - 1 && arrayPic.value[y + 1][x].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = arrayPic.value[y + 1][x];
    arrayPic.value[y + 1][x].url = url;
    arrayPic.value[y + 1][x].pos = pos;
    arrayPic.value[y][x].url = tempUrl;
    arrayPic.value[y][x].pos = temPos;
    arrayPic.value[y][x].animateY = true;
    arrayPic.value[y + 1][x].animateY = true;
    setTimeout(() => {
      arrayPic.value[y + 1][x].animateY = false;
      arrayPic.value[y][x].animateY = false;
    }, 50);
    return true;
  }
  if (x > 0 && arrayPic.value[y][x - 1].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = arrayPic.value[y][x - 1];
    arrayPic.value[y][x - 1].url = url;
    arrayPic.value[y][x - 1].pos = pos;
    arrayPic.value[y][x].url = tempUrl;
    arrayPic.value[y][x].pos = temPos;
    arrayPic.value[y][x].animateX = true;
    arrayPic.value[y][x - 1].animateX = true;
    setTimeout(() => {
      arrayPic.value[y][x - 1].animateX = false;
      arrayPic.value[y][x].animateX = false;
    }, 50);
    return true;
  }
  if (x < n.value - 1 && arrayPic.value[y][x + 1].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = arrayPic.value[y][x + 1];
    arrayPic.value[y][x + 1].url = url;
    arrayPic.value[y][x + 1].pos = pos;
    arrayPic.value[y][x].url = tempUrl;
    arrayPic.value[y][x].pos = temPos;
    arrayPic.value[y][x].animateX = true;
    arrayPic.value[y][x + 1].animateX = true;
    setTimeout(() => {
      arrayPic.value[y][x + 1].animateX = false;
      arrayPic.value[y][x].animateX = false;
    }, 50);
    return true;
  }
  return false;
}

function modelChange() {
  if (mode === "cheat") {
    mode = "normal";
  } else {
    mode = "cheat";
  }
}

const sizeStyle = $computed(() => {
  const result = {};
  if (status.value === "Easy") {
    result["width"] = "7rem !important";
    result["height"] = "auto !important";
  } else if (status.value === "Medium") {
    result["width"] = "4.4rem !important";
    result["height"] = "auto !important";
  } else if (status.value === "Hard") {
    result["width"] = "3.6rem !important";
    result["height"] = "auto !important";
  } else if (status.value === "Evil") {
    result["width"] = "2.75rem !important";
    result["height"] = "auto !important";
  }
  result["aspect-ratio"] = ratio.value;
  return result;
});

let timer = null;
function openBlock(block: PictureBlock) {
  if (!nightMode.value) {
    movepic(block);
    return;
  }
  currentPos = block.pos;
  clearTimeout(timer);
  console.log("22");
  timer = setTimeout(() => {
    movepic(block);
    currentPos = "";
  }, 500);
}
</script>

<template>
  <div
    v-for="(row, y) in arrayPic"
    :key="y"
    flex="~"
    items-center
    justify-center
    w-max
    ma
  >
    <div v-for="block in row" relative m="1px">
      <img
        object-fill
        w-auto
        flex="~"
        items-center
        justify-center
        border-box
        :title="block.pos"
        border="0.5 gray-400/10"
        :class="[
          'bg-gray-500/10',
          'hover:bg-gray-500/20',
          block?.animateY ? 'animate-shake-y' : '',
          block?.animateX ? 'animate-shake-x' : '',
        ]"
        :src="block?.url"
        @click="movepic(block)"
        :style="sizeStyle"
      />
      <div
        v-show="block.pos !== emptyFlag && nightMode"
        @click="openBlock(block)"
        absolute
        :class="[currentPos === block.pos && 'animate', 'w-100%', 'h-100%']"
        z-10
        left-0
        top-0
        bg-dark
      ></div>
      <div
        @click="openBlock(block)"
        absolute
        class="left-50% top-50% translate--50%"
        v-show="mode === 'cheat'"
        text-2xl
        font-bold
        z-20
      >
        {{ block.pos === emptyFlag ? "" : block.pos }}
      </div>
    </div>
  </div>
  <img
    :class="preview ? 'h-62 top-0 left-50% translate-x--50%' : 'w-20 top-15 right-1'"
    absolute
    border-rd-2
    :src="base64"
    alt="原图"
    @click="preview = !preview"
  />
  <button btn @click="modelChange" m-t-5>Cheat Model</button>
  <Loading v-if="loading" />
</template>

<style scoped>
@keyframes slide {
  from {
    transform: rotateX(0);
  }
  to {
    visibility: hidden;
    transform: rotateX(-180deg);
  }
}
.animate {
  transform-origin: top;
  animation: slide 0.5s linear;
}
</style>
