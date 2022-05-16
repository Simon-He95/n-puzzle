<script setup lang="ts">
import { GameStaus, NumberBlock } from "../type";
import { win, steps, start, rankList, name, n, array } from "../config";
import { updateRank } from "../request";

let { status, countDown } = defineProps<{
  status: GameStaus;
  countDown: number;
}>();
const collect: number[] = [];
const numbers: number[] = [];
const emptyFlag = 0;
array.value = initData();
const count = $ref(0);
isFresh();

function initData() {
  for (let i = 1; i < n.value * n.value; i++) {
    numbers.push(i);
  }
  return Array.from({ length: n.value }, (_, y) =>
    Array.from({ length: n.value }, (_, x) => {
      let number = 0;
      if (x !== 0 || y !== 0) {
        number = randomNumbers();
        collect.push(number);
      }
      return {
        number,
        x: x,
        y: y,
        animateX: false,
        animateY: false,
      };
    })
  );
}

function reset() {
  win.value = false;
  start.value = Date.now();
  steps.value = 0;
  array.value = initData();
  isFresh();
}

function randomNumbers() {
  return numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0];
}
async function move(block: NumberBlock) {
  // 判断上下左右是否有空白格
  if (block.number === 0) return;
  if (canMove(block)) {
    steps.value++;
    // 判断胜利条件
    if (isWin()) {
      win.value = true;
      rankList.value = await updateRank(countDown, steps.value, name.value, status);

      alert(
        `Congratulations! You make it! Proud of you！ Check the rankings from the button on the upper right corner. `
      );
    }
  } else {
    // alert("改数字不能被交换");
  }
}

// 判断此题是否有解
function isFresh() {
  let inverse = 0;
  const preNumber: number[] = [];
  const odd = (n.value & 1) === 1;
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
    reset();
  } else if (!odd && (inverse & 1) === 0) {
    // 无解重新生成
    reset();
  }
}

function canMove(block: NumberBlock): Boolean {
  const { x, y, number } = block;
  if (y > 0 && array.value[y - 1][x].number === emptyFlag) {
    const temp = array.value[y - 1][x].number;
    array.value[y - 1][x].number = number;
    array.value[y][x].number = temp;
    array.value[y][x].animateY = true;
    array.value[y - 1][x].animateY = true;
    setTimeout(() => {
      array.value[y - 1][x].animateY = false;
      array.value[y][x].animateY = false;
    }, 50);
    return true;
  }
  if (y < n.value - 1 && array.value[y + 1][x].number === emptyFlag) {
    const temp = array.value[y + 1][x].number;
    array.value[y + 1][x].number = number;
    array.value[y][x].number = temp;
    array.value[y][x].animateY = true;
    array.value[y + 1][x].animateY = true;
    setTimeout(() => {
      array.value[y + 1][x].animateY = false;
      array.value[y][x].animateY = false;
    }, 50);
    return true;
  }
  if (x > 0 && array.value[y][x - 1].number === emptyFlag) {
    const temp = array.value[y][x - 1].number;
    array.value[y][x - 1].number = number;
    array.value[y][x].number = temp;
    array.value[y][x].animateX = true;
    array.value[y][x - 1].animateX = true;
    setTimeout(() => {
      array.value[y][x - 1].animateX = false;
      array.value[y][x].animateX = false;
    }, 50);
    return true;
  }
  if (x < n.value - 1 && array.value[y][x + 1].number === emptyFlag) {
    const temp = array.value[y][x + 1].number;
    array.value[y][x + 1].number = number;
    array.value[y][x].number = temp;
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

function isWin(): Boolean {
  return array.value.every((row) => {
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
  if (status === "Easy") {
    result["min-width"] = "5.75rem";
    result["min-height"] = "5.75rem";
  } else if (status === "Medium") {
    result["min-width"] = "4rem";
    result["min-height"] = "4rem";
  } else if (status === "Hard") {
    result["min-width"] = "3.25rem";
    result["min-height"] = "3.25rem";
  } else if (status === "Evil") {
    result["min-width"] = "2.75rem";
    result["min-height"] = "2.75rem";
  }
  return result;
}

defineExpose({
  reset,
});
</script>

<template>
  <div v-for="(row, y) in array" :key="y" flex="~" items-center justify-center w-max ma>
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
