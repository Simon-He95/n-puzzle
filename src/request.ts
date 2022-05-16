import axios from "axios";

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
