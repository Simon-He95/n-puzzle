import { arrayPic, base64, currentImage, loading, n, ratio } from './config'
import { initData } from './pic'

// http://api.n-puzzle.hejian.club/rank?type=init&status=Easy
// const baseUrl = import.meta.env.DEV
//   ? 'http://localhost:5002/rank?'
//   : "/.netlify/functions/rank?";
// const baseUrl = 'http://localhost:5002/rank?'
const baseUrl = import.meta.env.DEV
  ? 'http://localhost:5002/rank?'
  : '/.netlify/functions/rank?'
const localUrl = '/img/'

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: 'GET' })
  if (!res.ok)
    throw new Error(`Request failed: ${res.status} ${res.statusText}`)
  return await res.json()
}

export async function getRankList(status: string, mode: 'number' | 'picture') {
  try {
    const data = await fetchJson<any[]>(`${baseUrl}type=init&status=${encodeURIComponent(status)}&mode=${mode}`)
    if (Array.isArray(data))
      return data
  }
  catch {}

  const rankList = localStorage.getItem('rank')
  if (!rankList)
    return []

  try {
    const localData = JSON.parse(rankList)
    return localData.filter((item: any) => item.status === status && item.mode === mode)
  }
  catch {
    return []
  }
}

export async function updateRank(countDown: number, steps: number, name: string, status: string, mode: 'number' | 'picture') {
  try {
    const data = await fetchJson<any[]>(
      `${baseUrl}times=${countDown}&steps=${steps}&name=${encodeURIComponent(name)}&status=${encodeURIComponent(status)}&mode=${mode}`,
    )
    if (Array.isArray(data))
      return data
  }
  catch {}

  const rankList = localStorage.getItem('rank')
  let localData: any[] = []
  if (rankList) {
    try {
      localData = JSON.parse(rankList)
    }
    catch {
      localData = []
    }
  }
  const newData = { name, steps, times: countDown, status, mode }
  localData.push(newData)
  localStorage.setItem('rank', JSON.stringify(localData))
  return []
}

const url = 'https://source.unsplash.com/collection/94734566'

export async function getImage() {
  const res = await fetch(url)
  const blob = await res.blob()
  const oFileReader = new FileReader()
  oFileReader.readAsDataURL(blob)
  return new Promise((resolve) => {
    oFileReader.onload = e => dealPicture(e?.target?.result as any, resolve)
  })
}

const imageLength = 30
export function baseImage() {
  return new Promise((resolve) => {
    const picId = picIndex()
    const src = `${localUrl}${picId}.jpg`
    currentImage.value = picId
    const image = new Image()
    image.src = src
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    image.onload = () => {
      canvas.width = image.width
      canvas.height = image.height
      ctx?.drawImage(image, 0, 0, image.width, image.height)
      dealPicture(canvas.toDataURL(), resolve)
    }
  })
}

function picIndex(): number {
  const id = Math.floor(Math.random() * imageLength) + 1
  if (id === currentImage.value)
    return picIndex()

  return id
}

async function dealPicture(baseUrl: string, resolve: any) {
  base64.value = baseUrl
  arrayPic.value = await initData(n.value, base64.value)
  // setData()
  const image = new Image()
  image.src = base64.value
  image.onload = () => {
    ratio.value = (image.width / image.height).toFixed(1)
  }
  loading.value = false
  resolve('success')
}

export async function setData() {
  arrayPic.value = await initData(n.value, base64.value)
}
