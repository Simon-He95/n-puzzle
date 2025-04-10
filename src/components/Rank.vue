<script setup lang="ts">
const props = defineProps({
  rankList: {
    type: Array,
    default: () => [],
  },
  currentMode: {
    type: String,
    default: 'picture', // 默认显示图片模式排名
  },
})

// 添加响应式状态跟踪当前显示的排名类型
const activeMode = ref(props.currentMode)

// 过滤排名列表，只显示当前模式的排名
const filteredRankList = computed(() => {
  return props.rankList
})

// 切换排名模式
function toggleMode() {
  activeMode.value = activeMode.value === 'picture' ? 'number' : 'picture'
}
</script>

<template>
  <div class="rank-overlay" />
  <div class="rank-container">
    <h1 class="rank-title">
      {{ activeMode === 'picture' ? '图片拼图' : '数字拼图' }}排行榜
    </h1>

    <div class="rank-list">
      <div v-if="filteredRankList.length === 0" class="no-ranks">
        暂无排名数据
      </div>
      <div v-for="(rank, index) in filteredRankList" v-else :key="index" class="rank-item">
        <span class="rank-position">{{ index + 1 }}</span>
        <span class="rank-name">{{ rank.name }}</span>
        <span class="rank-score">分数: {{ rank.score }}</span>
        <span class="rank-steps">步数: {{ rank.steps }}</span>
      </div>
    </div>
    <!-- eslint-disable-next-line vue/require-explicit-emits -->
    <button class="back-button" @click="$emit('back')">
      返回
    </button>
  </div>
</template>

<style scoped>
.rank-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 500px;
}

.rank-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.rank-title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
}

.mode-toggle {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
  justify-content: center;
}

.mode-btn {
  padding: 0.5rem 1rem;
  background-color: #e9e9e9;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.mode-btn.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.rank-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.no-ranks {
  text-align: center;
  padding: 2rem;
  color: #777;
  font-style: italic;
}

.rank-item {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr 1fr;
  align-items: center;
  padding: 0.75rem;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.rank-position {
  font-weight: bold;
  color: #333;
  text-align: center;
}

.rank-name {
  color: #555;
  text-align: left;
  padding-left: 0.5rem;
}

.rank-score,
.rank-steps {
  color: #777;
  font-size: 0.9rem;
  text-align: center;
}

.back-button {
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.back-button:hover {
  background-color: #0056b3;
}

.toggle-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #28a745;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.toggle-button:hover {
  background-color: #218838;
}
</style>
