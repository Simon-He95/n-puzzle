<script setup lang="ts">
import type { GameStaus } from '../type'
import {
  loading,
  model,
  n,
  name,
  numReset,
  picReset,
  preview,
  rankList,
  start,
  status,
  steps,
  win,
} from '../config'
import { baseImage, getRankList } from '../request'

useStorage('playName', name)

const changeName = ref(true)
if (name.value)
  changeName.value = false

start.value = Date.now()

function change() {
  changeName.value = false
  start.value = Date.now()
}
const showRank = ref(false)
const finishTime = ref(null)
function reset() {
  finishTime.value = null // 重置完成时间
  win.value = false
  model.value === 'number' ? numReset() : picReset()
}

const now = useNow()
// 添加一个完成时间变量

const countDown = computed(() => {
  // 如果已完成，使用完成时间
  if (finishTime.value) {
    return Math.round((finishTime.value - start.value) / 1000)
  }
  // 否则继续实时更新
  return Math.round((+now.value - start.value) / 1000)
})

function newGame(difficulty: GameStaus) {
  status.value = difficulty
  switch (difficulty) {
    case 'Easy':
      if (n.value !== 3) {
        n.value = 3
        reset()
      }
      return
    case 'Medium':
      if (n.value !== 5) {
        n.value = 5
        reset()
      }
      return
    case 'Hard':
      if (n.value !== 6) {
        n.value = 6
        reset()
      }
      return
    case 'Evil':
      if (n.value !== 8) {
        n.value = 8
        reset()
      }
  }
}

async function changePicture() {
  loading.value = true
  win.value = false
  finishTime.value = null // 重置完成时间
  steps.value = 0
  await baseImage()
  start.value = Date.now()
  loading.value = false
}

async function getRank() {
  showRank.value = !showRank.value
  rankList.value = await getRankList(status.value, model.value)
  console.log({ rankList })
}

function winHandler() {
  // 存储完成时的时间
  finishTime.value = Date.now()

  // 其他完成后的逻辑
  console.log(`Puzzle completed in ${Math.round((finishTime.value - start.value) / 1000)} seconds with ${steps.value} steps`)
}
</script>

<template>
  <information :show="changeName" :close="change" />
  <div flex="~" justify-between box-border m-4 border-b-1 class="border-gray:500/10">
    <div w-30 text-left overflow-hidden text-ellipsis flex="~" items-center @click="changeName = true">
      <svg
        xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" style="vertical-align: -0.125em" width="1em"
        height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1024" m-r-1
      >
        <path
          fill="currentColor"
          d="m199.04 672.64l193.984 112l224-387.968l-193.92-112l-224 388.032zm-23.872 60.16l32.896 148.288l144.896-45.696L175.168 732.8zM455.04 229.248l193.92 112l56.704-98.112l-193.984-112l-56.64 98.112zM104.32 708.8l384-665.024l304.768 175.936L409.152 884.8h.064l-248.448 78.336L104.32 708.8zm384 254.272v-64h448v64h-448z"
        />
      </svg>Hi, {{ name }}
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1.25em" height="1em"
      preserveAspectRatio="xMidYMid meet" viewBox="0 0 640 512" border-10px border-transparent box-content
      @click="getRank()"
    >
      <path
        fill="currentColor"
        d="M406.1 61.65c9.3 1.44 13.3 12.94 6.5 19.76l-38 36.69l9 52c.5 9.4-8.3 16.6-16.9 12.3l-46.5-24.5l-46.9 24.8c-8.6 4.3-18.3-2.9-16.9-12.2l9-52.1l-38-36.99c-6.8-6.82-2.8-18.32 6.5-19.76l52.3-7.54l23.6-47.778c4.3-8.621 16.5-8.262 20.4 0l23.6 47.778l52.3 7.54zM384 256c17.7 0 32 14.3 32 32v192c0 17.7-14.3 32-32 32H256c-17.7 0-32-14.3-32-32V288c0-17.7 14.3-32 32-32h128zm-224 64c17.7 0 32 14.3 32 32v128c0 17.7-14.3 32-32 32H32c-17.67 0-32-14.3-32-32V352c0-17.7 14.33-32 32-32h128zm288 96c0-17.7 14.3-32 32-32h128c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H480c-17.7 0-32-14.3-32-32v-64z"
      />
    </svg>
    <Rank v-if="showRank" :current-mode="model" :rank-list="rankList" @back="showRank = false" />
  </div>
  <div font-sans p="t-10" text="center gray-700 dark:gray-200" @click="(showRank = false) && (preview = false)">
    <p text-3xl animate-heart-beat m-b-5>
      <vivid-typing :interval="100" content="N PUZZLE" />
    </p> {{ n }} x {{ n }} <div font-mono text-xl flex="~ gap-1" items-center justify="center" m-t-5>
      <div i-carbon-timer /> {{ countDown }} <svg
        xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img"
        width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 512 512" m-l-1
      >
        <path
          fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"
          d="M200 246.84c8.81 58.62-7.33 90.67-52.91 97.41c-50.65 7.49-71.52-26.44-80.33-85.06c-11.85-78.88 16-127.94 55.71-131.1c36.14-2.87 68.71 60.14 77.53 118.75Zm23.65 162.69c3.13 33.28-14.86 64.34-42 69.66c-27.4 5.36-58.71-16.37-65.09-49.19s17.75-34.56 47.32-40.21s55.99-20.4 59.77 19.74ZM312 150.83c-8.81 58.62 7.33 90.67 52.9 97.41c50.66 7.49 71.52-26.44 80.33-85.06c11.86-78.89-16-128.22-55.7-131.1c-36.4-2.64-68.71 60.13-77.53 118.75Zm-23.65 162.7c-3.13 33.27 14.86 64.34 42 69.66c27.4 5.36 58.71-16.37 65.09-49.19s-17.75-34.56-47.32-40.22s-55.99-20.4-59.77 19.75Z"
        />
      </svg> {{ steps }}
    </div>
    <div flex="~ gap-4 wrap" justify="center" p4>
      <button v-show="model === 'picture'" btn @click="changePicture()">
        New Pic
      </button>
      <button btn @click="reset()">
        Rest
      </button>
      <button btn :class="{ 'active-difficulty': status === 'Easy' }" @click="newGame('Easy')">
        Easy
      </button>
      <button btn :class="{ 'active-difficulty': status === 'Medium' }" @click="newGame('Medium')">
        Medium
      </button>
      <button btn :class="{ 'active-difficulty': status === 'Hard' }" @click="newGame('Hard')">
        Hard
      </button>
      <button v-show="model === 'number'" btn :class="{ 'active-difficulty': status === 'Evil' }" @click="newGame('Evil')">
        Evil
      </button>
    </div>
    <div w-full overflow-hidden :style="{ 'pointer-events': win ? 'none' : '' }">
      <Number v-if="model === 'number'" :count-down="countDown" @win="winHandler" />
      <Picture v-else-if="model === 'picture'" :count-down="countDown" @win="winHandler" />
    </div>
  </div>
</template>
