<script setup lang="ts">
import { initData, isWin, emptyFlag, randomNumbers } from "../pic";
import { steps, win, n, start, array, name } from "../config";
import { updateRank } from "../request";
import axios from "axios";

let { status, countDown } = defineProps<{
  status: GameStaus;
  countDown: number;
}>();

let loading = $ref(true);
const url = "https://source.unsplash.com/collection/94734566";

const base64 = $ref("");
const ratio = $ref("1.5");
function getImage() {
  axios({
    methods: "get",
    responseType: "blob",
    url,
  }).then((res) => {
    let oFileReader = new FileReader();
    oFileReader.readAsDataURL(res.data);
    oFileReader.onloadend = function (e) {
      const image = new Image();
      base64 = e.target.result;
      image.src = base64;
      image.onload = () => {
        ratio = (image.width / image.height).toFixed(1);
        console.log((image.width / image.height).toFixed(1));
      };
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
  console.log(array.value);
  if (canMove(block)) {
    steps.value++;
    // 判断胜利条件
    if (isWin()) {
      win.value = true;
      updateRank(countDown, steps.value, name.value, status).then(
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
  if (y > 0 && array.value[y - 1][x].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = array.value[y - 1][x];
    array.value[y - 1][x].url = url;
    array.value[y - 1][x].pos = pos;
    array.value[y][x].url = tempUrl;
    array.value[y][x].pos = temPos;
    array.value[y][x].animateY = true;
    array.value[y - 1][x].animateY = true;
    setTimeout(() => {
      array.value[y - 1][x].animateY = false;
      array.value[y][x].animateY = false;
    }, 50);
    return true;
  }
  if (y < n.value - 1 && array.value[y + 1][x].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = array.value[y + 1][x];
    array.value[y + 1][x].url = url;
    array.value[y + 1][x].pos = pos;
    array.value[y][x].url = tempUrl;
    array.value[y][x].pos = temPos;
    array.value[y][x].animateY = true;
    array.value[y + 1][x].animateY = true;
    setTimeout(() => {
      array.value[y + 1][x].animateY = false;
      array.value[y][x].animateY = false;
    }, 50);
    return true;
  }
  if (x > 0 && array.value[y][x - 1].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = array.value[y][x - 1];
    array.value[y][x - 1].url = url;
    array.value[y][x - 1].pos = pos;
    array.value[y][x].url = tempUrl;
    array.value[y][x].pos = temPos;
    array.value[y][x].animateX = true;
    array.value[y][x - 1].animateX = true;
    setTimeout(() => {
      array.value[y][x - 1].animateX = false;
      array.value[y][x].animateX = false;
    }, 50);
    return true;
  }
  if (x < n.value - 1 && array.value[y][x + 1].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = array.value[y][x + 1];
    array.value[y][x + 1].url = url;
    array.value[y][x + 1].pos = pos;
    array.value[y][x].url = tempUrl;
    array.value[y][x].pos = temPos;
    array.value[y][x].animateX = true;
    array.value[y][x + 1].animateX = true;
    setTimeout(() => {
      array.value[y][x + 1].animateX = false;
      array.value[y][x].animateX = false;
    }, 50);
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
    result["height"] = "auto !important";
  } else if (status === "Medium") {
    result["width"] = "4rem !important";
    result["height"] = "auto !important";
  } else if (status === "Hard") {
    result["width"] = "3.25rem !important";
    result["height"] = "auto !important";
  } else if (status === "Evil") {
    result["width"] = "2.75rem !important";
    result["height"] = "auto !important";
  }
  result["aspect-ratio"] = ratio;
  return result;
}

defineExpose({
  reset,
});
</script>

<template>
  <div w-full overflow-auto :style="{ 'pointer-events': win ? 'none' : '' }">
    <div v-for="(row, y) in array" :key="y" flex="~" items-center justify-center w-max ma>
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
        :style="sizeStyle()"
      />
    </div>
    <img w-20 absolute right-1 top-15 border-rd-2 :src="base64" alt="" />
  </div>

  <Loading v-if="loading" />
</template>

<style scoped></style>
