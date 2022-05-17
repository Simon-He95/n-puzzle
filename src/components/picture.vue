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
} from "../config";
import { updateRank, setData } from "../request";
import { PictureBlock } from "../type";
import axios from "axios";

let { countDown } = defineProps<{
  countDown: number;
}>();
n.value = 3;
status.value = "Easy";
setData();
const url = "https://source.unsplash.com/collection/94734566";

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
    <img
      object-fill
      v-if="row.length"
      v-for="block in row"
      w-auto
      flex="~"
      items-center
      justify-center
      border-box
      :title="block.pos"
      m="1px"
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
  </div>
  <img
    :class="preview ? 'h-62 top-0 left-50% translate-x--50%' : 'w-20 top-15 right-1'"
    absolute
    border-rd-2
    :src="base64"
    alt="原图"
    @click="preview = !preview"
  />

  <Loading v-if="loading" />
</template>

<style scoped></style>
