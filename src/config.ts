import type { GameStaus } from './type'
import { ref } from 'vue'
import { setData } from './request'

export const name = ref<string>('')
export const win = ref<boolean>(false)
export const steps = ref<number>(0)
export const start = ref(Date.now())
export const rankList = ref<any[]>([])
export const n = ref<number>(3)
export const model = ref<'number' | 'picture'>('number')
export const arrayNum = ref<any[]>([])
export const arrayPic = ref<any[]>([])
export const base64 = ref('')
export const loading = ref(true)
export const ratio = ref('1.5')
export const preview = ref(false)
export const currentImage = ref(0)
export const status = ref<GameStaus>('Easy')
export const nightMode = ref(false)
export const view3d = ref(false)

export async function picReset() {
  win.value = false
  start.value = Date.now()
  steps.value = 0
  await setData()
}

export function numReset() {
  win.value = false
  start.value = Date.now()
  steps.value = 0
  initData()
}

export function initData() {
  const size = n.value
  const total = size * size
  const flat = Array.from({ length: total }, (_, i) => (i === total - 1 ? 0 : i + 1))
  const scrambled = scrambleFlat(flat, size)

  arrayNum.value = Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => ({
      number: scrambled[x + y * size],
      x,
      y,
      animateX: false,
      animateY: false,
    })))
}

function neighborIndices(index: number, size: number) {
  const x = index % size
  const y = Math.floor(index / size)
  const result: number[] = []
  if (y > 0)
    result.push(index - size)
  if (y < size - 1)
    result.push(index + size)
  if (x > 0)
    result.push(index - 1)
  if (x < size - 1)
    result.push(index + 1)
  return result
}

function isSolvedFlat(flat: number[]) {
  const last = flat.length - 1
  for (let i = 0; i < last; i++) {
    if (flat[i] !== i + 1)
      return false
  }
  return flat[last] === 0
}

function scrambleFlat(flat: number[], size: number): number[] {
  const total = flat.length
  const steps = Math.max(60, total * size * 2)
  let emptyIndex = total - 1
  let prevEmptyIndex = -1

  for (let i = 0; i < steps; i++) {
    const candidates = neighborIndices(emptyIndex, size).filter(i => i !== prevEmptyIndex)
    const nextIndex = candidates[Math.floor(Math.random() * candidates.length)]
    ;[flat[emptyIndex], flat[nextIndex]] = [flat[nextIndex], flat[emptyIndex]]
    prevEmptyIndex = emptyIndex
    emptyIndex = nextIndex
  }

  if (isSolvedFlat(flat))
    return scrambleFlat(flat, size)

  return flat
}
