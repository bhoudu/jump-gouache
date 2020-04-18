import { consistentHash } from "./gouache";

describe('hashingUtil', () => {
  const jumps = new Map([
    [BigInt(0), [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]],
    [BigInt(1), [0, 0, 0, 0, 0, 0, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 17, 17]],
    [BigInt('0xdeadbeef'), [0, 1, 2, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 16, 16, 16]],
    [BigInt('0x0ddc0ffeebadf00d'), [0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 15, 15, 15, 15]],
  ]);

  it('Test jump consistent hash function', () => {
    jumps.forEach((expectedJumps, key) => {
      expectedJumps.forEach((expected, bucket) => {
        const computedBucket = consistentHash(key, bucket + 1);
        expect(computedBucket).toEqual(expected);
      });
    });
  });
});
