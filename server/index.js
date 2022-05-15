const json = require('./rank.json')
const fs = require('fs')
const express = require('express')
const app = express()
app.all("*", function (req, res, next) {
  //设置允许跨域的域名，*代表允许任意域名跨域
  res.header("Access-Control-Allow-Origin", "*");
  //允许的header类型
  res.header("Access-Control-Allow-Headers", "content-type");
  //跨域允许的请求方式 
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  if (req.method.toLowerCase() == 'options') {
    res.send(200);  //让options尝试请求快速结束
  } else {
    next();
  }
})
app.get('/rank', (req, res) => {
  const { times, steps, name, status, type } = req.query
  console.log(type, json[status])
  if (type === 'init') {
    return res.json(json[status])
  }
  if (json[status].length < 3) {
    json[status].push({
      times,
      steps,
      name
    })
    arr.sort((a, b) => a.times - b.times).sort((a, b) => a.step - b.step)
    // 写入
    fs.writeFile('./rank.json', JSON.stringify(json), (err) => {
      console.log('err:', err)
    })
  } else {
    for (let i = 0; i < json[status].length; i++) {
      if (json[status][i].steps > steps) {
        json[status].splice(i, 0, {
          times,
          steps,
          name
        })

        json[status].pop()
        break
      } else if (json[status][i].steps === steps && json[status][i].times > times) {
        json[status].splice(i, 0, {
          times,
          steps,
          name
        })
        json[status].pop()
        break
      }
    }

    fs.writeFile('./rank.json', JSON.stringify(json), (err) => {
      console.log('err:', err)
    })
  }
  res.json(json[status])
})


app.listen(5001, () => {
  console.log('服务器启动5001')
})