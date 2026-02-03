<script setup lang="ts">
import { name } from '../config'

const props = defineProps<{
  show: boolean
  close: () => void
}>()

const error = ref('')
const shake = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

function submit() {
  const trimmed = name.value.trim()
  if (!trimmed) {
    error.value = '请输入昵称再开始'
    shake.value = true
    setTimeout(() => (shake.value = false), 260)
    inputRef.value?.focus()
    return
  }
  name.value = trimmed
  error.value = ''
  props.close()
}

watch(() => props.show, async (v) => {
  if (!v)
    return
  await nextTick()
  inputRef.value?.focus()
})
</script>

<template>
  <div v-show="show" class="intro" role="dialog" aria-modal="true">
    <div class="backdrop" />
    <div class="bg" aria-hidden="true" />

    <div class="card" :class="shake ? 'shake' : ''">
      <div class="brand">
        <div class="logo">
          <div i-carbon-cube />
        </div>
        <div>
          <div class="title">
            N PUZZLE
          </div>
          <div class="subtitle">
            拼图 · 竞速 · 排行榜
          </div>
        </div>
      </div>

      <div class="desc">
        请输入昵称开始游戏。昵称将用于排行榜（步数优先，其次用时）。
      </div>

      <div class="chips">
        <div class="chip">
          <div i-carbon-keyboard />
          键盘
        </div>
        <div class="chip">
          <div i-carbon-touch-1 />
          触屏
        </div>
        <div class="chip">
          <div i-carbon-undo />
          撤销
        </div>
        <div class="chip">
          <div i-carbon-cube-view />
          3D
        </div>
      </div>

      <div class="field">
        <label class="label">昵称</label>
        <div class="input" :class="error ? 'error' : ''">
          <div class="icon">
            <div i-carbon-user-avatar />
          </div>
          <input
            ref="inputRef"
            v-model="name"
            class="control"
            type="text"
            placeholder="例如：Simon"
            autocomplete="nickname"
            maxlength="16"
            @keydown.enter.prevent="submit()"
          >
        </div>
        <div v-if="error" class="error-text">
          {{ error }}
        </div>
      </div>

      <div class="actions">
        <button class="start" type="button" @click="submit()">
          <div i-carbon-play-filled />
          开始游戏
        </button>
      </div>

      <div class="hint">
        Tip：按 Enter 也可以开始
      </div>
    </div>
  </div>
</template>

<style scoped>
.intro {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: grid;
  place-items: center;
  padding: 18px;
}

.backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
}

.bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(1000px 600px at 18% -10%, rgba(45, 212, 191, 0.28), rgba(45, 212, 191, 0)),
    radial-gradient(900px 520px at 100% 0%, rgba(34, 211, 238, 0.22), rgba(34, 211, 238, 0)),
    radial-gradient(900px 520px at 10% 110%, rgba(124, 58, 237, 0.16), rgba(124, 58, 237, 0)),
    url("/cover.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  filter: blur(10px) saturate(1.1);
  transform: scale(1.04);
  opacity: 0.95;
}

.card {
  position: relative;
  width: min(520px, 100%);
  border-radius: 24px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.86), rgba(255, 255, 255, 0.62));
  backdrop-filter: blur(14px);
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.28);
}

html.dark .card {
  background: linear-gradient(180deg, rgba(20, 20, 20, 0.9), rgba(20, 20, 20, 0.62));
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 46px;
  height: 46px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(45, 212, 191, 0.95), rgba(34, 211, 238, 0.9));
  color: rgba(15, 23, 42, 0.92);
}

html.dark .logo {
  color: rgba(226, 232, 240, 0.95);
  background: linear-gradient(180deg, rgba(45, 212, 191, 0.25), rgba(34, 211, 238, 0.18));
}

.title {
  font-weight: 900;
  font-size: 1.4rem;
  letter-spacing: 0.06em;
}

.subtitle {
  margin-top: 2px;
  opacity: 0.75;
  font-weight: 700;
}

.desc {
  margin-top: 12px;
  line-height: 1.5;
  opacity: 0.9;
  font-weight: 650;
}

.chips {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 999px;
  border: 1px solid rgba(120, 120, 120, 0.14);
  background: rgba(255, 255, 255, 0.35);
  font-weight: 800;
  opacity: 0.9;
}

html.dark .chip {
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.field {
  margin-top: 14px;
}

.label {
  display: block;
  font-weight: 800;
  opacity: 0.85;
  margin-bottom: 8px;
}

.input {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 18px;
  border: 1px solid rgba(120, 120, 120, 0.16);
  background: rgba(255, 255, 255, 0.5);
}

html.dark .input {
  background: rgba(0, 0, 0, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.input.error {
  border: 1px solid rgba(239, 68, 68, 0.65);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12);
}

.icon {
  width: 34px;
  height: 34px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.45);
  border: 1px solid rgba(120, 120, 120, 0.12);
  opacity: 0.95;
}

html.dark .icon {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.control {
  flex: 1;
  outline: none;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 750;
  color: inherit;
}

.control::placeholder {
  opacity: 0.55;
  font-weight: 650;
}

.error-text {
  margin-top: 8px;
  color: rgba(239, 68, 68, 0.92);
  font-weight: 800;
}

.actions {
  margin-top: 14px;
  display: flex;
  justify-content: center;
}

.start {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border-radius: 18px;
  border: none;
  cursor: pointer;
  font-weight: 900;
  background: linear-gradient(180deg, rgba(45, 212, 191, 0.95), rgba(34, 211, 238, 0.92));
  color: rgba(15, 23, 42, 0.92);
  box-shadow: 0 14px 30px rgba(34, 211, 238, 0.18), 0 18px 40px rgba(0, 0, 0, 0.12);
  transition: transform 0.15s ease, opacity 0.15s ease;
}

html.dark .start {
  color: rgba(226, 232, 240, 0.95);
  background: linear-gradient(180deg, rgba(45, 212, 191, 0.25), rgba(34, 211, 238, 0.18));
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.start:hover {
  transform: translateY(-1px);
  opacity: 0.97;
}

.hint {
  margin-top: 10px;
  text-align: center;
  opacity: 0.7;
  font-weight: 650;
  font-size: 0.9rem;
}

.shake {
  animation: shake 0.26s ease-in-out;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-6px);
  }
  75% {
    transform: translateX(6px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .shake {
    animation: none;
  }
  .start {
    transition: none;
  }
}
</style>
