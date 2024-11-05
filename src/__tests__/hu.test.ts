import { Majiang } from '../hu'; // 确保路径正确

describe('Majiang', () => {
  const majiang: Majiang = new Majiang();

  test('七对', () => {    

    // 定义测试用例，这里只给出一个简单的测试用例，您需要添加更多的测试用例来覆盖不同情况
    const shoupai: Pai[][] = [
      // 手牌，需要按特定格式定义，这里只是一个示例
      [
        { v: 1, t: 'wan' }, { v: 1, t: 'wan' }, 
        { v: 2, t: 'wan' }, { v: 2, t: 'wan' }, 
        { v: 3, t: 'wan' }, { v: 3, t: 'wan' },
        { v: 4, t: 'wan' }, { v: 4, t: 'wan' },
        { v: 5, t: 'wan' }, { v: 5, t: 'wan' },
        { v: 6, t: 'wan' }, { v: 6, t: 'wan' },
        { v: 7, t: 'wan' }, { v: 7, t: 'wan' }
      ]
      // 可以有多个数组，每个数组代表不同的牌组
    ];
    const pengpais: Kezi[] = []; // 副风
    const gangpais: Gangzi[] = []; // 杠

    // 对于这个简单的测试用例，我们期望结果为true
    expect(majiang.ishuPai(shoupai, pengpais, gangpais)).toBe(true);
    expect(majiang.hupai.isQingyise).toBe(true);
    expect(majiang.hupai.isDuanyao).toBe(false);
    expect(majiang.hupai.daigen).toBe(0);
    expect(majiang.hupai.fan).toBe(16);

    // 添加更多测试用例
    // ...
  });

  test('平胡', () => {
    const shoupai:Pai[][] = [
      [
        { v: 1, t: 'wan' }, { v: 2, t: 'wan' }, { v: 3, t: 'wan' },
        { v: 3, t: 'wan' }, { v: 3, t: 'wan' }, { v: 3, t: 'wan' },         
        { v: 7, t: 'wan' }, { v: 8, t: 'wan' }, { v: 9, t: 'wan' }        
      ],
      [
        { v: 7, t: 'tiao' }, { v: 7, t: 'tiao' },
        { v: 7, t: 'tiao' }, { v: 8, t: 'tiao' },{ v: 9, t: 'tiao' }
      ]
    ];
    const pengpais:Kezi[] = []; 
    const gangpais:Gangzi[] = []; 

    expect(majiang.ishuPai(shoupai, pengpais, gangpais)).toBe(true);
  });

  test('大对子', () => {
    // const shoupai:Pai[][] = [
    //   [
    //     { v: 2, t: 'wan' }, { v: 2, t: 'wan' }, { v: 2, t: 'wan' },
    //     { v: 3, t: 'wan' }, { v: 3, t: 'wan' }, { v: 3, t: 'wan' },         
    //     { v: 8, t: 'wan' }, { v: 8, t: 'wan' }, { v: 8, t: 'wan' }        
    //   ],
    //   [
    //     { v: 7, t: 'tiao' }, { v: 7, t: 'tiao' }
    //   ]
    // ];
    // const pengpais:Kezi[] = [{item:{ v: 5, t: 'tiao' },length:3}]; 
    // const gangpais:Gangzi[] = []; 

    // expect(majiang.ishuPai(shoupai, pengpais, gangpais)).toBe(true);
    // expect(majiang.hupai.isQingyise).toBe(false);
    // expect(majiang.hupai.isDuanyao).toBe(true);
    // expect(majiang.hupai.isDadui).toBe(true);
    // expect(majiang.hupai.isJingou).toBe(false);
    // expect(majiang.hupai.daigen).toBe(0);
    // expect(majiang.hupai.fan).toBe(2*2);


    const shoupai:Pai[][] = [
      [
        { v: 7, t: 'tiao' }, { v: 7, t: 'tiao' }
      ]
    ];
    const pengpais:Kezi[] = [
      {item:{ v: 5, t: 'tiao' },length:3},
      {item:{ v: 2, t: 'wan' },length:3},
      {item:{ v: 3, t: 'wan' },length:3}
    ]; 
    const gangpais:Gangzi[] = [
      {item:{ v: 8, t: 'wan' },length:4}
    ]; 

    expect(majiang.ishuPai(shoupai, pengpais, gangpais)).toBe(true);
    expect(majiang.hupai.isQingyise).toBe(false);
    expect(majiang.hupai.isDuanyao).toBe(true);
    expect(majiang.hupai.isDadui).toBe(true);
    expect(majiang.hupai.isJingou).toBe(true);
    expect(majiang.hupai.daigen).toBe(1);
    expect(majiang.hupai.fan).toBe(2*2*2*2);
  });

  // 更多测试方法
  // ...
});