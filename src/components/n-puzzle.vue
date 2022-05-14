<script setup lang="ts">
let n = $ref<number>(3);
const numbers: number[] = [];
const step = $ref(0);
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
  step = 0;
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
    step++;

    // 判断胜利条件
    if (isWin()) {
      win = true;
      alert(`you win！ cost: ${countDown}s, step: ${step}`);
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
      if (n === 4) return;
      n = 4;
      rest();
      return;
    case "hard":
      if (n === 5) return;
      n = 5;
      rest();
      return;
    case "evil":
      if (n === 6) return;
      n = 6;
      rest();
      return;
  }
}
</script>

<template>
  <div font-sans p="t-10" text="center gray-700 dark:gray-200">
    <p text-3xl><Typing interval="100">n puzzle</Typing></p>
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
      {{ step }}
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
          min-w-15
          min-h-15
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
