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
  status,
  steps,
  view3d,
  win,
} from '../config'
import { emptyFlag, emptyPos, isWin } from '../pic'
import { updateRank } from '../request'

const { countDown } = defineProps<{
  countDown: number
}>()

const emits = defineEmits<{
  (e: 'win', payload: { steps: number, time: number }): void
}>()

type MoveDir = 'up' | 'down' | 'left' | 'right'

const undoStack = ref<MoveDir[]>([])
const redoStack = ref<MoveDir[]>([])
const hinted = ref<number | null>(null)
const currentPos = ref<number | null>(null)

const showNumbers = ref(false)

const boardRef = ref<HTMLElement | null>(null)
let touchStart: { x: number, y: number } | null = null

function togglePreview() {
  preview.value = !preview.value
}

function setBoardTilt(xRatio: number, yRatio: number) {
  const el = boardRef.value
  if (!el)
    return
  const rx = (10 - yRatio * 20).toFixed(2)
  const ry = (-12 + xRatio * 24).toFixed(2)
  el.style.setProperty('--rx', `${rx}deg`)
  el.style.setProperty('--ry', `${ry}deg`)
}

function onPointerMove(e: PointerEvent) {
  if (!view3d.value)
    return
  const el = boardRef.value
  if (!el)
    return
  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  if (Number.isFinite(x) && Number.isFinite(y))
    setBoardTilt(Math.max(0, Math.min(1, x)), Math.max(0, Math.min(1, y)))
}

function onPointerLeave() {
  if (!view3d.value)
    return
  setBoardTilt(0.5, 0.35)
}

watch(() => view3d.value, (v) => {
  if (v)
    setBoardTilt(0.5, 0.35)
})

function inverseDir(dir: MoveDir): MoveDir {
  switch (dir) {
    case 'up': return 'down'
    case 'down': return 'up'
    case 'left': return 'right'
    case 'right': return 'left'
  }
}

function findEmpty() {
  for (let y = 0; y < arrayPic.value.length; y++) {
    for (let x = 0; x < arrayPic.value[y].length; x++) {
      if (arrayPic.value[y][x].pos === emptyPos)
        return { x, y }
    }
  }
  return null
}

function swapBlocks(a: { x: number, y: number }, b: { x: number, y: number }) {
  const aBlock = arrayPic.value[a.y][a.x]
  const bBlock = arrayPic.value[b.y][b.x]

  const tempUrl = aBlock.url
  const tempPos = aBlock.pos
  aBlock.url = bBlock.url
  aBlock.pos = bBlock.pos
  bBlock.url = tempUrl
  bBlock.pos = tempPos

  const animateKey = a.x === b.x ? 'animateY' : 'animateX'
  aBlock[animateKey] = true
  bBlock[animateKey] = true
  setTimeout(() => {
    aBlock[animateKey] = false
    bBlock[animateKey] = false
  }, 140)
}

async function checkWin() {
  if (!isWin())
    return

  win.value = true
  rankList.value = await updateRank(countDown, steps.value, name.value, status.value, 'picture')
  emits('win', { steps: steps.value, time: countDown })
}

function moveEmpty(dir: MoveDir, options?: { record?: boolean, stepDelta?: number }) {
  const { record = true, stepDelta = 1 } = options ?? {}
  if (win.value)
    return false

  const empty = findEmpty()
  if (!empty)
    return false

  let target: { x: number, y: number } | null = null
  if (dir === 'up')
    target = empty.y > 0 ? { x: empty.x, y: empty.y - 1 } : null
  else if (dir === 'down')
    target = empty.y < n.value - 1 ? { x: empty.x, y: empty.y + 1 } : null
  else if (dir === 'left')
    target = empty.x > 0 ? { x: empty.x - 1, y: empty.y } : null
  else if (dir === 'right')
    target = empty.x < n.value - 1 ? { x: empty.x + 1, y: empty.y } : null

  if (!target)
    return false

  swapBlocks(empty, target)
  if (stepDelta !== 0)
    steps.value = Math.max(0, steps.value + stepDelta)

  if (record) {
    undoStack.value.push(dir)
    redoStack.value = []
  }

  void checkWin()
  return true
}

function moveTile(block: PictureBlock) {
  if (!block || block.pos === emptyPos || win.value)
    return

  const empty = findEmpty()
  if (!empty)
    return

  const dx = block.x - empty.x
  const dy = block.y - empty.y
  if (Math.abs(dx) + Math.abs(dy) !== 1)
    return

  const dir: MoveDir = dx === 1 ? 'right' : dx === -1 ? 'left' : dy === 1 ? 'down' : 'up'
  moveEmpty(dir, { record: true, stepDelta: 1 })
}

