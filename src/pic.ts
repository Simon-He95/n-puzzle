import { arrayPic, n } from './config'

export const emptyFlag = '/empty.png'
export const emptyPos = -1

const pictureUrlCache = new Map<string, Map<number, string>>()

function neighborIndices(index: number, size: number) {
  const x = index % size
  const y = Math.floor(index / size)
  const result: number[] = []
  if (y > 0)
    result.push(index - size)
  if (y < size - 1)
    result.push(index + size)
  if (x > 0)
    result.push(index - 1)
  if (x < size - 1)
    result.push(index + 1)
  return result
}

function isSolved(order: number[]) {
  const last = order.length - 1
  for (let i = 0; i < last; i++) {
    if (order[i] !== i)
      return false
  }
  return order[last] === emptyPos
}

function scrambleOrder(size: number): number[] {
  const total = size * size
  const order = Array.from({ length: total }, (_, i) => i)
  order[total - 1] = emptyPos

  const steps = Math.max(60, total * size * 2)
  let emptyIndex = total - 1
  let prevEmptyIndex = -1

  for (let i = 0; i < steps; i++) {
    const candidates = neighborIndices(emptyIndex, size).filter(i => i !== prevEmptyIndex)
    const nextIndex = candidates[Math.floor(Math.random() * candidates.length)]
    ;[order[emptyIndex], order[nextIndex]] = [order[nextIndex], order[emptyIndex]]
    prevEmptyIndex = emptyIndex
    emptyIndex = nextIndex
  }

  if (isSolved(order))
    return scrambleOrder(size)

  return order
}

async function splitImage(size: number, src: string): Promise<Map<number, string>> {
  const key = `${size}-${src}`
  if (pictureUrlCache.has(key))
    return pictureUrlCache.get(key)!

  const image = new Image()
  image.src = src

  const tileUrlByPos = await new Promise<Map<number, string>>((resolve, reject) => {
    image.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx)
          throw new Error('Canvas 2D context unavailable')

        const map = new Map<number, string>()
        for (let y = 0; y < size; y++) {
          for (let x = 0; x < size; x++) {
            const pos = x + y * size
            const sx0 = Math.round(x * image.width / size)
            const sx1 = Math.round((x + 1) * image.width / size)
            const sy0 = Math.round(y * image.height / size)
            const sy1 = Math.round((y + 1) * image.height / size)
            const sw = Math.max(1, sx1 - sx0)
            const sh = Math.max(1, sy1 - sy0)

            canvas.width = sw
            canvas.height = sh
            ctx.clearRect(0, 0, sw, sh)
            ctx.drawImage(image, sx0, sy0, sw, sh, 0, 0, sw, sh)
            map.set(pos, canvas.toDataURL('image/png'))
          }
        }
        resolve(map)
      }
      catch (e) {
        reject(e)
      }
    }
    image.onerror = (e) => {
      reject(e)
    }
  })

  pictureUrlCache.set(key, tileUrlByPos)
  return tileUrlByPos
}

export async function initData(size: number, src: string) {
  const tileUrlByPos = await splitImage(size, src)
  const order = scrambleOrder(size)

  const result = Array.from({ length: size }, (_, y) =>
    Array.from({ length: size }, (_, x) => {
      const index = x + y * size
      const pos = order[index]
      return {
        url: pos === emptyPos ? emptyFlag : tileUrlByPos.get(pos) ?? emptyFlag,
        x,
        y,
        pos,
        animateX: false,
        animateY: false,
      }
    }))

  return result
}

export function isWin(): boolean {
  return arrayPic.value.every((row) => {
    return row.every((item: any) => {
      if (item.x === n.value - 1 && item.y === n.value - 1 && item.pos === emptyPos)
        return true

      return item.pos === item.x + item.y * n.value
    })
  })
}
