<script setup lang="ts">
import type { GameStaus } from '../type'
import {
  loading,
  model,
  n,
  name,
  nightMode,
  numReset,
  picReset,
  preview,
  rankList,
  start,
  status,
  steps,
  view3d,
  win,
} from '../config'
import { baseImage, getRankList } from '../request'

useStorage('playName', name)

const showName = ref(!name.value)
const showRank = ref(false)
const showWin = ref(false)
const showHelp = ref(false)
const finishTime = ref<number | null>(null)
const winPayload = ref<{ time: number, steps: number } | null>(null)
const newBest = ref(false)

const bestRecords = useStorage<Record<string, { time: number, steps: number }>>('bestRecords', {})
const bestKey = computed(() => `${model.value}:${status.value}:${n.value}`)
const best = computed(() => bestRecords.value[bestKey.value])

start.value = Date.now()

function closeName() {
  showName.value = false
  start.value = Date.now()
}

function closePanels() {
  showRank.value = false
  preview.value = false
}

const now = useNow()
const countDown = computed(() => {
  if (finishTime.value)
    return Math.round((finishTime.value - start.value) / 1000)
  return Math.round((+now.value - start.value) / 1000)
})

async function reset() {
  closePanels()
  showHelp.value = false
  finishTime.value = null
  win.value = false
  showWin.value = false
  winPayload.value = null
  newBest.value = false

  if (model.value === 'number')
    numReset()
  else
    await picReset()

  start.value = Date.now()
}

function sizeByDifficulty(difficulty: GameStaus) {
  switch (difficulty) {
    case 'Easy': return 3
    case 'Medium': return 5
    case 'Hard': return 6
    case 'Evil': return 8
  }
}

async function newGame(difficulty: GameStaus) {
  status.value = difficulty
  n.value = sizeByDifficulty(difficulty)
  await reset()
}

async function changePicture() {
  closePanels()
  showHelp.value = false
  loading.value = true
  win.value = false
  showWin.value = false
  finishTime.value = null
  steps.value = 0
  await baseImage()
  start.value = Date.now()
  loading.value = false
}

async function toggleRank() {
  if (showRank.value) {
    showRank.value = false
    return
  }
  closePanels()
  showHelp.value = false
  showRank.value = true
  rankList.value = await getRankList(status.value, model.value)
}

const numberRef = ref<any>(null)
const pictureRef = ref<any>(null)
const activeBoard = computed(() => (model.value === 'number' ? numberRef.value : pictureRef.value))

function undo() {
  activeBoard.value?.undo?.()
}

function redo() {
  activeBoard.value?.redo?.()
}

function hint() {
  activeBoard.value?.hint?.()
}

function toggleNumbers() {
  pictureRef.value?.toggleNumbers?.()
}

function toggleFog() {
  nightMode.value = !nightMode.value
}

function toggle3d() {
  view3d.value = !view3d.value
}

function betterRecord(a: { time: number, steps: number }, b: { time: number, steps: number }) {
  if (a.steps !== b.steps)
    return a.steps < b.steps
  return a.time < b.time
}

function winHandler(payload: { time: number, steps: number }) {
  finishTime.value = Date.now()
  winPayload.value = payload
  showWin.value = true

  const key = bestKey.value
  const prev = bestRecords.value[key]
  newBest.value = !prev || betterRecord(payload, prev)
  if (newBest.value)
    bestRecords.value = { ...bestRecords.value, [key]: payload }
}

watch(() => model.value, () => {
  void reset()
})
</script>

