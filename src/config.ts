import { ref } from 'vue'
import { setData } from './request'
export const name = ref<string>('')
export const win = ref<boolean>(false)
export const steps = ref<number>(0)
export const start = ref(Date.now());
export const rankList = ref<any[]>([])
export const n = ref<number>(3)
export const model = ref<string>('number')
export const arrayNum = ref<any[]>([])
export const arrayPic = ref<any[]>([])
export const base64 = ref("");
export const loading = ref(true)
export const ratio = ref('1.5')
export const preview = ref(false);
export const currentImage = ref(0)



export async function picReset() {
  win.value = false;
  start.value = Date.now();
  steps.value = 0;
  setData();
}

const collect: number[] = [];

export function numReset() {
  win.value = false;
  start.value = Date.now();
  steps.value = 0;
  initData();
}

export function initData() {
  const numbers: number[] = []
  for (let i = 1; i < n.value * n.value; i++) {
    numbers.push(i);
  }
  arrayNum.value = Array.from({ length: n.value }, (_, y) =>
    Array.from({ length: n.value }, (_, x) => {
      let number = 0;
      if (x !== 0 || y !== 0) {
        number = randomNumbers(numbers);
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
  isFresh();
}

function randomNumbers(numbers: number[]) {
  return numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0];
}

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
    numReset();
  } else if (!odd && (inverse & 1) === 0) {
    // 无解重新生成
    numReset();
  }
}

