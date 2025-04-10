import axios from 'axios'
import { arrayPic, base64, currentImage, loading, n, ratio } from './config'
import { initData } from './pic'

// http://api.n-puzzle.hejian.club/rank?type=init&status=Easy
// const baseUrl = "http://api.n-puzzle.hejian.club/rank?";
const baseUrl = 'http://localhost:5002/rank?'
const localUrl = './img/'

export async function getRankList(status: string, mode: 'number' | 'picture') {
  const { data } = await axios
    .get(`${baseUrl}type=init&status=${status}&mode=${mode}`)
  return data
}

export async function updateRank(countDown: number, steps: number, name: string, status: string, mode: 'number' | 'picture') {
  const { data } = await axios
    .get(
      `${baseUrl}times=${countDown}&steps=${steps}&name=${name}&status=${status}&mode=${mode}`,
    )
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
