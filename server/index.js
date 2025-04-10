const fs = require('node:fs')
const express = require('express')

// 在服务器启动前检查并转换 rank.json 结构
function initializeRankData() {
  // 读取现有的 rank.json
  try {
    const data = JSON.parse(fs.readFileSync('./rank.json', 'utf8'))
    const newData = {}

    // 遍历每个难度级别
    for (const status in data) {
      if (Array.isArray(data[status])) {
        // 旧数据结构，转换为新结构
        newData[status] = {
          // 假设所有旧数据都是数字模式
          number: data[status],
          picture: [],
        }
      }
      else {
        // 已经是新结构
        newData[status] = data[status]
      }
    }

    // 写回文件
    fs.writeFileSync('./rank.json', JSON.stringify(newData))
    return newData
  }
  catch (error) {
    // 文件不存在或格式错误，创建新文件
    const initialData = {
      Easy: { number: [], picture: [] },
      Medium: { number: [], picture: [] },
      Hard: { number: [], picture: [] },
      Evil: { number: [], picture: [] },
    }
    fs.writeFileSync('./rank.json', JSON.stringify(initialData))
    return initialData
  }
}

// 在服务器启动时初始化数据
const json = initializeRankData()

const app = express()
app.all('*', (req, res, next) => {
  // 设置允许跨域的域名，*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*')
  // 允许的header类型
  res.header('Access-Control-Allow-Headers', 'content-type')
  // 跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
  if (req.method.toLowerCase() === 'options')
    res.send(200) // 让options尝试请求快速结束
  else
    next()
})

app.get('/rank', (req, res) => {
  const { times, steps, name, status, type, mode } = req.query
  // 确保json中有对应难度的结构
  if (!json[status]) {
    json[status] = {
      number: [],
      picture: [],
    }
  }

  // 确保json中该难度下有对应模式的数组
  if (!json[status][mode]) {
    json[status][mode] = []
  }

  // 如果是初始化请求，返回对应难度和模式的排名
  if (type === 'init') {
    return res.json(json[status][mode] || [])
  }

  // 获取当前难度和模式的排名数组
  const rankArray = json[status][mode]

  // 如果排名不足3个，直接添加
  if (rankArray.length < 3) {
    rankArray.push({
      times,
      steps,
      name,
      mode, // 保存模式信息
    })
    rankArray.sort((a, b) => a.times - b.times).sort((a, b) => a.steps - b.steps)
    // 写入
    fs.writeFileSync('./rank.json', JSON.stringify(json))
  }
  else {
    // 检查是否可以进入排行榜
    let inserted = false
    for (let i = 0; i < rankArray.length; i++) {
      const { steps: itemSteps, times: itemTimes } = rankArray[i]
      if (+itemSteps > +steps) {
        rankArray.splice(i, 0, {
          times,
          steps,
          name,
          mode, // 保存模式信息
        })
        rankArray.pop()
        inserted = true
        break
      }
      else if (itemSteps === steps && +itemTimes > +times) {
        rankArray.splice(i, 0, {
          times,
          steps,
          name,
          mode, // 保存模式信息
        })
        rankArray.pop()
        inserted = true
        break
      }
    }

    if (inserted) {
      fs.writeFileSync('./rank.json', JSON.stringify(json))
    }
  }

  // 返回更新后的排名
  res.json(rankArray)
})

app.listen(5002, () => {
  console.log('服务器启动5002')
})
