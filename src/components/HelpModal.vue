<script setup lang="ts">
defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div v-if="open" class="overlay" @click.self="emit('close')">
    <div class="modal">
      <div class="title">
        <div class="badge">
          <div i-carbon-help />
        </div>
        <div>
          <div class="h">
            怎么玩
          </div>
          <div class="sub">
            目标：按正确顺序拼回去（空格在右下角）
          </div>
        </div>
      </div>

      <div class="content">
        <div class="item">
          <div class="k">
            操作
          </div>
          <div class="v">
            点击相邻方块 / 触屏滑动 / 键盘 WASD 或方向键
          </div>
        </div>
        <div class="item">
          <div class="k">
            进阶
          </div>
          <div class="v">
            撤销/重做、提示（会高亮更“划算”的一步）
          </div>
        </div>
        <div class="item">
          <div class="k">
            3D 模式
          </div>
          <div class="v">
            开启后棋盘会有透视与立体方块，鼠标在棋盘上移动会轻微转动视角
          </div>
        </div>
        <div class="item">
          <div class="k">
            迷雾
          </div>
          <div class="v">
            开启后先“翻开”再移动，更考记忆
          </div>
        </div>
        <div class="item">
          <div class="k">
            图片模式
          </div>
          <div class="v">
            右上角小图可预览原图；可切换显示编号
          </div>
        </div>
        <div class="item">
          <div class="k">
            成绩
          </div>
          <div class="v">
            本地保存“最佳”；排行榜按步数优先，其次用时
          </div>
        </div>
      </div>

      <div class="actions">
        <button btn class="!px-4" @click="emit('close')">
          我知道了
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
  width: min(620px, 100%);
  border-radius: 22px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.65));
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
  background: linear-gradient(180deg, rgba(124, 58, 237, 0.9), rgba(34, 211, 238, 0.85));
  color: white;
}

.h {
  font-weight: 900;
  font-size: 1.2rem;
}

.sub {
  opacity: 0.75;
  margin-top: 2px;
  font-weight: 600;
}

.content {
  margin-top: 12px;
  display: grid;
  gap: 10px;
}

.item {
  border-radius: 16px;
  padding: 10px 12px;
  border: 1px solid rgba(120, 120, 120, 0.14);
  background: rgba(255, 255, 255, 0.35);
}

html.dark .item {
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.k {
  opacity: 0.75;
  font-weight: 800;
}

.v {
  margin-top: 6px;
  font-weight: 650;
  opacity: 0.95;
  line-height: 1.4;
}

.actions {
  margin-top: 14px;
  display: flex;
  justify-content: center;
}
</style>
