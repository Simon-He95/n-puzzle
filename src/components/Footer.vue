<script setup lang="ts">
import { isDark, toggleDark } from "~/composables";
import { model } from "../config";
function changeModel() {
  if (model.value === "number") {
    model.value = "picture";
  } else {
    model.value = "number";
  }
}
</script>

<template>
  <nav text-xl mt-6 inline-flex gap-2 items-center>
    <button @click="changeModel()" text-2xl>
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

    <button class="icon-btn !outline-none" @click="toggleDark()" m-x-15>
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
