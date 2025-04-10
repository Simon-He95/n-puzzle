import { promises as fs } from 'node:fs';
import path from 'node:path';

// 获取rank.json文件的路径
const getRankFilePath = () => {
  return path.join(process.cwd(), 'rank.json');
};

// 在函数调用时初始化/读取排名数据
async function getRankData() {
  const filePath = getRankFilePath();
  
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // 文件不存在或格式错误，创建新文件
    const initialData = {
      Easy: { number: [], picture: [] },
      Medium: { number: [], picture: [] },
      Hard: { number: [], picture: [] },
      Evil: { number: [], picture: [] },
    };
    await fs.writeFile(filePath, JSON.stringify(initialData));
    return initialData;
  }
}

// 将排名数据保存回文件
async function saveRankData(json) {
  const filePath = getRankFilePath();
  await fs.writeFile(filePath, JSON.stringify(json));
}

export default async (request, context) => {
  // 设置CORS头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // 处理OPTIONS请求
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers, status: 200 });
  }

  try {
    // 解析请求URL和参数
    const url = new URL(request.url);
    const times = url.searchParams.get('times');
    const steps = url.searchParams.get('steps');
    const name = url.searchParams.get('name');
    const status = url.searchParams.get('status');
    const type = url.searchParams.get('type');
    const mode = url.searchParams.get('mode');

    // 读取排名数据
    const json = await getRankData();

    // 确保json中有对应难度的结构
    if (!json[status]) {
      json[status] = {
        number: [],
        picture: [],
      };
    }

    // 确保json中该难度下有对应模式的数组
    if (!json[status][mode]) {
      json[status][mode] = [];
    }

    // 获取当前难度和模式的排名数组
    const rankArray = json[status][mode];

    // 如果是初始化请求，返回对应难度和模式的排名
    if (type === 'init') {
      return new Response(JSON.stringify(rankArray), { 
        headers: { ...headers, 'Content-Type': 'application/json' } 
      });
    }

    // 如果排名不足3个，直接添加
    if (rankArray.length < 3) {
      rankArray.push({
        times,
        steps,
        name,
        mode, // 保存模式信息
      });
      rankArray.sort((a, b) => a.times - b.times).sort((a, b) => a.steps - b.steps);
      // 保存更新
      await saveRankData(json);
    }
    else {
      // 检查是否可以进入排行榜
      let inserted = false;
      for (let i = 0; i < rankArray.length; i++) {
        const { steps: itemSteps, times: itemTimes } = rankArray[i];
        if (+itemSteps > +steps) {
          rankArray.splice(i, 0, {
            times,
            steps,
            name,
            mode, // 保存模式信息
          });
          rankArray.pop();
          inserted = true;
          break;
        }
        else if (itemSteps === steps && +itemTimes > +times) {
          rankArray.splice(i, 0, {
            times,
            steps,
            name,
            mode, // 保存模式信息
          });
          rankArray.pop();
          inserted = true;
          break;
        }
      }

      if (inserted) {
        await saveRankData(json);
      }
    }

    // 返回更新后的排名
    return new Response(JSON.stringify(rankArray), { 
      headers: { ...headers, 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { ...headers, 'Content-Type': 'application/json' } 
    });
  }
}
