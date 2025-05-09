import { arrayPic, n } from './config'

const collect: any[] = []
export const randomNumbers: number[] = []

export const emptyFlag = './empty.png'
const pictureMap = new Map<string, any>()

function splitImage(n: number, src: string) {
  const key = `${n}-${src}`
  return new Promise((resolve) => {
    if (pictureMap.has(key))
      return resolve(pictureMap.get(key))

    const canvas = document.createElement('canvas')
    const image = new Image()
    image.src = src
    const ctx = canvas.getContext('2d')!
    const numbers: any[] = []

    image.onload = async () => {
      const w = image.width / n
      const h = image.height / n
      const result: any[] = []

      for (let j = 0; j < n; j++) {
        const col = []
        for (let i = 0; i < n; i++) {
          ctx.drawImage(image, i * w, j * h, w, h, 0, 0, w, h)
          const url = await PicSpace(canvas.toDataURL('image/png'))

          const result = {
            url,
            x: i,
            y: j,
            pos: i + j * n,
          }
          if (j !== 2 || i !== 2) {
            numbers.push(JSON.parse(JSON.stringify(result)))
            collect.push(result)
          }
          col.push(result)
        }
        result.push(col)
      }
      pictureMap.set(key, { result, numbers })
      resolve({ result, numbers })
    }
  })
}

async function PicSpace(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data!
      let lOffset = canvas.width
      let rOffset = 0
      let tOffset = canvas.height
      let bOffset = 0
      for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
          const pos = (i + canvas.width * j) * 4
          if (imgData[pos] === 255 || imgData[pos + 1] === 255 || imgData[pos + 2] || imgData[pos + 3]) {
            bOffset = Math.max(j, bOffset)
            tOffset = Math.min(j, tOffset)
            lOffset = Math.min(i, lOffset)
            rOffset = Math.max(i, rOffset)
          }
        }
      }
      lOffset++
      rOffset++
      tOffset++
      bOffset++
      const canvas1 = document.createElement('canvas')
      const ctx1 = canvas1.getContext('2d')
      canvas1.width = rOffset - lOffset
      canvas1.height = bOffset - tOffset
      ctx1?.drawImage(img, lOffset, tOffset, canvas1.width, canvas1.height, 0, 0, canvas1.width, canvas1.height)
      resolve(canvas1.toDataURL())
    }
  })
}

export async function initData(n: number, src: string) {
  const { result: arrayPic, numbers } = await splitImage(n, src) as any
  const copyNumbers = JSON.parse(JSON.stringify(numbers))
  const flatNumbers = copyNumbers.map((item: any) => item.pos)

  // 确保生成的拼图有解
  ensureSolvable(flatNumbers, n)

  let index = 0
  for (let i = 0; i < arrayPic.length; i++) {
    for (let j = 0; j < arrayPic[i].length; j++) {
      if (i === 0 && j === 0) {
        arrayPic[i][j].url = emptyFlag
        arrayPic[i][j].pos = emptyFlag
        arrayPic[i][j].animateX = false
        arrayPic[i][j].animateY = false
        continue
      }
      const pos = flatNumbers[index++]
      const { url } = copyNumbers.find((item: any) => item.pos === pos)
      randomNumbers.push(pos)
      arrayPic[i][j].url = url
      arrayPic[i][j].pos = pos
      arrayPic[i][j].animateX = false
      arrayPic[i][j].animateY = false
    }
  }
  return arrayPic
}

// 确保生成的拼图有解
function ensureSolvable(flatNumbers: number[], n: number) {
  let isSolvable = false

  while (!isSolvable) {
    // 随机打乱数字顺序
    shuffleArray(flatNumbers)

    // 计算逆序数
    const inverse = calculateInversions(flatNumbers)
    const odd = (n & 1) === 1

    if (odd) {
      // 奇数维度，逆序数必须是偶数
      isSolvable = inverse % 2 === 0
    }
    else {
      // 偶数维度，考虑空格位置
      const emptyRowFromBottom = n - Math.floor(flatNumbers.indexOf(-1) / n)
      const isEmptyRowOdd = (emptyRowFromBottom & 1) === 1

      isSolvable = (isEmptyRowOdd && inverse % 2 !== 0) || (!isEmptyRowOdd && inverse % 2 === 0)
    }
  }
}

// 随机打乱数组
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
}

// 计算逆序数
function calculateInversions(numbers: number[]): number {
  let inversions = 0
  for (let i = 0; i < numbers.length; i++) {
    if (numbers[i] === -1)
      continue // 跳过空格标志
    for (let j = i + 1; j < numbers.length; j++) {
      if (numbers[j] === -1)
        continue // 跳过空格标志
      if (numbers[i] > numbers[j]) {
        inversions++
      }
    }
  }
  return inversions
}

export function isWin(): boolean {
  return arrayPic.value.every((row) => {
    return row.every((item: any) => {
      if (item.x === n.value - 1 && item.y === n.value - 1 && item.pos === emptyFlag)
        return true

      return item.pos === item.x + item.y * n.value
    })
  })
}