const { width, height } = useWindowSize()
const sizeStyle = computed(() => {
  const size = n.value
  const padding = 32
  const reserved = 380
  const board = Math.max(220, Math.min(width.value - padding, height.value - reserved))
  const tile = Math.floor(board / size)
  return {
    width: `${tile}px`,
    height: `${tile}px`,
    margin: '3px',
    transition: loading.value ? 'none' : 'transform 0.18s ease',
  } as Record<string, string>
})

let timer: any = null
function openBlock(block: PictureBlock) {
  if (!nightMode.value) {
    moveTile(block)
    return
  }
  currentPos.value = block.pos
  clearTimeout(timer)
  timer = setTimeout(() => {
    moveTile(block)
    currentPos.value = null
  }, 450)
}

function undo() {
  const last = undoStack.value.pop()
  if (!last)
    return
  redoStack.value.push(last)
  moveEmpty(inverseDir(last), { record: false, stepDelta: -1 })
}

function redo() {
  const next = redoStack.value.pop()
  if (!next)
    return
  undoStack.value.push(next)
  moveEmpty(next, { record: false, stepDelta: 1 })
}

function manhattanScoreAfterMove(dir: MoveDir) {
  const size = n.value
  const total = size * size
  const flat = new Array<number>(total)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++)
      flat[x + y * size] = arrayPic.value[y][x].pos
  }

  const emptyIndex = flat.indexOf(emptyPos)
  const dx = dir === 'left' ? -1 : dir === 'right' ? 1 : 0
  const dy = dir === 'up' ? -1 : dir === 'down' ? 1 : 0
  const ex = emptyIndex % size
  const ey = Math.floor(emptyIndex / size)
  const nx = ex + dx
  const ny = ey + dy
  if (nx < 0 || nx >= size || ny < 0 || ny >= size)
    return Number.POSITIVE_INFINITY

  const nextIndex = nx + ny * size
  ;[flat[emptyIndex], flat[nextIndex]] = [flat[nextIndex], flat[emptyIndex]]

  let score = 0
  for (let i = 0; i < total; i++) {
    const v = flat[i]
    if (v === emptyPos)
      continue
    const x = i % size
    const y = Math.floor(i / size)
    const gx = v % size
    const gy = Math.floor(v / size)
    score += Math.abs(x - gx) + Math.abs(y - gy)
  }
  return score
}

function hint() {
  if (win.value)
    return

  const empty = findEmpty()
  if (!empty)
    return

  const dirs: MoveDir[] = ['up', 'down', 'left', 'right']
  let best: MoveDir | null = null
  let bestScore = Number.POSITIVE_INFINITY
  for (const d of dirs) {
    const s = manhattanScoreAfterMove(d)
    if (s < bestScore) {
      bestScore = s
      best = d
    }
  }

  if (!best || bestScore === Number.POSITIVE_INFINITY)
    return

  let target: { x: number, y: number } | null = null
  if (best === 'up')
    target = empty.y > 0 ? { x: empty.x, y: empty.y - 1 } : null
  else if (best === 'down')
    target = empty.y < n.value - 1 ? { x: empty.x, y: empty.y + 1 } : null
  else if (best === 'left')
    target = empty.x > 0 ? { x: empty.x - 1, y: empty.y } : null
  else if (best === 'right')
    target = empty.x < n.value - 1 ? { x: empty.x + 1, y: empty.y } : null

  if (!target)
    return

  hinted.value = arrayPic.value[target.y][target.x].pos
  setTimeout(() => {
    hinted.value = null
  }, 900)
}

defineExpose({
  undo,
  redo,
  hint,
  toggleNumbers: () => (showNumbers.value = !showNumbers.value),
})

watch(() => arrayPic.value, () => {
  undoStack.value = []
  redoStack.value = []
  hinted.value = null
  currentPos.value = null
}, { deep: false })

useEventListener(window, 'keydown', (e: KeyboardEvent) => {
  const target = e.target as HTMLElement | null
  if (target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable))
    return
  if (document.querySelector('.rank-overlay') || document.querySelector('.overlay'))
    return

  const key = e.key.toLowerCase()
  const map: Record<string, MoveDir> = {
    arrowup: 'up',
    arrowdown: 'down',
    arrowleft: 'left',
    arrowright: 'right',
    w: 'up',
    s: 'down',
    a: 'left',
    d: 'right',
  }
  if (!(key in map))
    return
  e.preventDefault()
  moveEmpty(map[key])
})

function onPointerDown(e: PointerEvent) {
  if (win.value)
    return
  touchStart = { x: e.clientX, y: e.clientY }
}

function onPointerUp(e: PointerEvent) {
  if (!touchStart || win.value)
    return
  const dx = e.clientX - touchStart.x
  const dy = e.clientY - touchStart.y
  touchStart = null

  const absX = Math.abs(dx)
  const absY = Math.abs(dy)
  if (Math.max(absX, absY) < 24)
    return

  const dir: MoveDir = absX > absY
    ? (dx > 0 ? 'right' : 'left')
    : (dy > 0 ? 'down' : 'up')

  moveEmpty(dir)
}
</script>