<template>
  <information :show="showName" :close="closeName" />
  <WinModal
    :open="showWin"
    :mode="model"
    :difficulty="status"
    :size="n"
    :time="winPayload?.time ?? countDown"
    :steps="winPayload?.steps ?? steps"
    :best="best"
    :new-best="newBest"
    @close="showWin = false"
    @again="reset"
    @rank="toggleRank"
  />
  <HelpModal :open="showHelp" @close="showHelp = false" />

  <div class="shell" @click.self="closePanels">
    <div class="topbar">
      <button class="player" @click="showName = true">
        <span class="dot" />
        <span class="player-name">Hi, {{ name || 'Player' }}</span>
      </button>

      <div class="top-actions">
        <button class="icon" title="怎么玩" @click="showHelp = true">
          <div i-carbon-help />
        </button>
        <button class="icon" :title="view3d ? '关闭3D' : '开启3D'" @click="toggle3d()">
          <div i-carbon-cube-view />
        </button>
        <button class="icon" title="排行榜" @click="toggleRank()">
          <div i-carbon-trophy />
        </button>
        <button class="icon" :title="nightMode ? '关闭迷雾' : '开启迷雾'" @click="toggleFog()">
          <div v-if="nightMode" i-carbon-view />
          <div v-else i-carbon-view-off />
        </button>
        <button v-if="model === 'picture'" class="icon" title="显示/隐藏编号" @click="toggleNumbers()">
          <div i-carbon-list-numbered />
        </button>
      </div>
    </div>

    <Rank v-if="showRank" :current-mode="model" :rank-list="rankList" :difficulty="status" @back="showRank = false" />

    <div class="headline">
      <p text-3xl font-bold>
        <vivid-typing :interval="90" content="N PUZZLE" />
      </p>
      <div class="sub">
        {{ status }} · {{ n }}×{{ n }} · {{ model === 'number' ? '数字' : '图片' }}
      </div>
    </div>

    <div class="panel">
      <div class="stats">
        <div class="stat">
          <div class="k">
            <div i-carbon-timer /> 用时
          </div>
          <div class="v">
            {{ countDown }}s
          </div>
        </div>
        <div class="stat">
          <div class="k">
            <div i-carbon-movement /> 步数
          </div>
          <div class="v">
            {{ steps }}
          </div>
        </div>
        <div class="stat">
          <div class="k">
            <div i-carbon-badge /> 最佳
          </div>
          <div class="v">
            <span v-if="best">{{ best.steps }}步 / {{ best.time }}s</span>
            <span v-else>-</span>
          </div>
        </div>
      </div>

      <div class="controls">
        <div class="row">
          <button btn class="!px-3" :disabled="win" title="撤销" @click="undo()">
            <div i-carbon-undo />
          </button>
          <button btn class="!px-3" :disabled="win" title="重做" @click="redo()">
            <div i-carbon-redo />
          </button>
          <button btn class="!px-3" :disabled="win" title="提示" @click="hint()">
            <div i-carbon-idea />
          </button>

          <button v-if="model === 'picture'" btn class="!px-4" :disabled="loading" @click="changePicture()">
            New Pic
          </button>
          <button btn class="!px-4" :disabled="loading" @click="reset()">
            Reset
          </button>
        </div>

        <div class="row">
          <button btn :class="{ 'active-difficulty': status === 'Easy' }" @click="newGame('Easy')">
            Easy
          </button>
          <button btn :class="{ 'active-difficulty': status === 'Medium' }" @click="newGame('Medium')">
            Medium
          </button>
          <button btn :class="{ 'active-difficulty': status === 'Hard' }" @click="newGame('Hard')">
            Hard
          </button>
          <button v-if="model === 'number'" btn :class="{ 'active-difficulty': status === 'Evil' }" @click="newGame('Evil')">
            Evil
          </button>
        </div>
      </div>

      <div class="hintline">
        键盘：WASD/方向键 · 触屏：滑动 · 点击：移动相邻方块
      </div>
    </div>

    <div class="board-wrap" :style="{ 'pointer-events': win ? 'none' : '' }">
      <Number v-if="model === 'number'" ref="numberRef" :count-down="countDown" @win="winHandler" />
      <Picture v-else-if="model === 'picture'" ref="pictureRef" :count-down="countDown" @win="winHandler" />
    </div>
  </div>
</template>

<style scoped>
.shell {
  max-width: 980px;
  margin: 0 auto;
  padding: 16px 16px 40px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 18px;
  border: 1px solid rgba(120, 120, 120, 0.14);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.35));
  backdrop-filter: blur(10px);
}

html.dark .topbar {
  background: linear-gradient(180deg, rgba(20, 20, 20, 0.65), rgba(20, 20, 20, 0.35));
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.player {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 14px;
  border: 1px solid rgba(120, 120, 120, 0.12);
  background: rgba(255, 255, 255, 0.35);
}

html.dark .player {
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(180deg, #2dd4bf, #22d3ee);
  box-shadow: 0 6px 14px rgba(45, 212, 191, 0.25);
}

.player-name {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 700;
}

.top-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.icon {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  border: 1px solid rgba(120, 120, 120, 0.12);
  background: rgba(255, 255, 255, 0.35);
  color: rgba(15, 23, 42, 0.85);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease, opacity 0.15s ease;
}

html.dark .icon {
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(226, 232, 240, 0.92);
}

.icon:hover {
  transform: translateY(-1px);
}

.headline {
  margin-top: 18px;
  text-align: center;
}

.sub {
  margin-top: 6px;
  opacity: 0.75;
  font-weight: 600;
}

.panel {
  margin-top: 16px;
  padding: 14px;
  border-radius: 20px;
  border: 1px solid rgba(120, 120, 120, 0.14);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.65), rgba(255, 255, 255, 0.35));
  backdrop-filter: blur(10px);
}

html.dark .panel {
  background: linear-gradient(180deg, rgba(20, 20, 20, 0.65), rgba(20, 20, 20, 0.35));
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.stat {
  border-radius: 16px;
  padding: 10px 12px;
  border: 1px solid rgba(120, 120, 120, 0.12);
  background: rgba(255, 255, 255, 0.35);
}

html.dark .stat {
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.k {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  opacity: 0.8;
}

.v {
  margin-top: 6px;
  font-size: 1.2rem;
  font-weight: 900;
}

.controls {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.hintline {
  margin-top: 10px;
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.75;
}

.board-wrap {
  margin-top: 14px;
}

@media (max-width: 560px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
