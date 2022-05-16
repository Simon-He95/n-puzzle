const collect: any[] = []
export const randomNumbers: number[] = []

export const emptyFlag = "./empty.png";
const pictureMap = new Map<string, any>()

function splitImage(n: number, src: string) {
  const key = `${n}-${src}`
  return new Promise((resolve) => {
    if (pictureMap.has(key)) {
      return resolve(pictureMap.get(key))
    }
    const canvas = document.createElement("canvas");
    const image = new Image();
    image.src = src;
    const ctx = canvas.getContext("2d")!;
    const numbers: any[] = []

    image.onload = async () => {
      const w = image.width / n;
      const h = image.height / n;
      const result: any[] = []

      for (let j = 0; j < n; j++) {
        const col = [];
        for (let i = 0; i < n; i++) {
          ctx.drawImage(image, i * w, j * h, w, h, 0, 0, w, h);
          const url = await PicSpace(canvas.toDataURL("image/png"))

          const result = {
            url,
            x: i,
            y: j,
            pos: i + j * n
          };
          if (j !== 2 || i !== 2) {
            numbers.push(JSON.parse(JSON.stringify(result)))
            collect.push(result)
          }
          col.push(result);
        }
        result.push(col);
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
      const ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const imgData = ctx?.getImageData(0, 0, canvas.width, canvas.height).data!
      let lOffset = canvas.width, rOffset = 0, tOffset = canvas.height, bOffset = 0
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

function randomPic(numbers: any[]) {
  const result = numbers.splice(Math.floor(Math.random() * numbers.length), 1)[0];
  return result
}
export async function initData(n: number, src: string) {
  const { result: array, numbers } = await splitImage(n, src) as any
  const copyNumbers = JSON.parse(JSON.stringify(numbers))
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (i === 0 && j === 0) {
        array[i][j].url = emptyFlag
        array[i][j].pos = emptyFlag
        continue
      }
      const { url, pos, } = randomPic(copyNumbers)
      randomNumbers.push(pos)
      array[i][j].url = url
      array[i][j].pos = pos
    }
  }
  return array
}

export function isWin(array: any[]): boolean {
  const n = array.length
  return array.every((row) => {
    return row.every((item: any) => {
      if (item.x === n - 1 && item.y === n - 1 && item.pos === emptyFlag) {
        return true;
      }
      return item.pos === item.x + item.y * n;
    });
  });
}
