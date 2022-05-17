<script setup lang="ts">
import { GameStaus, NumberBlock } from "../type";
import {
  win,
  steps,
  start,
  rankList,
  name,
  n,
  arrayNum,
  numReset,
  isFresh,
  initData,
  status,
} from "../config";
import { updateRank } from "../request";

let { countDown } = defineProps<{
  countDown: number;
}>();
const emptyFlag = 0;
initData();

async function move(block: NumberBlock) {
  // 判断上下左右是否有空白格
  if (block.number === 0) return;
  if (canMove(block)) {
    steps.value++;
    // 判断胜利条件
    if (isWin()) {
      win.value = true;
      rankList.value = await updateRank(countDown, steps.value, name.value, status.value);

      alert(
        `Congratulations! You make it! Proud of you！ Check the rankings from the button on the upper right corner. `
      );
    }
  } else {
    // alert("改数字不能被交换");
  }
}

function canMove(block: NumberBlock): Boolean {
  const { x, y, number } = block;
  if (y > 0 && arrayNum.value[y - 1][x].number === emptyFlag) {
    const temp = arrayNum.value[y - 1][x].number;
    arrayNum.value[y - 1][x].number = number;
    arrayNum.value[y][x].number = temp;
    arrayNum.value[y][x].animateY = true;
    arrayNum.value[y - 1][x].animateY = true;
    setTimeout(() => {
      arrayNum.value[y - 1][x].animateY = false;
      arrayNum.value[y][x].animateY = false;
    }, 50);
    return true;
  }
  if (y < n.value - 1 && arrayNum.value[y + 1][x].number === emptyFlag) {
    const temp = arrayNum.value[y + 1][x].number;
    arrayNum.value[y + 1][x].number = number;
    arrayNum.value[y][x].number = temp;
    arrayNum.value[y][x].animateY = true;
    arrayNum.value[y + 1][x].animateY = true;
    setTimeout(() => {
      arrayNum.value[y + 1][x].animateY = false;
      arrayNum.value[y][x].animateY = false;
    }, 50);
    return true;
  }
  if (x > 0 && arrayNum.value[y][x - 1].number === emptyFlag) {
    const temp = arrayNum.value[y][x - 1].number;
    arrayNum.value[y][x - 1].number = number;
    arrayNum.value[y][x].number = temp;
    arrayNum.value[y][x].animateX = true;
    arrayNum.value[y][x - 1].animateX = true;
    setTimeout(() => {
      arrayNum.value[y][x - 1].animateX = false;
      arrayNum.value[y][x].animateX = false;
    }, 50);
    return true;
  }
  if (x < n.value - 1 && arrayNum.value[y][x + 1].number === emptyFlag) {
    const temp = arrayNum.value[y][x + 1].number;
    arrayNum.value[y][x + 1].number = number;
    arrayNum.value[y][x].number = temp;
    arrayNum.value[y][x].animateX = true;
    arrayNum.value[y][x + 1].animateX = true;
    setTimeout(() => {
      arrayNum.value[y][x + 1].animateX = false;
      arrayNum.value[y][x].animateX = false;
    }, 50);
    return true;
  }
  return false;
}

function isWin(): Boolean {
  return arrayNum.value.every((row) => {
    return row.every((item) => {
      if (item.x === n.value - 1 && item.y === n.value - 1 && item.number === emptyFlag) {
        return true;
      }
      return item.number === item.x + item.y * n.value + 1;
    });
  });
}

function sizeStyle() {
  const result = {};
  if (status.value === "Easy") {
    result["min-width"] = "5.75rem";
    result["min-height"] = "5.75rem";
  } else if (status.value === "Medium") {
    result["min-width"] = "4rem";
    result["min-height"] = "4rem";
  } else if (status.value === "Hard") {
    result["min-width"] = "3.25rem";
    result["min-height"] = "3.25rem";
  } else if (status.value === "Evil") {
    result["min-width"] = "2.75rem";
    result["min-height"] = "2.75rem";
  }
  return result;
}
</script>

<template>
  <div
    v-for="(row, y) in arrayNum"
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
      m="1px"
      border="0.5 gray-400/10"
      class="bg-gray-500/10 hover:bg-gray-500/20"
      @click.prevent="move(block)"
      :style="sizeStyle()"
      :class="[
        block?.animateY ? 'animate-shake-y' : '',
        block?.animateX ? 'animate-shake-x' : '',
      ]"
    >
      {{ block.number === 0 ? "" : block.number }}
    </div>
  </div>
</template>

<style scoped></style>
