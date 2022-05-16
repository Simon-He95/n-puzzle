import { ref } from 'vue'
export const name = ref<string>('')
export const win = ref<boolean>(false)
export const steps = ref<number>(0)
export const start = ref(Date.now());
export const rankList = ref<any[]>([])
export const n = ref<number>(3)
export const model = ref<string>('number')
export const array = ref<any[]>([])
