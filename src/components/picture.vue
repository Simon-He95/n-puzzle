<script setup lang="ts">
import { initData, isWin, emptyFlag, randomNumbers } from "../pic";
import { steps, win, n, start, array } from "../config";
import { updateRank } from "../request";
import axios from "axios";

let { status, countDown } = defineProps<{
  status: GameStaus;
  countDown: number;
}>();

let loading = $ref(true);

const base64 = $ref("");
function getImage() {
  axios({
    methods: "get",
    responseType: "blob",
    url: "https://unsplash.it/1600/900?random",
  }).then((res) => {
    let oFileReader = new FileReader();
    oFileReader.readAsDataURL(res.data);
    oFileReader.onloadend = function (e) {
      // 此处拿到的已经是 base64的图片了
      base64 = e.target.result;
      setData();
      loading = false;
    };
  });
}
getImage();

useStorage("playName", name);

type Block = {
  url: string;
  x: number;
  y: number;
  pos: number;
};

start.value = Date.now();

async function setData() {
  array.value = await initData(n.value, base64);
  isFresh();
}

async function movepic(block: Block) {
  if (!block || block.url === emptyFlag) return;
  if (canMove(block)) {
    steps.value++;
    // 判断胜利条件
    if (isWin(array.value)) {
      win.value = true;
      rankList = await updateRank(countDown, steps.value, name.value, status);
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
  if (y > 0 && array.value[y - 1][x].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = array.value[y - 1][x];
    array.value[y - 1][x].url = url;
    array.value[y - 1][x].pos = pos;
    array.value[y][x].url = tempUrl;
    array.value[y][x].pos = temPos;
    return true;
  }
  if (y < n.value - 1 && array.value[y + 1][x].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = array.value[y + 1][x];
    array.value[y + 1][x].url = url;
    array.value[y + 1][x].pos = pos;
    array.value[y][x].url = tempUrl;
    array.value[y][x].pos = temPos;
    return true;
  }
  if (x > 0 && array.value[y][x - 1].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = array.value[y][x - 1];

    array.value[y][x - 1].url = url;
    array.value[y][x - 1].pos = pos;
    array.value[y][x].url = tempUrl;
    array.value[y][x].pos = temPos;
    return true;
  }
  if (x < n.value - 1 && array.value[y][x + 1].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = array.value[y][x + 1];
    array.value[y][x + 1].url = url;
    array.value[y][x + 1].pos = pos;
    array.value[y][x].url = tempUrl;
    array.value[y][x].pos = temPos;
    return true;
  }
  return false;
}

// 判断此题是否有解
function isFresh() {
  let inverse = 0;
  const preNumber: number[] = [];
  const odd = (n.value & 1) === 1;
  randomNumbers.reduce((pre, cur) => {
    preNumber.push(pre);
    preNumber.forEach((item) => {
      if (item > cur) inverse++;
    });
    return cur;
  }, 0);
  randomNumbers.length = 0;
  if (odd && (inverse & 1) === 1) {
    // 无解重新生成
    reset();
  } else if (!odd && (inverse & 1) === 0) {
    // 无解重新生成
    reset();
  }
}

async function reset() {
  win.value = false;
  start.value = Date.now();
  steps.value = 0;
  setData();
}

function sizeStyle() {
  const result = {};
  if (status === "Easy") {
    result["width"] = "5.75rem !important";
    result["height"] = "5.75rem !important";
  } else if (status === "Medium") {
    result["width"] = "4rem !important";
    result["height"] = "4rem !important";
  } else if (status === "Hard") {
    result["width"] = "3.25rem !important";
    result["height"] = "3.25rem !important";
  } else if (status === "Evil") {
    result["width"] = "2.75rem !important";
    result["height"] = "2.75rem !important";
  }
  return result;
}

defineExpose({
  reset,
});
</script>

<template>
  <div w-full overflow-auto m-t-10 :style="{ 'pointer-events': win ? 'none' : '' }">
    <div v-for="(row, y) in array" :key="y" flex="~" items-center justify-center w-max ma>
      <img
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
        class="bg-gray-500/10 hover:bg-gray-500/20"
        :src="block?.url"
        @click="movepic(block)"
        :style="sizeStyle()"
      />
    </div>
    <img w-25 absolute right-1 top-15 border-rd-2 :src="base64" alt="" />
  </div>
  <div
    absolute
    style="left: 50%; top: 50%; transform: translate(-50%, -50%)"
    z-20
    v-if="loading"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      width="1em"
      height="1em"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 24 24"
      text-7xl
    >
      <circle cx="12" cy="2" r="0" fill="currentColor">
        <animate
          attributeName="r"
          begin="0"
          calcMode="spline"
          dur="1s"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
          repeatCount="indefinite"
          values="0;2;0;0"
        />
      </circle>
      <circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(45 12 12)">
        <animate
          attributeName="r"
          begin="0.125s"
          calcMode="spline"
          dur="1s"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
          repeatCount="indefinite"
          values="0;2;0;0"
        />
      </circle>
      <circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(90 12 12)">
        <animate
          attributeName="r"
          begin="0.25s"
          calcMode="spline"
          dur="1s"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
          repeatCount="indefinite"
          values="0;2;0;0"
        />
      </circle>
      <circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(135 12 12)">
        <animate
          attributeName="r"
          begin="0.375s"
          calcMode="spline"
          dur="1s"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
          repeatCount="indefinite"
          values="0;2;0;0"
        />
      </circle>
      <circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(180 12 12)">
        <animate
          attributeName="r"
          begin="0.5s"
          calcMode="spline"
          dur="1s"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
          repeatCount="indefinite"
          values="0;2;0;0"
        />
      </circle>
      <circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(225 12 12)">
        <animate
          attributeName="r"
          begin="0.625s"
          calcMode="spline"
          dur="1s"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
          repeatCount="indefinite"
          values="0;2;0;0"
        />
      </circle>
      <circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(270 12 12)">
        <animate
          attributeName="r"
          begin="0.75s"
          calcMode="spline"
          dur="1s"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
          repeatCount="indefinite"
          values="0;2;0;0"
        />
      </circle>
      <circle cx="12" cy="2" r="0" fill="currentColor" transform="rotate(315 12 12)">
        <animate
          attributeName="r"
          begin="0.875s"
          calcMode="spline"
          dur="1s"
          keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
          repeatCount="indefinite"
          values="0;2;0;0"
        />
      </circle>
    </svg>
  </div>
</template>

<style scoped></style>
