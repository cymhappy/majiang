type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Huase = "wan" | "tiao" | "tong";
type Pai = {
  v: Digit;
  t: Huase;
};

type ShouPai = {
  tiao: { v: Digit; t: "tiao" }[];
  tong: { v: Digit; t: "tong" }[];
  wan: { v: Digit; t: "wan" }[];
};

type Gangzi = {
  item: Pai;
  length: 4;
};

type Kezi = {
  item: Pai;
  length: 3;
};

type Duizi = {
  item: Pai;
  length: 2;
};

const hasDuiLength = [2, 5, 8, 11, 14]; //含对子牌数
const nonDuiLength = [3, 6, 9, 12]; //不含对子牌数
const huLength = 14; //理论胡牌数量

function isHu(
  shoupai: ShouPai,
  pengpais: Kezi[] = [],
  gangpais: Gangzi[] = []
): boolean {
  if (checkShouPai(shoupai, pengpais, gangpais) === false) {
    return false;
  }

  return true;
}

function checkShouPai(
  shoupai: ShouPai,
  pengpais: Kezi[],
  gangpais: Gangzi[]
): boolean {
  let huaseSet = new Set();
  let shoupaiCount = 0;
  const { tiao, tong, wan } = shoupai;

  const suits = [tiao, tong, wan].filter((v) => {
    if (v.length > 0) {
      huaseSet.add(v[0].t);
      shoupaiCount += v.length;
      return true;
    }
    return false;
  });

  if (shoupaiCount != huLength - 3 * (pengpais.length + gangpais.length)) {
    //手牌总数量不对
    return false;
  }

  for (const p of pengpais) {
    huaseSet.add(p.item.t);
  }

  for (const g of gangpais) {
    huaseSet.add(g.item.t);
  }

  if (huaseSet.size < 1 || huaseSet.size > 2) {
    //只能缺一门或两门
    return false;
  }


  return true;
}

function checkQidui():boolean{
  return false;
}

function hasDuizi(suit: Digit[]): boolean {
  return false;
}
