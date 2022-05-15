<script setup lang="ts">
import axios from "axios";
import { name } from "../config";
import { isDark } from "~/composables";

const baseUrl = "http://81.68.90.128:5001/rank?";
// const baseUrl = "http://localhost:5001/rank?";

useStorage("playName", name);

let changeName = $ref(true);
if (name.value) {
  changeName = false;
}
function change() {
  changeName = false;
}
let rankList = $ref([]);
const showRank = $ref(false);

function initRank() {
  axios
    .get(`${baseUrl}type=init&status=${status}`)
    .then(function (response) {
      rankList = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function updateRank() {
  axios
    .get(
      `${baseUrl}times=${countDown}&steps=${steps}&name=${name.value}&status=${status}`
    )
    .then(function (response) {
      rankList = response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}

let n = $ref<number>(3);
const numbers: number[] = [];
const steps = $ref(0);
type Block = {
  number: undefined | number;
  x: number;
  y: number;
};

for (let i = 1; i < n * n; i++) {
  numbers.push(i);
}

const now = $(useNow());
const start = $ref(Date.now());
const countDown = $computed(() => Math.round((+now - start) / 1000));

function initData() {
  return Array.from({ length: n }, (_, y) =>
    Array.from({ length: n }, (_, x) => {
      let number = 0;
      if (x === 0 && y === 0) collect.push(0);
      else {
        number = randomNumbers();
        collect.push(number);
      }

      return {
        number: x === 0 && y === 0 ? undefined : number,
        x: x,
        y: y,
      };
    })
  );
}

const collect = [];
let array = $ref<Block>(initData());
let win = $ref(false);
isFresh();

// 判断此题是否有解
function isFresh() {
  let inverse = 0;
  const preNumber = [];
  const odd = (n & 1) === 1;
  collect.reduce((pre, cur) => {
    preNumber.push(pre);
    preNumber.forEach((item) => {
      if (item > cur) inverse++;
    });
    return cur;
  }, 0);
  collect.length = 0;
  if (odd && (inverse & 1) === 1) {
    // 无解重新生成
    rest();
  } else if (!odd && (inverse & 1) === 0) {
    // 无解重新生成
    rest();
  }
}

function rest() {
  win = false;
  start = Date.now();
  steps = 0;
  for (let i = 1; i < n * n; i++) {
    numbers.push(i);
  }
  array = initData();
  isFresh();
  return array;
}

function randomNumbers() {
  return numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0];
}

function move(block: Block) {
  // 判断上下左右是否有空白格
  if (!block.number) return;
  if (canMove(block)) {
    steps++;

    // 判断胜利条件
    if (isWin()) {
      win = true;
      updateRank();
      alert(
        `congratulations！score: ${countDown}s  ${steps}steps，In the top right corner is the ranking, let's challenge it, furthermore please remember to click star on GitHub！`
      );
    }
  } else {
    // alert("改数字不能被交换");
  }
}

function isWin(): Boolean {
  return array.every((row) => {
    return row.every((item) => {
      if (item.x === n - 1 && item.y === n - 1 && item.number === undefined) {
        return true;
      }
      return item.number === item.x + item.y * n + 1;
    });
  });
}

function canMove(block: Block): Boolean {
  const { x, y, number } = block;
  if (y > 0 && array[y - 1][x].number === undefined) {
    const temp = array[y - 1][x].number;
    array[y - 1][x].number = number;
    array[y][x].number = temp;

    return true;
  }
  if (y < n - 1 && array[y + 1][x].number === undefined) {
    const temp = array[y + 1][x].number;
    array[y + 1][x].number = number;
    array[y][x].number = temp;
    return true;
  }
  if (x > 0 && array[y][x - 1].number === undefined) {
    const temp = array[y][x - 1].number;
    array[y][x - 1].number = number;
    array[y][x].number = temp;

    return true;
  }
  if (x < n - 1 && array[y][x + 1].number === undefined) {
    const temp = array[y][x + 1].number;
    array[y][x + 1].number = number;
    array[y][x].number = temp;

    return true;
  }
  return false;
}

const status = $ref("easy");
function newGame(difficulty: "easy" | "medium" | "hard" | "evil") {
  status = difficulty;
  switch (difficulty) {
    case "easy":
      if (n === 3) return;
      n = 3;
      rest();
      return;
    case "medium":
      if (n === 5) return;
      n = 4;
      rest();
      return;
    case "hard":
      if (n === 6) return;
      n = 5;
      rest();
      return;
    case "evil":
      if (n === 8) return;
      n = 8;
      rest();
      return;
  }
}
</script>

<template>
  <button @click="updateRank()">test</button>
  <information :show="changeName" :close="change"></information>
  <div flex="~" justify-between box-border p-4>
    <div w-30 text-left overflow-hidden text-ellipsis @click="changeName = true">
      Hi, {{ name }}
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      width="1.25em"
      height="1em"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 640 512"
      @click="(showRank = !showRank) && initRank()"
      border-10px
      border-transparent
      box-content
    >
      <path
        fill="currentColor"
        d="M406.1 61.65c9.3 1.44 13.3 12.94 6.5 19.76l-38 36.69l9 52c.5 9.4-8.3 16.6-16.9 12.3l-46.5-24.5l-46.9 24.8c-8.6 4.3-18.3-2.9-16.9-12.2l9-52.1l-38-36.99c-6.8-6.82-2.8-18.32 6.5-19.76l52.3-7.54l23.6-47.778c4.3-8.621 16.5-8.262 20.4 0l23.6 47.778l52.3 7.54zM384 256c17.7 0 32 14.3 32 32v192c0 17.7-14.3 32-32 32H256c-17.7 0-32-14.3-32-32V288c0-17.7 14.3-32 32-32h128zm-224 64c17.7 0 32 14.3 32 32v128c0 17.7-14.3 32-32 32H32c-17.67 0-32-14.3-32-32V352c0-17.7 14.33-32 32-32h128zm288 96c0-17.7 14.3-32 32-32h128c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32v-64z"
      />
    </svg>
    <div
      v-show="showRank"
      bg-dark
      absolute
      z-5
      bg-
      p-x6
      left-0
      top-0
      w-full
      p-b-6
      box-border
      :style="
        isDark
          ? {
              'background-color': '#fff',
              'border-bottom-left-radius': '27%',
              'border-bottom-right-radius': '27%',
              'box-shadow': 'lightgrey 0px 0px 15px 5px',
            }
          : {
              'background-color': '#000',
              'border-bottom-left-radius': ' 25%',
              'border-bottom-right-radius': '25%',
              'box-shadow': 'lightgrey 0px 0px 15px 5px',
            }
      "
      text="gray-200 dark:gray-700"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        width="1em"
        height="1em"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 24 24"
        absolute
        right-1
        top-1
        @click="showRank = !showRank"
      >
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M10.657 12.071L5 6.414L6.414 5l5.657 5.657L17.728 5l1.414 1.414l-5.657 5.657l5.657 5.657l-1.414 1.414l-5.657-5.657l-5.657 5.657L5 17.728z"
        />
      </svg>
      <div m-y-4 text-2xl>
        <vivid-typing :interval="200" :infinity="true">{{ status }} 排名</vivid-typing>
      </div>
      <div text-sm text-left>
        注：排名会每周更新一次on GitHub, please contribute your
        <svg
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          role="img"
          inline
          style="vertical-align: -0.125em"
          width="1em"
          height="1em"
          preserveAspectRatio="xMidYMid meet"
          viewBox="0 0 64 64"
          text-sm
        >
          <path
            fill="#ffce31"
            d="M62 25.2H39.1L32 3l-7.1 22.2H2l18.5 13.7l-7 22.1L32 47.3L50.5 61l-7.1-22.2L62 25.2z"
          />
        </svg>
      </div>
      <div p-y-1>
        <div
          v-for="(user, i) in rankList"
          :key="i"
          text-left
          overflow-hidden
          text-ellipsis
          style="white-space: nowrap"
        >
          {{ i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1 }}
          Player：{{ user.name || "未知用户" }} {{ user.steps }}步 {{ user.times }}秒
        </div>
      </div>
    </div>
  </div>
  <div font-sans p="t-10" text="center gray-700 dark:gray-200" @click="showRank = false">
    <p text-3xl><vivid-typing :interval="100">n puzzle</vivid-typing></p>
    {{ n }} x {{ n }}
    <div font-mono text-xl flex="~ gap-1" items-center justify="center" m-t-5>
      <div i-carbon-timer />
      {{ countDown }}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        width="1em"
        height="1em"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 512 512"
        m-l-1
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-miterlimit="10"
          stroke-width="32"
          d="M200 246.84c8.81 58.62-7.33 90.67-52.91 97.41c-50.65 7.49-71.52-26.44-80.33-85.06c-11.85-78.88 16-127.94 55.71-131.1c36.14-2.87 68.71 60.14 77.53 118.75Zm23.65 162.69c3.13 33.28-14.86 64.34-42 69.66c-27.4 5.36-58.71-16.37-65.09-49.19s17.75-34.56 47.32-40.21s55.99-20.4 59.77 19.74ZM312 150.83c-8.81 58.62 7.33 90.67 52.9 97.41c50.66 7.49 71.52-26.44 80.33-85.06c11.86-78.89-16-128.22-55.7-131.1c-36.4-2.64-68.71 60.13-77.53 118.75Zm-23.65 162.7c-3.13 33.27 14.86 64.34 42 69.66c27.4 5.36 58.71-16.37 65.09-49.19s-17.75-34.56-47.32-40.22s-55.99-20.4-59.77 19.75Z"
        />
      </svg>
      {{ steps }}
    </div>

    <div flex="~ gap-1" justify="center" p4>
      <button btn @click="rest()">New Game</button>
      <button btn @click="newGame('easy')">Easy</button>
      <button btn @click="newGame('medium')">Medium</button>
      <button btn @click="newGame('hard')">Hard</button>
      <button btn @click="newGame('evil')">Evil</button>
    </div>
    <div w-full overflow-auto :style="{ 'pointer-events': win ? 'none' : '' }">
      <div
        v-for="(row, y) in array"
        :key="y"
        flex="~"
        items-center
        justify-center
        w-max
        ma
      >
        <div
          v-for="block in row"
          flex="~"
          items-center
          justify-center
          border-box
          min-w-10
          min-h-10
          m="1px"
          border="0.5 gray-400/10"
          class="bg-gray-500/10 hover:bg-gray-500/20"
          @click.prevent="move(block)"
        >
          {{ block.number }}
        </div>
      </div>
    </div>
    <div m-t-2>
      {{ status }}
    </div>
  </div>
</template>
