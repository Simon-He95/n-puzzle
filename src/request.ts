import axios from "axios";
import { base64, n, arrayPic, picReset, ratio, loading } from "./config";
import { randomNumbers, initData } from './pic'

const baseUrl = "http://81.68.90.128:5001/rank?";
// const baseUrl = "http://localhost:5001/rank?";
const localUrl = "./img/"

export async function initRank(status: string) {
  const { data } = await axios
    .get(`${baseUrl}type=init&status=${status}`)
  return data
}

export async function updateRank(countDown: number, steps: number, name: string, status: string) {
  const { data } = await axios
    .get(
      `${baseUrl}times=${countDown}&steps=${steps}&name=${name}&status=${status}`
    )
  return data
}

const url = "https://source.unsplash.com/collection/94734566";

export function getImage() {
  return new Promise(async (resolve, reject) => {
    const { data } = await axios({
      methods: "get",
      responseType: "blob",
      url
    })
    let oFileReader = new FileReader();
    oFileReader.readAsDataURL(data);
    oFileReader.onloadend = (e) => dealPicture(e?.target?.result as any, resolve)
  })
}

export function baseImage() {
  return new Promise((resolve, reject) => {
    const src = `${localUrl}${Math.floor(Math.random() * 19) + 1}.jpg`
    const image = new Image();
    image.src = src;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height
      ctx?.drawImage(image, 0, 0, image.width, image.height)
      dealPicture(canvas.toDataURL(), resolve)
    }
  })
}


async function dealPicture(baseUrl: string, resolve: any) {
  base64.value = baseUrl
  arrayPic.value = await initData(n.value, base64.value);
  isFresh();
  setData()
  const image = new Image();
  image.src = base64.value;
  image.onload = () => {
    ratio.value = (image.width / image.height).toFixed(1);
  };
  loading.value = false
  resolve('success')
}

// 判断此题是否有解
function isFresh() {
  let inverse = 0;
  const preNumber: number[] = [];
  const odd = (n.value & 1) === 1;
  randomNumbers.reduce((pre, cur) => {
    preNumber.push(pre);
    preNumber.forEach((item) => {
      if (item > cur) inverse++;
    });
    return cur;
  }, 0);
  randomNumbers.length = 0;
  if (odd && (inverse & 1) === 1) {
    // 无解重新生成
    picReset();
  } else if (!odd && (inverse & 1) === 0) {
    // 无解重新生成
    picReset();
  }
}

export async function setData() {
  arrayPic.value = await initData(n.value, base64.value);
  isFresh();
}
