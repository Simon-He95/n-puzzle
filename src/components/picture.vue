<script setup lang="ts">
import type { PictureBlock } from '../type'
import {
  arrayPic,
  base64,
  loading,
  n,
  name,
  nightMode,
  preview,
  rankList,
  start,
  status,
  steps,
  win,
} from '../config'
import { emptyFlag, isWin } from '../pic'
import { updateRank } from '../request'

const emits = defineEmits(['win'])
const currentPos = ref('')

nightMode.value = false
win.value = false
const mode = ref('normal')
start.value = Date.now()

async function movepic(block: PictureBlock) {
  if (!block || block.url === emptyFlag)
    return
  if (canMove(block)) {
    steps.value++
    // 判断胜利条件

    if (isWin()) {
      win.value = true
      rankList.value = await updateRank(
        Math.round((Date.now() - start.value) / 1000),
        steps.value,
        name.value,
        status.value,
        'picture',
      )
      emits('win')
      alert(
        'Congratulations! You make it! Proud of you！ Check the rankings from the button on the upper right corner. ',
      )
    }
  }
  else {
    // alert("改数字不能被交换");
  }
}

function canMove(block: Block): boolean {
  const { x, y, url, pos } = block
  if (y > 0 && arrayPic.value[y - 1][x].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = arrayPic.value[y - 1][x]
    arrayPic.value[y - 1][x].url = url
    arrayPic.value[y - 1][x].pos = pos
    arrayPic.value[y][x].url = tempUrl
    arrayPic.value[y][x].pos = temPos
    arrayPic.value[y][x].animateY = true
    arrayPic.value[y - 1][x].animateY = true
    setTimeout(() => {
      arrayPic.value[y - 1][x].animateY = false
      arrayPic.value[y][x].animateY = false
    }, 50)
    return true
  }
  if (y < n.value - 1 && arrayPic.value[y + 1][x].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = arrayPic.value[y + 1][x]
    arrayPic.value[y + 1][x].url = url
    arrayPic.value[y + 1][x].pos = pos
    arrayPic.value[y][x].url = tempUrl
    arrayPic.value[y][x].pos = temPos
    arrayPic.value[y][x].animateY = true
    arrayPic.value[y + 1][x].animateY = true
    setTimeout(() => {
      arrayPic.value[y + 1][x].animateY = false
      arrayPic.value[y][x].animateY = false
    }, 50)
    return true
  }
  if (x > 0 && arrayPic.value[y][x - 1].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = arrayPic.value[y][x - 1]
    arrayPic.value[y][x - 1].url = url
    arrayPic.value[y][x - 1].pos = pos
    arrayPic.value[y][x].url = tempUrl
    arrayPic.value[y][x].pos = temPos
    arrayPic.value[y][x].animateX = true
    arrayPic.value[y][x - 1].animateX = true
    setTimeout(() => {
      arrayPic.value[y][x - 1].animateX = false
      arrayPic.value[y][x].animateX = false
    }, 50)
    return true
  }
  if (x < n.value - 1 && arrayPic.value[y][x + 1].url === emptyFlag) {
    const { url: tempUrl, pos: temPos } = arrayPic.value[y][x + 1]
    arrayPic.value[y][x + 1].url = url
    arrayPic.value[y][x + 1].pos = pos
    arrayPic.value[y][x].url = tempUrl
    arrayPic.value[y][x].pos = temPos
    arrayPic.value[y][x].animateX = true
    arrayPic.value[y][x + 1].animateX = true
    setTimeout(() => {
      arrayPic.value[y][x + 1].animateX = false
      arrayPic.value[y][x].animateX = false
    }, 50)
    return true
  }
  return false
}

function modelChange() {
  if (mode.value === 'cheat')
    mode.value = 'normal'
  else
    mode.value = 'cheat'
}

function reset() {
  win.value = false // 重置游戏完成状态
  mode.value === 'number' ? numReset() : picReset()
}

const sizeStyle = computed(() => {
  const result: Record<string, string> = {}
  const availableHeight = window.innerHeight - 500 // 减去顶部内容的高度
  const baseSize = Math.min(window.innerWidth, availableHeight) / (n.value * 1.1) // 调整尺寸以避免滚动条

  result.width = `${baseSize}px`
  result.height = `${baseSize}px`
  result.margin = '2px' // 添加间距以保证美观
  result.transition = loading.value ? 'none' : 'all 0.3s ease' // 禁用加载时的动画
  return result
})

let timer = null
function openBlock(block: PictureBlock) {
  if (!nightMode.value) {
    movepic(block)
    return
  }
  currentPos.value = block.pos
  clearTimeout(timer)
  timer = setTimeout(() => {
    movepic(block)
    currentPos.value = ''
  }, 500)
}

async function changePicture() {
  loading.value = true
  // 重置游戏状态
  win.value = false
  steps.value = 0
  start.value = Date.now() // 重置倒计时起点
  await baseImage()
  loading.value = false
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
    <div v-for="block in row" :key="block.pos" relative m="1px">
      <img
        object-fill
        w-auto
        flex="~"
        items-center
        justify-center
        border-box
        :title="block.pos"
        border="0.5 gray-400/10"
        class="bg-gray-500/10 hover:bg-gray-500/20" :class="[
          block?.animateY ? 'animate-shake-y' : '',
          block?.animateX ? 'animate-shake-x' : '',
        ]"
        :src="block?.url"
        :style="sizeStyle"
        @click="movepic(block)"
      >
      <div
        v-show="block.pos !== emptyFlag && nightMode"
        absolute
        class="w-100% h-100%" :class="[currentPos === block.pos && 'animate']"
        z-10
        left-0
        top-0
        bg-dark
        @click="openBlock(block)"
      />
      <div
        v-show="mode === 'cheat'"
        absolute
        class="left-50% top-50% translate--50%"
        text-2xl
        font-bold
        z-20
        @click="openBlock(block)"
      >
        {{ block.pos === emptyFlag ? "" : block.pos }}
      </div>
    </div>
  </div>
  <img
    :class="preview ? 'h62 top-0 left-50% translate-x--50%' : 'w20 top-15 right-1'"
    absolute
    border-rd-2
    :src="base64"
    alt="原图"
    @click="preview = !preview"
  >
  <button btn m-t-5 @click="modelChange">
    Cheat Model
  </button>
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
