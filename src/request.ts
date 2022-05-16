import axios from "axios";
import type { AxiosRequestConfig, Axios } from 'axios'
import { base64 } from "./config";

const baseUrl = "http://81.68.90.128:5001/rank?";
// const baseUrl = "http://localhost:5001/rank?";

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
    oFileReader.onloadend = function (e) {
      base64.value = e?.target?.result as any;
      resolve('success')
    };
  })

}
