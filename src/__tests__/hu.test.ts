import { Majiang } from '../hu';

describe('Majiang', () => {
  let majiang: Majiang;

  beforeEach(() => {
    majiang = new Majiang([], [], []);
  });

  describe('ishuPai', () => {
    it('should return false if hand count is incorrect', () => {
      majiang.shoupai = [[{ v: 1, t: 'wan' }, { v: 2, t: 'wan' }]];
      expect(majiang.ishuPai()).toBe(false);
    });

    it('should return true for a valid qidui hand', () => {
      majiang.shoupai = [
        [{ v: 1, t: 'wan' }, { v: 1, t: 'wan' }],
        [{ v: 2, t: 'wan' }, { v: 2, t: 'wan' }],
        [{ v: 3, t: 'wan' }, { v: 3, t: 'wan' }],
        [{ v: 4, t: 'wan' }, { v: 4, t: 'wan' }],
        [{ v: 5, t: 'wan' }, { v: 5, t: 'wan' }],
        [{ v: 6, t: 'wan' }, { v: 6, t: 'wan' }],
        [{ v: 7, t: 'wan' }, { v: 7, t: 'wan' }]
      ];
      expect(majiang.ishuPai()).toBe(true);
    });

    it('should return false for an invalid hand', () => {
      majiang.shoupai = [
        [{ v: 1, t: 'wan' }, { v: 2, t: 'wan' }, { v: 3, t: 'wan' }],
        [{ v: 4, t: 'wan' }, { v: 5, t: 'wan' }, { v: 6, t: 'wan' }],
        [{ v: 7, t: 'wan' }, { v: 8, t: 'wan' }, { v: 9, t: 'wan' }],
        [{ v: 1, t: 'tiao' }, { v: 1, t: 'tiao' }]
      ];
      expect(majiang.ishuPai()).toBe(false);
    });
  });

  describe('checkCount', () => {
    it('should return false if total hand count is incorrect', () => {
      majiang.shoupai = [[{ v: 1, t: 'wan' }, { v: 2, t: 'wan' }]];
      expect(majiang.checkCount()).toBe(false);
    });

    it('should return true if total hand count is correct', () => {
      majiang.shoupai = [
        [{ v: 1, t: 'wan' }, { v: 2, t: 'wan' }, { v: 3, t: 'wan' }],
        [{ v: 4, t: 'wan' }, { v: 5, t: 'wan' }, { v: 6, t: 'wan' }],
        [{ v: 7, t: 'wan' }, { v: 8, t: 'wan' }, { v: 9, t: 'wan' }],
        [{ v: 1, t: 'tiao' }, { v: 1, t: 'tiao' }]
      ];
      majiang.pengpais = [{ item: { v: 1, t: 'tong' }, length: 3 }];
      majiang.gangpais = [{ item: { v: 2, t: 'tong' }, length: 4 }];
      expect(majiang.checkCount()).toBe(true);
    });
  });

  describe('checkQidui', () => {
    it('should return true for a valid qidui hand', () => {
      majiang.shoupai = [
        [{ v: 1, t: 'wan' }, { v: 1, t: 'wan' }],
        [{ v: 2, t: 'wan' }, { v: 2, t: 'wan' }],
        [{ v: 3, t: 'wan' }, { v: 3, t: 'wan' }],
        [{ v: 4, t: 'wan' }, { v: 4, t: 'wan' }],
        [{ v: 5, t: 'wan' }, { v: 5, t: 'wan' }],
        [{ v: 6, t: 'wan' }, { v: 6, t: 'wan' }],
        [{ v: 7, t: 'wan' }, { v: 7, t: 'wan' }]
      ];
      expect(majiang.checkQidui()).toBe(true);
    });

    it('should return false for an invalid qidui hand', () => {
      majiang.shoupai = [
        [{ v: 1, t: 'wan' }, { v: 2, t: 'wan' }, { v: 3, t: 'wan' }],
        [{ v: 4, t: 'wan' }, { v: 5, t: 'wan' }, { v: 6, t: 'wan' }],
        [{ v: 7, t: 'wan' }, { v: 8, t: 'wan' }, { v: 9, t: 'wan' }],
        [{ v: 1, t: 'tiao' }, { v: 1, t: 'tiao' }]
      ];
      expect(majiang.checkQidui()).toBe(false);
    });
  });

  describe('splitShoupai', () => {
    it('should handle pairs correctly', () => {
      const pais: Pai[] = [{ v: 1, t: 'wan' }, { v: 1, t: 'wan' }];
      expect(majiang.splitShoupai(pais)).toBe(true);
      expect(majiang.hupai.duizi).toEqual([{ item: { v: 1, t: 'wan' }, length: 2 }]);
    });

    it('should handle triplets correctly', () => {
      const pais: Pai[] = [{ v: 1, t: 'wan' }, { v: 1, t: 'wan' }, { v: 1, t: 'wan' }];
      expect(majiang.splitShoupai(pais)).toBe(true);
      expect(majiang.hupai.kezi).toEqual([{ item: { v: 1, t: 'wan' }, length: 3 }]);
    });

    it('should handle sequences correctly', () => {
      const pais: Pai[] = [{ v: 1, t: 'wan' }, { v: 2, t: 'wan' }, { v: 3, t: 'wan' }];
      expect(majiang.splitShoupai(pais)).toBe(true);
      expect(majiang.hupai.shunzi).toEqual([{ v: [1, 2, 3], t: 'wan' }]);
    });

    it('should return false for invalid combinations', () => {
      const pais: Pai[] = [{ v: 1, t: 'wan' }, { v: 2, t: 'wan' }];
      expect(majiang.splitShoupai(pais)).toBe(false);
    });
  });

  describe('checkFan', () => {
    it('should calculate fan correctly for qingyise', () => {
      majiang.shoupai = [
        [{ v: 1, t: 'wan' }, { v: 2, t: 'wan' }, { v: 3, t: 'wan' }],
        [{ v: 4, t: 'wan' }, { v: 5, t: 'wan' }, { v: 6, t: 'wan' }],
        [{ v: 7, t: 'wan' }, { v: 8, t: 'wan' }, { v: 9, t: 'wan' }],
        [{ v: 1, t: 'wan' }, { v: 1, t: 'wan' }]
      ];
      majiang.checkFan();
      expect(majiang.hupai.isQingyise).toBe(true);
      expect(majiang.hupai.fan).toBe(4);
    });

    it('should calculate fan correctly for duanyao', () => {
      majiang.shoupai = [
        [{ v: 2, t: 'wan' }, { v: 3, t: 'wan' }, { v: 4, t: 'wan' }],
        [{ v: 5, t: 'wan' }, { v: 6, t: 'wan' }, { v: 7, t: 'wan' }],
        [{ v: 8, t: 'wan' }, { v: 9, t: 'wan' }, { v: 9, t: 'wan' }],
        [{ v: 2, t: 'wan' }, { v: 2, t: 'wan' }]
      ];
      majiang.checkFan();
      expect(majiang.hupai.isDuanyao).toBe(true);
      expect(majiang.hupai.fan).toBe(2);
    });

    it('should calculate fan correctly for qidui', () => {
      majiang.shoupai = [
        [{ v: 1, t: 'wan' }, { v: 1, t: 'wan' }],
        [{ v: 2, t: 'wan' }, { v: 2, t: 'wan' }],
        [{ v: 3, t: 'wan' }, { v: 3, t: 'wan' }],
        [{ v: 4, t: 'wan' }, { v: 4, t: 'wan' }],
        [{ v: 5, t: 'wan' }, { v: 5, t: 'wan' }],
        [{ v: 6, t: 'wan' }, { v: 6, t: 'wan' }],
        [{ v: 7, t: 'wan' }, { v: 7, t: 'wan' }]
      ];
      majiang.checkFan();
      expect(majiang.hupai.isQidui).toBe(true);
      expect(majiang.hupai.fan).toBe(4);
    });

    it('should calculate fan correctly for dadui', () => {
      majiang.shoupai = [
        [{ v: 1, t: 'wan' }, { v: 1, t: 'wan' }],
        [{ v: 2, t: 'wan' }, { v: 2, t: 'wan' }],
        [{ v: 3, t: 'wan' }, { v: 3, t: 'wan' }],
        [{ v: 4, t: 'wan' }, { v: 4, t: 'wan' }]
      ];
      majiang.pengpais = [{ item: { v: 5, t: 'wan' }, length: 3 }];
      majiang.gangpais = [{ item: { v: 6, t: 'wan' }, length: 4 }];
      majiang.checkFan();
      expect(majiang.hupai.isDadui).toBe(true);
      expect(majiang.hupai.fan).toBe(2);
    });

    it('should calculate fan correctly for jingou', () => {
      majiang.shoupai = [
        [{ v: 1, t: 'wan' }, { v: 1, t: 'wan' }]
      ];
      majiang.pengpais = [{ item: { v: 2, t: 'wan' }, length: 3 }];
      majiang.gangpais = [{ item: { v: 3, t: 'wan' }, length: 4 }];
      majiang.checkFan();
      expect(majiang.hupai.isJingou).toBe(true);
      expect(majiang.hupai.fan).toBe(2);
    });
  });
});