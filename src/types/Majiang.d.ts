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