<script setup lang="ts">
import { isDark, toggleDark } from '~/composables'
import { model, nightMode, preview } from '../config'

function changeModel() {
  preview.value = false
  if (model.value === 'number')
    model.value = 'picture'
  else
    model.value = 'number'
}
</script>

<template>
  <nav text-xl p-y-10 inline-flex gap-12 items-center>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      role="img"
      width="1em"
      height="1em"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 1200 1200"
      @click="nightMode = !nightMode"
    >
      <path
        fill="currentColor"
        d="M385.312 0c-65.813 0-119.166 53.352-119.166 119.166c0 65.813 53.353 119.166 119.166 119.166c65.814 0 119.167-53.353 119.167-119.166C504.479 53.352 451.126 0 385.312 0zm-99.026 299.713L158.228 472.611c-5.122 6.829-7.676 14.053-7.676 21.736L135.2 636.503c-6.928 62.019 81.763 76.349 92.188 8.968l12.806-131.897l33.288-44.802l1.292 185.666l-62.737 225.338l-160.055 203.603c-46.537 72.435 49.647 126.372 98.572 69.158L317.03 938.676c4.471-6.019 7.239-14.069 10.222-21.736l49.97-176.736l112.67 126.766l61.445 286.87c16.961 76.578 134.751 50.207 120.382-23.065L606.446 832.42c-1.555-7.685-3.242-16.207-10.222-21.774L457.943 653.137V458.501l53.77 67.867c5.976 7.683 14.953 13.229 26.903 16.644l126.767 24.32l469.914 618.482c8.392 11.667 32.137.041 23.065-15.353L720.44 568.598c51.496-17.263 23.699-75.92-10.26-81.964l-135.733-26.866l-139.573-175.446c-44.207-43.902-118.137-33.112-148.54 15.352l-.048.039z"
      />
    </svg>
    <button text-2xl @click="changeModel()">
      <svg
        v-show="model === 'number'"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        style="vertical-align: -0.125em"
        width="1em"
        height="1em"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 36 36"
      >
        <path
          fill="currentColor"
          d="M30 13.5A7.48 7.48 0 0 1 22.78 4H4a2 2 0 0 0-2 2v24a2 2 0 0 0 2 2h28a2 2 0 0 0 2-2V12.34a7.46 7.46 0 0 1-4 1.16ZM8.92 8a3 3 0 1 1-3 3a3 3 0 0 1 3-3ZM6 27v-4.1l6-6.08a1 1 0 0 1 1.41 0L16 19.35L8.32 27Zm24 0H11.15l6.23-6.23l5.4-5.4a1 1 0 0 1 1.41 0L30 21.18Z"
          class="clr-i-solid--badged clr-i-solid-path-1--badged"
        />
        <circle
          cx="30"
          cy="6"
          r="5"
          fill="currentColor"
          class="clr-i-solid--badged clr-i-solid-path-2--badged clr-i-badge"
        />
        <path fill="none" d="M0 0h36v36H0z" />
      </svg>
      <svg
        v-show="model === 'picture'"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        role="img"
        style="vertical-align: -0.125em"
        width="1em"
        height="1em"
        preserveAspectRatio="xMidYMid meet"
        viewBox="0 0 32 32"
      >
        <path
          fill="currentColor"
          d="M28 9h-6v2h6v4h-4v2h4v4h-6v2h6a2.003 2.003 0 0 0 2-2V11a2.002 2.002 0 0 0-2-2zm-8 14h-8v-6a2.002 2.002 0 0 1 2-2h4v-4h-6V9h6a2.002 2.002 0 0 1 2 2v4a2.002 2.002 0 0 1-2 2h-4v4h6zm-17.5-.5v-1h3v-11h-3v-1h4v12h3v1h-7z"
        />
        <path fill="currentColor" d="M6 10v12v-12m1-1H2v2h3v10H2v2h8v-2H7V9Z" />
      </svg>
    </button>

    <button class="icon-btn !outline-none" @click="toggleDark()">
      <div v-if="isDark" i-carbon-moon />
      <div v-else i-carbon-sun />
    </button>

    <a
      class="icon-btn"
      i-carbon-logo-github
      rel="noreferrer"
      href="https://github.com/Simon-He95/n-puzzle"
      target="_blank"
      title="GitHub"
    />
  </nav>
</template>
