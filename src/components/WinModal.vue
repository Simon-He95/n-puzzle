<script setup lang="ts">
import type { GameStaus } from '../type'

const props = defineProps<{
  open: boolean
  mode: 'number' | 'picture'
  difficulty: GameStaus
  size: number
  time: number
  steps: number
  best?: { time: number, steps: number }
  newBest?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'again'): void
  (e: 'rank'): void
}>()

const isNewBest = computed(() => props.newBest ?? false)
</script>

<template>
  <div v-if="open" class="overlay" @click.self="emit('close')">
    <div class="modal">
      <div class="title">
        <div class="badge">
          <div i-carbon-trophy />
        </div>
        <div>
          <div class="h">
            胜利！
          </div>
          <div class="sub">
            {{ difficulty }} · {{ size }}×{{ size }} · {{ mode === 'number' ? '数字拼图' : '图片拼图' }}
          </div>
        </div>
      </div>

      <div class="grid">
        <div class="cell">
          <div class="k">
            用时
          </div>
          <div class="v">
            {{ time }}s
          </div>
        </div>
        <div class="cell">
          <div class="k">
            步数
          </div>
          <div class="v">
            {{ steps }}
          </div>
        </div>
        <div class="cell">
          <div class="k">
            最佳
          </div>
          <div class="v">
            <span v-if="best">{{ best.steps }}步 / {{ best.time }}s</span>
            <span v-else>-</span>
          </div>
        </div>
      </div>

      <div v-if="isNewBest" class="newbest">
        <div i-carbon-badge />
        新纪录！
      </div>

      <div class="actions">
        <button btn class="!px-4" @click="emit('again')">
          再来一局
        </button>
        <button btn class="!px-4" @click="emit('rank')">
          查看排行榜
        </button>
        <button class="ghost" @click="emit('close')">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.modal {
  width: min(560px, 100%);
  border-radius: 22px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.65));
  backdrop-filter: blur(12px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.25);
}

html.dark .modal {
  background: linear-gradient(180deg, rgba(20, 20, 20, 0.9), rgba(20, 20, 20, 0.6));
}

.title {
  display: flex;
  gap: 12px;
  align-items: center;
}

.badge {
  width: 42px;
  height: 42px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #2dd4bf, #22d3ee);
  color: white;
}

.h {
  font-weight: 900;
  font-size: 1.4rem;
}

.sub {
  opacity: 0.75;
  margin-top: 2px;
  font-weight: 600;
}

.grid {
  margin-top: 14px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.cell {
  border-radius: 16px;
  padding: 10px 12px;
  border: 1px solid rgba(120, 120, 120, 0.14);
  background: rgba(255, 255, 255, 0.35);
}

html.dark .cell {
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.k {
  opacity: 0.75;
  font-weight: 700;
}

.v {
  margin-top: 6px;
  font-weight: 900;
}

.newbest {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 16px;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  color: #7c3aed;
  background: rgba(124, 58, 237, 0.1);
  border: 1px solid rgba(124, 58, 237, 0.25);
  font-weight: 800;
}

.actions {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.ghost {
  padding: 8px 14px;
  border-radius: 14px;
  border: 1px solid rgba(120, 120, 120, 0.18);
  background: transparent;
  opacity: 0.85;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.ghost:hover {
  opacity: 1;
  transform: translateY(-1px);
}

@media (max-width: 560px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
