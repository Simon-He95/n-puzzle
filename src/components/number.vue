<script setup lang="ts">
import type { NumberBlock } from '../type'
import { isDark } from '~/composables'
import {
  arrayNum,
  initData,
  n,
  name,
  nightMode,
  rankList,
  status,
  steps,
  win,
} from '../config'
import { updateRank } from '../request'

const { countDown } = defineProps<{
  countDown: number
}>()
const emits = defineEmits(['win'])
const emptyFlag = 0
const currentPos = ref('')
initData()

async function move(block: NumberBlock) {
  // 判断上下左右是否有空白格
  if (block.number === 0)
    return
  if (canMove(block)) {
    steps.value++
    // 判断胜利条件
    if (isWin()) {
      win.value = true
      rankList.value = await updateRank(countDown, steps.value, name.value, status.value, 'number')
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

function canMove(block: NumberBlock): boolean {
  const { x, y, number } = block
  if (y > 0 && arrayNum.value[y - 1][x].number === emptyFlag) {
    const temp = arrayNum.value[y - 1][x].number
    arrayNum.value[y - 1][x].number = number
    arrayNum.value[y][x].number = temp
    arrayNum.value[y][x].animateY = true
    arrayNum.value[y - 1][x].animateY = true
    setTimeout(() => {
      arrayNum.value[y - 1][x].animateY = false
      arrayNum.value[y][x].animateY = false
    }, 50)
    return true
  }
  if (y < n.value - 1 && arrayNum.value[y + 1][x].number === emptyFlag) {
    const temp = arrayNum.value[y + 1][x].number
    arrayNum.value[y + 1][x].number = number
    arrayNum.value[y][x].number = temp
    arrayNum.value[y][x].animateY = true
    arrayNum.value[y + 1][x].animateY = true
    setTimeout(() => {
      arrayNum.value[y + 1][x].animateY = false
      arrayNum.value[y][x].animateY = false
    }, 50)
    return true
  }
  if (x > 0 && arrayNum.value[y][x - 1].number === emptyFlag) {
    const temp = arrayNum.value[y][x - 1].number
    arrayNum.value[y][x - 1].number = number
    arrayNum.value[y][x].number = temp
    arrayNum.value[y][x].animateX = true
    arrayNum.value[y][x - 1].animateX = true
    setTimeout(() => {
      arrayNum.value[y][x - 1].animateX = false
      arrayNum.value[y][x].animateX = false
    }, 50)
    return true
  }
  if (x < n.value - 1 && arrayNum.value[y][x + 1].number === emptyFlag) {
    const temp = arrayNum.value[y][x + 1].number
    arrayNum.value[y][x + 1].number = number
    arrayNum.value[y][x].number = temp
    arrayNum.value[y][x].animateX = true
    arrayNum.value[y][x + 1].animateX = true
    setTimeout(() => {
      arrayNum.value[y][x + 1].animateX = false
      arrayNum.value[y][x].animateX = false
    }, 50)
    return true
  }
  return false
}

function isWin(): boolean {
  return arrayNum.value.every((row) => {
    return row.every((item) => {
      if (item.x === n.value - 1 && item.y === n.value - 1 && item.number === emptyFlag)
        return true

      return item.number === item.x + item.y * n.value + 1
    })
  })
}

const sizeStyle = computed(() => {
  const result: Record<string, string> = {}
  const availableHeight = window.innerHeight - 500 // 减去顶部内容的高度
  const baseSize = Math.min(window.innerWidth, availableHeight) / (n.value * 1.1) // 调整尺寸以避免滚动条

  result.width = `${baseSize}px`
  result.height = `${baseSize}px`
  result.margin = '2px' // 添加间距以保证美观
  return result
})
let timer = null
function openBlock(block: NumberBlock) {
  currentPos.value = block.number
  clearTimeout(timer)
  timer = setTimeout(() => {
    move(block)
    currentPos.value = ''
  }, 500)
}
</script>

<template>
  <div v-for="(row, y) in arrayNum" :key="y" flex="~" items-center justify-center w-max ma relative>
    <div
      v-for="block in row" :key="block.number" flex="~" items-center justify-center border-box m="1px"
      border="0.5 gray-400/10" class="bg-gray-500/10 hover:bg-gray-500/20" relative :style="sizeStyle" :class="[
        block?.animateY ? 'animate-shake-y' : '',
        block?.animateX ? 'animate-shake-x' : '',
      ]" @click.prevent="move(block)"
    >
      {{ block.number === emptyFlag ? "" : block.number }}
      <div
        v-show="block.number !== emptyFlag && nightMode" absolute class="w-100% h-100%" :class="[
          currentPos === block.number && 'animate',
          isDark ? 'bg-white' : 'bg-dark-400',
        ]" z-50 left-0 top-0 @click.stop="openBlock(block)"
      />
    </div>
  </div>
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

  .puzzle-grid {
    display: grid;
    gap: 4px;
    justify-content: center;
    align-items: center;
  }

  .puzzle-block {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1.5rem;
    transition: transform 0.2s ease, background-color 0.2s ease;
    cursor: pointer;
  }

  .puzzle-block:hover {
    transform: scale(1.05);
    background-color: rgba(100, 100, 100, 0.2);
  }

  .puzzle-block.empty {
    background-color: transparent;
    cursor: default;
  }

  @keyframes shake {

    0%,
    100% {
      transform: translateX(0);
    }

    50% {
      transform: translateX(-5px);
    }
  }

  .animate-shake-x {
    animation: shake 0.3s ease;
  }

  .animate-shake-y {
    animation: shake 0.3s ease;
  }
</style>
