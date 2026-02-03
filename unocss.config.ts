import { icons as carbonIcons } from '@iconify-json/carbon'
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  // transformerDirectives,
  // transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-2 rounded-2xl inline-flex items-center justify-center gap-2 font-700 cursor-pointer select-none bg-gradient-to-b from-teal-300/95 to-cyan-400/95 text-dark-900 shadow-md shadow-black/10 hover:shadow-lg hover:shadow-black/15 active:translate-y-0.5 transition disabled:cursor-default disabled:opacity-50 disabled:shadow-none dark:text-white dark:from-teal-600/45 dark:to-cyan-600/35 dark:bg-dark-900/20'],
    ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-80 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        carbon: carbonIcons,
      },
    }),
    presetWebFonts({
      inlineImports: false,
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  // transformers: [
  //   transformerDirectives(),
  //   transformerVariantGroup(),
  // ],
})
