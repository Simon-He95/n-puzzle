<script setup lang="ts">
import { name, steps, win, start, rankList, n, model } from "../config";
import { isDark } from "~/composables";
import { GameStaus } from "../type";
import { initRank } from "../request.ts";

useStorage("playName", name);

let changeName = $ref(true);
if (name.value) {
  changeName = false;
}
start.value = Date.now();

function change() {
  changeName = false;
  start.value = Date.now();
}
const showRank = $ref(false);
const numbersRest = $ref<Function>();
const picturesRest = $ref<Function>();
function reset() {
  model.value === "number" ? numbersRest() : picturesRest();
}
const numbers = ref(null);
const pictures = ref(null);

onMounted(() => {
  numbersRest = numbers?.value?.reset;
  picturesRest = pictures?.value?.reset;
});

watch(model, async (newVal) => {
  if (model.value === "picture") {
    await nextTick();
    picturesRest = pictures?.value?.reset;
  }
});
const now = $(useNow());
const countDown = $computed(() => Math.round((+now - start.value) / 1000));

const status = $ref("Easy");
function newGame(difficulty: GameStaus) {
  status = difficulty;
  switch (difficulty) {
    case "Easy":
      if (n.value !== 3) {
        n.value = 3;
        reset();
      }
      return;
    case "Medium":
      if (n.value !== 5) {
        n.value = 5;
        reset();
      }
      return;
    case "Hard":
      if (n.value !== 6) {
        n.value = 6;
        reset();
      }
      return;
    case "Evil":
      if (n.value !== 8) {
        n.value = 8;
        reset();
      }
      return;
  }
}

async function getRank() {
  showRank = !showRank;
  rankList.value = await initRank(status);
}
</script>

<template>
  <information :show="changeName" :close="change"></information>
  <div flex="~" justify-between box-border p-4>
    <div
      w-30
      text-left
      overflow-hidden
      text-ellipsis
      flex="~"
      items-center
      @click="changeName = true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        style="vertical-align: -0.125em"
        width="1em"
        height="1em"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 1024 1024"
        m-r-1
      >
        <path
          fill="currentColor"
          d="m199.04 672.64l193.984 112l224-387.968l-193.92-112l-224 388.032zm-23.872 60.16l32.896 148.288l144.896-45.696L175.168 732.8zM455.04 229.248l193.92 112l56.704-98.112l-193.984-112l-56.64 98.112zM104.32 708.8l384-665.024l304.768 175.936L409.152 884.8h.064l-248.448 78.336L104.32 708.8zm384 254.272v-64h448v64h-448z"
        /></svg
      >Hi, {{ name }}
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      width="1.25em"
      height="1em"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 640 512"
      @click="getRank()"
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
        <vivid-typing :interval="100" :infinity="true"
          >{{ status }}-Model Ranking</vivid-typing
        >
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
          {{ user.name || "未知用户" }}: <span font-bold>{{ user.steps }}</span> Steps,
          <span font-bold>{{ user.times }}</span> Seconds
        </div>
      </div>
      <div text-sm text-left>
        Reminder: The ranking on GitHub will be updated once a week. Appreciate your
        stars⭐
      </div>
    </div>
  </div>
  <div font-sans p="t-10" text="center gray-700 dark:gray-200" @click="showRank = false">
    <p text-3xl><vivid-typing :interval="100">N PUZZLE</vivid-typing></p>
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
      <button btn @click="reset()">Rest</button>
      <button btn @click="newGame('Easy')">Easy</button>
      <button btn @click="newGame('Medium')">Medium</button>
      <button btn @click="newGame('Hard')">Hard</button>
      <button btn @click="newGame('Evil')">Evil</button>
    </div>
    <div w-full overflow-auto :style="{ 'pointer-events': win.value ? 'none' : '' }">
      <Number
        v-if="model === 'number'"
        :countDown="countDown"
        :status="status"
        ref="numbers"
      ></Number>
      <Picture
        v-if="model === 'picture'"
        :countDown="countDown"
        :status="status"
        ref="pictures"
      ></Picture>
    </div>
  </div>
</template>
