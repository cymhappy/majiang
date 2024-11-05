

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
  f_qidui: 4 = 4;
  f_qingyise: 4 = 4;
  f_duanyao: 2 = 2;
  f_dadui: 2 = 2;
  f_jingou: 2 = 2;
  f_gang: 2 = 2;
  //是否有番
  isQidui: boolean = false;
  isQingyise: boolean = false;
  isDuanyao: boolean = false;
  isDadui: boolean = false;
  isJingou: boolean = false;
  //番数
  fan: number = 1;
}

class Majiang {
  static hasDuiLength = [2, 5, 8, 11, 14]; //含对子牌数
  static nonDuiLength = [3, 6, 9, 12]; //不含对子牌数
  static huLength = 14; //理论胡牌数量

  private shoupai: Pai[][] = [];
  private pengpais: Kezi[] = [];
  private gangpais: Gangzi[] = [];

  private hupai: HuPai = new HuPai();

  private huaseCount: number = 0;
  private shoupaiCount: number = 0;

  private shoupaiMap: Map<string, number> = new Map();

  constructor() {

  }

  public ishuPai(shoupai: Pai[][] , pengpais: Kezi[] = [], gangpais: Gangzi[] = []): boolean {
    this.shoupai = shoupai;
    this.pengpais = pengpais;
    this.gangpais = gangpais;

    this.hupai = new HuPai();

    if (!this.checkCount()) {
      return false;
    }

    if (this.checkQidui()) {
      this.hupai.isQidui = true;
      return true;
    }

    for (const pais of this.shoupai) {
      if(this.splitShoupai(pais) === false){
        return false;
      }
    }

    this.checkFan();//胡牌,计算番数
    return true;
  }

  private checkCount(): boolean {
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

    this.huaseCount = huaseSet.size;
    this.shoupaiCount = shoupaiCount;

    if (this.huaseCount > 2 || this.huaseCount < 1) {
      return false; //花色数量不对
    }

    return true;
  }

  private checkQidui(): boolean {
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

  private splitShoupai(pais: Pai[]): boolean {
    if(Majiang.hasDuiLength.includes(pais.length)){
      return this.splitDuiPais(pais);
    }else if(Majiang.nonDuiLength.includes(pais.length)){
      return this.splitNonDuiPais(pais);
    }
    return false;
  }

  private _arr2map(pais: Pai[]): Map<Digit, number> {
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
  // private _map2arr(map: Map<Digit, number>, t: Huase): Pai[] {
  //   let pais: Pai[] = [];
  //   for (const [v, n] of map.entries()) {
  //     for (let i = 0; i < n; i++) {
  //       pais.push({ v: v, t: t });
  //     }
  //   }
  //   return pais;
  // }

  //2, 5, 8, 11, 14
  private splitDuiPais(pais: Pai[]): boolean {
    if(pais.length === 2){
      return pais[0].v === pais[1].v;
    }else { //5,8,11,14
      for(let i = 0; i + 1 < pais.length; i++){
        if(pais[i].v === pais[i + 1].v){
          const pais_c = pais.concat();
          const duiziArr = pais_c.splice(i, 2);
          
          if(this.splitNonDuiPais(pais_c) === true){
            this.hupai.duizi.push({ item: duiziArr[0], length: 2 });
            return true;
          }else{
            //防止重复计算
            if(i+2 < pais.length && pais[i + 2].v === pais[i].v){
              if(i+3 <pais.length && pais[i + 3].v === pais[i].v){
                i++
              }
              i++;              
            }
            continue;
          }
        }
      }
    }    
    return false;
  }
  //3, 6, 9, 12
  private splitNonDuiPais(pais: Pai[]): boolean {
    const count = pais.length;

    if (count === 3) {
      if (pais[0].v === pais[1].v && pais[0].v === pais[2].v) {
        //刻子
        this.hupai.kezi.push({ item: pais[0], length: 3 });
        return true;
      } else if (pais[0].v + 1 === pais[1].v && pais[1].v + 1 === pais[2].v) {
        //顺子
        this.hupai.shunzi.push({ v: [pais[0].v, pais[1].v, pais[2].v], t: pais[0].t });
        return true;
      } else {
        return false;
      }
    } else { //6,9,12
      for (let i = 0; i + 2 < pais.length; i++) {//check kezi
        if (pais[i].v === pais[i + 2].v) {
          const pais_c = pais.concat();
          const keziArr = pais_c.splice(i, 3);
          if (this.splitNonDuiPais(pais_c) === true) {
            this.hupai.kezi.push({ item: keziArr[0], length: 3 });
            return true;
          } else {
            if (i + 3 < pais.length && pais[i + 3].v === pais[i].v) {
              i++; //跳过相同的
            }
          }
        }
      }
      //no kezi, check shunzi
      const map  = this._arr2map(pais);
      if (this.checkShunzi(map, pais[0].t) === true) {
        return true;
      }
    }

    return false;
  }
  private checkShunzi(map: Map<Digit, number>, t: Huase): boolean {
    for (const [v] of map.entries()) {
      //@ts-ignore
      if (v <= 7 && map.has(v + 1) && map.has(v + 2)) {
        if(map.size === 3){
          //@ts-ignore
          this.hupai.shunzi.push({ v: [v, v + 1, v + 2], t: t });
          return true;
        }
        //有顺子
        const map_c = new Map();
        for (const [_v, _n] of map.entries()) {
          if (_v === v || _v === v + 1 || _v === v + 2) {
            _n - 1 > 0 ? map_c.set(_v, _n - 1) : map_c.delete(_v);
          } else {
            map_c.set(_v, _n);
          }
        }

        if (this.checkShunzi(map_c, t) === true) {
          //@ts-ignore
          this.hupai.shunzi.push({ v: [v, v + 1, v + 2], t: t });
          return true;
        } else {
          continue;
        }
      }
    }

    return false;
  }

  /** 检测番数 */
  private checkFan(): void {
    if (this.huaseCount === 1) {
      this.hupai.isQingyise = true;
      this.hupai.fan *= this.hupai.f_qingyise;
      console.log("清一色,4番");
    }

    if (this.checkDuanyao()) {
      this.hupai.isDuanyao = true;
      this.hupai.fan *= this.hupai.f_duanyao;
      console.log("断幺,2番");
    }

    if (this.hupai.isQidui) {
      this.hupai.fan *= this.hupai.f_qidui;
      console.log("七对,4番");
    }

    if (this.hupai.kezi.length + this.hupai.pengpai.length + this.hupai.gangzi.length === 4) {
      this.hupai.isDadui = true;
      this.hupai.fan *= this.hupai.f_dadui;
      console.log("大对,2番");
      if (this.shoupaiCount === 2) {
        this.hupai.isJingou = true;
        this.hupai.fan *= this.hupai.f_jingou;
        console.log("金钩吊,4番");
      }
    }

    this.shoupaiMap.forEach((value) => {
      if (value === 4) {
        this.hupai.daigen++;
      }
    });
    console.log("带根数为：", this.hupai.daigen);

    this.hupai.daigen += this.hupai.gangzi.length;
    console.log("杠子数=", this.hupai.gangzi.length);

    this.hupai.fan *= this.hupai.f_gang * this.hupai.daigen;

    console.log("总番数为：", this.hupai.fan);
  }

  private checkDuanyao(): boolean {
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


export {Majiang}