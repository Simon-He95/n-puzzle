import axios from 'axios'
import { arrayPic, base64, currentImage, loading, n, ratio } from './config'
import { initData } from './pic'

// http://api.n-puzzle.hejian.club/rank?type=init&status=Easy
// const baseUrl = import.meta.env.DEV
//   ? 'http://localhost:5002/rank?'
//   : "/.netlify/functions/rank?";
// const baseUrl = 'http://localhost:5002/rank?'
// 使用相对路径，自动适应不同环境
const baseUrl = '/.netlify/functions/rank?'
const localUrl = './img/'

export async function getRankList(status: string, mode: 'number' | 'picture') {
  const { data } = await axios
    .get(`${baseUrl}type=init&status=${status}&mode=${mode}`)
  if (typeof data === 'string') {
    // 访问不到正确的数据，从本地缓存中获取数据
    const rankList = localStorage.getItem('rank')
    if (rankList) {
      const localData = JSON.parse(rankList)
      // 过滤出对应的状态
      const filteredData = localData.filter((item: any) => item.status === status && item.mode === mode)
      return filteredData
    }
    // 如果没有本地缓存数据，返回空数组
    return []
  }
  return data
}

export async function updateRank(countDown: number, steps: number, name: string, status: string, mode: 'number' | 'picture') {
  const { data } = await axios
    .get(
      `${baseUrl}times=${countDown}&steps=${steps}&name=${name}&status=${status}&mode=${mode}`,
    )
  if (typeof data === 'string') {
    // 访问不到正确的数据，使用本地缓存数据
    const rankList = localStorage.getItem('rank')
    // 追加数据
    const localData = rankList ? JSON.parse(rankList) : []
    const newData = {
      name,
      steps,
      times: countDown,
      status,
      mode,
    }
    localData.push(newData)
    localStorage.setItem('rank', JSON.stringify(localData))
    return []
  }
  return data
}

const url = 'https://source.unsplash.com/collection/94734566'

export async function getImage() {
  const { data } = await axios({
    methods: 'get',
    responseType: 'blob',
    url,
  })
  const oFileReader = new FileReader()
  oFileReader.readAsDataURL(data)
  return new Promise((resolve) => {
    oFileReader.onload = e => dealPicture(e?.target?.result as any, resolve)
  })
}

const imageLength = 29
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
