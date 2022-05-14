<script setup lang="ts">
let n = $ref<number>(3);
const numbers: number[] = [];
type Block = {
  number: undefined | number;
  x: number;
  y: number;
};

for (let i = 1; i < n * n; i++) {
  numbers.push(i);
}
let array = $ref<Block>(
  Array.from({ length: n }, (_, y) =>
    Array.from({ length: n }, (_, x) => {
      return {
        number: x === 0 && y === 0 ? undefined : randomNumbers(),
        x: x,
        y: y,
      };
    })
  )
);

function rest() {
  for (let i = 1; i < n * n; i++) {
    numbers.push(i);
  }
  array = Array.from({ length: n }, (_, y) =>
    Array.from({ length: n }, (_, x) => {
      return {
        number: x === 0 && y === 0 ? undefined : randomNumbers(),
        x: x,
        y: y,
      };
    })
  );
}

function randomNumbers() {
  return numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0];
}

function move(block: Block) {
  // 判断上下左右是否有空白格
  if (!block.number) return;
  if (canMove(block)) {
    // 判断胜利条件
    if (isWin()) {
      setTimeout(() => {
        alert("恭喜你，你赢了！");
      });
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

function newGame(difficulty: "easy" | "medium" | "hard") {
  switch (difficulty) {
    case "easy":
      n = 3;
      rest();

      return;
    case "medium":
      n = 4;
      rest();
      return;
    case "hard":
      n = 5;
      rest();
      return;
  }
}
</script>

<template>
  <div font-sans p="y-10" text="center gray-700 dark:gray-200">
    <h1>n puzzle</h1>
    {{ n }} x {{ n }}
    <div flex="~ gap-1" justify="center" p4>
      <button btn @click="rest()">New Game</button>
      <button btn @click="newGame('easy')">Easy</button>
      <button btn @click="newGame('medium')">Medium</button>
      <button btn @click="newGame('hard')">Hard</button>
    </div>
    <div w-full overflow-auto>
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
  </div>
</template>
