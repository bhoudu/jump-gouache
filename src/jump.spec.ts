import { jump } from "./jump";

describe('jump', () => {
  const jumps = new Map([
    [BigInt(0), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    [BigInt(1), [0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 17, 17]],
    [BigInt('0xdeadbeef'), [0, 1, 2, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 16, 16, 16]],
    [BigInt('0x0ddc0ffeebadf00d'), [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 15, 15, 15, 15]],
  ]);
  const compatibilityTests = [
    { input: 256, bucketCount: 1024, expected: 520 },
    { input: 1, bucketCount: 60, expected: 55 },
    { input: 2, bucketCount: 60, expected: 46 },
  ];

  it('Test jump consistent hash function', () => {
    jumps.forEach((expectedJumps, key) => {
      expectedJumps.forEach((expected, bucket) => {
        const computedBucket = jump(key, bucket + 1);
        expect(computedBucket).toEqual(expected);
      });
    });
  });

  it('Test jump consistent hash function compatibility', () => {
    compatibilityTests.forEach(test => {
      const index = jump(test.input, test.bucketCount);
      expect(index).toEqual(test.expected);
    });
  });

  it('Test bad bucketCount value', () => {
    const index = jump(123, -1);
    expect(index).toEqual(-1);
    const indexNull = jump(123, null);
    expect(indexNull).toEqual(-1);
  });
});
