type Digit = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Huase = "wan" | "tiao" | "tong";
interface Pai {
  v: Digit;
  t: Huase;
}

interface ShouPai {
  tiao: { v: Digit; t: "tiao" }[];
  tong: { v: Digit; t: "tong" }[];
  wan: { v: Digit; t: "wan" }[];
}

interface Gangzi {
  item: Pai;
  length: 4;
}

interface Kezi {
  item: Pai;
  length: 3;
}

interface Duizi {
  item: Pai;
  length: 2;
}

interface Shunzi {
  v: Digit[];
  t: Huase;
}

class HuPai {
  //手牌
  duizi: Duizi[] = [];
  shunzi: Shunzi[] = [];
  kezi: Kezi[] = [];
  //副露
  gangzi: Gangzi[] = [];
  pengpai: Kezi[] = [];

  daigen: number = 0;

  //番数
  f_qidui: 4;
  f_qingyise: 4;
  f_duanyao: 2;
  f_dadui: 2;
  f_jingou: 2;
  f_gang: 2;
  //是否有番
  isQidui: boolean;
  isQingyise: boolean;
  isDuanyao: boolean;
  isDadui: boolean;
  isJingou: boolean;
  //番数
  fan: number = 1;
}

class Majiang {
  static hasDuiLength = [2, 5, 8, 11, 14]; //含对子牌数
  static nonDuiLength = [3, 6, 9, 12]; //不含对子牌数
  static huLength = 14; //理论胡牌数量

  shoupai: Pai[][];
  pengpais: Kezi[];
  gangpais: Gangzi[];

  hupai: HuPai = new HuPai();

  huaseCount: number;
  shoupaiCount: number;

  shoupaiMap: Map<string, number> = new Map();

  constructor(shoupai: Pai[][], pengpais: Kezi[] = [], gangpais: Gangzi[] = []) {
    this.shoupai = shoupai;
    this.pengpais = pengpais;
    this.gangpais = gangpais;
  }

  ishuPai(): boolean {
    if (!this.checkCount()) {
      return false;
    }

    if (this.checkQidui()) {
      this.hupai.isQidui = true;
      return true;
    }

    return true;
  }

  checkCount(): boolean {
    let huaseSet = new Set();
    let shoupaiCount = 0;

    this.shoupai = this.shoupai.filter((v) => {
      if (v.length > 0) {
        huaseSet.add(v[0].t);
        shoupaiCount += v.length;
        for (const e of v) {
          let n = this.shoupaiMap.get(e.v + e.t);
          if (n) {
            this.shoupaiMap.set(e.v + e.t, n + 1);
          } else {
            this.shoupaiMap.set(e.v + e.t, 1);
          }
        }

        v.sort((a, b) => a.v - b.v);

        return true;
      }
      return false;
    });

    if (shoupaiCount != Majiang.huLength - 3 * (this.pengpais.length + this.gangpais.length)) {
      return false; //手牌总数量不对
    }

    for (const p of this.pengpais) {
      huaseSet.add(p.item.t);
    }

    for (const g of this.gangpais) {
      huaseSet.add(g.item.t);
    }

    if (this.huaseCount > 2 || this.huaseCount < 1) {
      return false; //花色数量不对
    }

    this.huaseCount = huaseSet.size;
    this.shoupaiCount = shoupaiCount;

    return true;
  }

  checkQidui(): boolean {
    if (this.shoupaiCount != Majiang.huLength) {
      return false;
    }

    for (const pais of this.shoupai) {
      if (pais.length % 2 !== 0) {
        return false;
      }

      while (pais.length > 0) {
        if (pais[pais.length - 1].v === pais[pais.length - 2].v) {
          this.hupai.duizi.push({ item: pais[pais.length - 1], length: 2 });
          pais.length -= 2;
        } else {
          return false;
        }
      }
    }

    this.hupai.isQidui = true;
    return true;
  }