<template>
  <div
    ref="boardRef"
    class="board"
    :class="view3d ? 'is-3d' : ''"
    @pointerdown.passive="onPointerDown"
    @pointerup.passive="onPointerUp"
    @pointermove.passive="onPointerMove"
    @pointerleave.passive="onPointerLeave"
  >
    <div class="board-inner">
      <div v-for="(row, y) in arrayPic" :key="y" flex="~" items-center justify-center>
        <div
          v-for="block in row"
          :key="`${block.x}-${block.y}`"
          class="tile"
          :class="[
            block.pos === emptyPos ? 'tile-empty' : '',
            block?.animateY ? 'animate-shake-y' : '',
            block?.animateX ? 'animate-shake-x' : '',
            hinted === block.pos ? 'tile-hint' : '',
          ]"
          :style="sizeStyle"
          @click="openBlock(block)"
        >
          <img
            v-if="block.url !== emptyFlag"
            class="tile-img"
            :src="block.url"
            alt=""
            draggable="false"
          >
          <div v-else class="tile-empty-inner" />
          <div
            v-show="block.pos !== emptyPos && nightMode"
            class="tile-mask"
            :class="[currentPos === block.pos && 'animate']"
            @click.stop="openBlock(block)"
          />
          <div v-show="showNumbers && block.pos !== emptyPos" class="tile-number" @click.stop="openBlock(block)">
            {{ block.pos }}
          </div>
        </div>
      </div>
    </div>
  </div>

  <img
    class="preview"
    :class="preview ? 'preview-open' : 'preview-mini'"
    :src="base64"
    alt="Preview"
    @click="togglePreview()"
  >

  <Loading v-if="loading" />
</template>

<style scoped>
.board {
  width: max-content;
  margin: 0 auto;
  padding: 10px;
  border-radius: 18px;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.3));
  border: 1px solid rgba(120, 120, 120, 0.15);
  backdrop-filter: blur(10px);
  touch-action: manipulation;
  --rx: -10deg;
  --ry: 8deg;
}

html.dark .board {
  background: linear-gradient(180deg, rgba(20, 20, 20, 0.65), rgba(20, 20, 20, 0.35));
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.tile {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(120, 120, 120, 0.12);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.35);
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.08);
  user-select: none;
}

html.dark .tile {
  background: rgba(0, 0, 0, 0.2);
  box-shadow: 0 12px 22px rgba(0, 0, 0, 0.35);
}

.tile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.03);
}

.tile-empty {
  background: transparent;
  box-shadow: none;
  border: 1px dashed rgba(120, 120, 120, 0.18);
}

html.dark .tile-empty {
  border: 1px dashed rgba(255, 255, 255, 0.14);
}

.tile-empty-inner {
  width: 100%;
  height: 100%;
  background: radial-gradient(60% 60% at 50% 40%, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
}

.tile-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
}

.tile-number {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  font-weight: 800;
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 6px 16px rgba(0, 0, 0, 0.55);
}

.tile-hint {
  box-shadow: 0 0 0 2px rgba(255, 214, 10, 0.75), 0 14px 26px rgba(255, 214, 10, 0.15);
}

.board.is-3d {
  perspective: 1200px;
  perspective-origin: 50% 35%;
}

.board.is-3d .board-inner {
  transform-style: preserve-3d;
  transform: rotateX(var(--rx)) rotateY(var(--ry));
  transition: transform 120ms ease;
}

.board.is-3d .tile {
  --z: 14px;
  transform-style: preserve-3d;
  transform: translateZ(var(--z));
}

.board.is-3d .tile:hover {
  transform: translateZ(calc(var(--z) + 6px));
}

.board.is-3d .tile::before,
.board.is-3d .tile::after {
  content: "";
  position: absolute;
  pointer-events: none;
}

.board.is-3d .tile::before {
  left: 0;
  top: 100%;
  width: 100%;
  height: var(--z);
  background: rgba(0, 0, 0, 0.08);
  transform-origin: top;
  transform: rotateX(-90deg);
  filter: blur(0.2px);
}

.board.is-3d .tile::after {
  left: 100%;
  top: 0;
  width: var(--z);
  height: 100%;
  background: rgba(0, 0, 0, 0.06);
  transform-origin: left;
  transform: rotateY(90deg);
  filter: blur(0.2px);
}

.board.is-3d .tile-empty::before,
.board.is-3d .tile-empty::after {
  display: none;
}

.preview {
  position: fixed;
  right: 12px;
  top: 92px;
  border-radius: 14px;
  border: 1px solid rgba(120, 120, 120, 0.15);
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.16);
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 40;
}

.preview-mini {
  width: 92px;
  height: auto;
}

.preview-open {
  left: 50%;
  transform: translateX(-50%);
  right: auto;
  top: 64px;
  height: 260px;
  width: auto;
}

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
