const HuaseArr:Huase[] = ["wan" , "tiao" , "tong"];
const digits = [1,2,3,4,5,6,7,8,9];
const duanyaoDigits = [2,3,4,5,6,7,8];

export default function generateHuPai(options:HuPaiOption = {}){
  const {isQidui = false, isQingyise  = false, isDuanyao = false, isDadui = false, isJingou = false, gangziNum = 0} = options;

  const huase:Huase[] = isQingyise?getRandomElements(HuaseArr,1):getRandomElements(HuaseArr,2);


}

/**随机生成七对胡牌 */
function gQidui(huase:Huase[],isDuanyao:boolean){
  const vs = isDuanyao?duanyaoDigits:digits; //是否断幺
  const result:Pai[] = [];
  if(huase.length === 1){//清一色
    const t = huase[0];
    const sv = getRandomElementsWithLimit(vs,7,2) as Digit[];    
    for (const v of sv) {
      result.push({v,t},{v : v,t});
    }
    
  }else{
    const numArr = getRandomPair(7);  

    for (let index = 0; index < huase.length; index++) {
      const t = huase[index];
      const n = numArr[index];
      const sv = getRandomElementsWithLimit(vs,n,2) as Digit[];
      for (const v of sv) {
        result.push({v,t});
      }
    }
  }

  return result;
}


function getRandomElementsWithLimit<T>(arr:Array<T>, n:number, t:number):Array<T> {
  // 确保输入参数的有效性
  if (n <= 0 || t <= 0) {
      throw new Error("n and t must be positive integers.");
  }

  const result = [];
  const m = arr.length;

  // 循环，直到我们获得 n 个元素
  while (result.length < n) {
      // 随机选择一个元素
      const randomIndex = Math.floor(Math.random() * m);
      const selectedElement = arr[randomIndex];

      // 计算该元素在结果数组中的出现次数
      const count = result.filter(item => item === selectedElement).length;

      // 如果该元素出现次数小于 t，添加到结果中
      if (count < t) {
          result.push(selectedElement);
      }
  }

  return result;
}






function getRandomPair(n:number) {
    // 确保 n 是非负整数
    if (n < 0) {
        throw new Error("n must be a non-negative integer.");
    }
    
    // 生成第一个随机整数 x
    const x = Math.floor(Math.random() * (n + 1));
    const y = n - x; // 计算第二个整数 y

    return [x, y];
}

// 使用示例
const n = 10; // 目标和
const randomPair = getRandomPair(n);
console.log(`随机生成的整数: ${randomPair[0]} 和 ${randomPair[1]}，它们的和为 ${n}`);

function getRandomElement<T>(arr:Array<T>):T{
  return arr[Math.floor(Math.random()*arr.length)];
}


function getRandomElements<T>(arr:Array<T>, n:number):Array<T> {
  // 确保 n 不超过数组的长度
  if (n > arr.length) {
      throw new Error("n cannot be greater than the number of unique elements (m).");
  }

  // 创建原数组的副本
  const arrCopy = [...arr];

  // 洗牌数组（Fisher-Yates 洗牌算法）
  for (let i = arrCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // 随机索引
      // 交换元素
      [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
  }

  // 返回打乱后的前 n 个元素
  return arrCopy.slice(0, n);
}