  splitShoupai(pais: Pai[]): boolean {
    const count = pais.length;

    // static hasDuiLength = [2, 5, 8, 11, 14]; //含对子牌数
    // static nonDuiLength = [3, 6, 9, 12]; //不含对子牌数

    if (count === 2) {
      //雀头
      if (pais[0].v === pais[1].v) {
        this.hupai.duizi.push({ item: pais[0], length: 2 });
        pais.length = 0;
      } else {
        return false;
      }
    } else if (count === 3) {
      if (pais[0].v === pais[1].v && pais[0].v === pais[2].v) {
        //刻子
        this.hupai.kezi.push({ item: pais[0], length: 3 });
        pais.length = 0;
      } else if (pais[0].v + 1 === pais[1].v && pais[1].v + 1 === pais[2].v) {
        //顺子
        this.hupai.shunzi.push({ v: [pais[0].v, pais[1].v, pais[2].v], t: pais[0].t });
        pais.length = 0;
      } else {
        return false;
      }
    } else if (count === 5) {
    }

    return true;
  }

  _arr2map(pais: Pai[]): Map<Digit, number> {
    let map: Map<Digit, number> = new Map();
    for (const pai of pais) {
      let n = map.get(pai.v);
      if (n) {
        map.set(pai.v, n + 1);
      } else {
        map.set(pai.v, 1);
      }
    }
    return map;
  }

  //5, 8, 11, 14
  splitDuiPais(pais: Pai[]): boolean {
    return false;
  }
  //3, 6, 9, 12
  splitNonDuiPais(pais: Pai[], map: Map<Digit, number> | null = null): boolean {
    if (map == null) {
      map = this._arr2map(pais);
    }

    const count = pais.length;
    
    if (count === 3) {
      if (pais[0].v === pais[1].v && pais[0].v === pais[2].v) {
        //刻子
        this.hupai.kezi.push({ item: pais[0], length: 3 });
        pais.length = 0;
      } else if (pais[0].v + 1 === pais[1].v && pais[1].v + 1 === pais[2].v) {
        //顺子
        this.hupai.shunzi.push({ v: [pais[0].v, pais[1].v, pais[2].v], t: pais[0].t });
        pais.length = 0;
      } else {
        return false;
      }
    }else if(count === 6){
      
    }    

    return false;
  }

  /** 检测番数 */
  checkFan(): void {
    if (this.huaseCount === 1) {
      this.hupai.isQingyise = true;
      this.hupai.fan *= this.hupai.f_qingyise;
    }

    if (this.checkDuanyao()) {
      this.hupai.isDuanyao = true;
      this.hupai.fan *= this.hupai.f_duanyao;
    }

    if (this.hupai.isQidui) {
      this.hupai.fan *= this.hupai.f_qidui;
    }

    if (this.hupai.kezi.length + this.hupai.pengpai.length + this.hupai.gangzi.length === 4) {
      this.hupai.isDadui = true;
      this.hupai.fan *= this.hupai.f_dadui;
      if (this.shoupaiCount === 2) {
        this.hupai.isJingou = true;
        this.hupai.fan *= this.hupai.f_jingou;
      }
    }

    this.shoupaiMap.forEach((value, key) => {
      if (value === 4) {
        this.hupai.daigen++;
      }
    });

    this.hupai.daigen += this.hupai.gangzi.length;

    this.hupai.fan *= this.hupai.f_gang * this.hupai.daigen;

    console.log("番数为：", this.hupai.fan);
  }

  checkDuanyao(): boolean {
    for (const pais of this.shoupai) {
      for (const pai of pais) {
        if (pai.v === 1 || pai.v === 9) {
          return false;
        }
      }
    }

    for (const pengpai of this.pengpais) {
      if (pengpai.item.v === 1 || pengpai.item.v === 9) {
        return false;
      }
    }

    for (const gangpai of this.gangpais) {
      if (gangpai.item.v === 1 || gangpai.item.v === 9) {
        return false;
      }
    }

    return true;
  }
}
