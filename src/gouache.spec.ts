import { consistentHash, FNV1AHashMode, fnvConsistentHash, murmurConsistentHash } from './gouache';

describe('hashingUtil', () => {
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
        const computedBucket = consistentHash(key, bucket + 1);
        expect(computedBucket).toEqual(expected);
      });
    });
  });

  it('Test jump consistent hash function compatibility', () => {
    compatibilityTests.forEach(test => {
      const index = consistentHash(test.input, test.bucketCount);
      expect(index).toEqual(test.expected);
    });
  });

  it('Test jump consistent hash function with FNV1a', () => {
    const index32 = fnvConsistentHash('gou4che4ftwuEQzP6SsUR89gbY2', 100, FNV1AHashMode.FNV1A_32);
    expect(index32.bucket).toEqual(39);
    expect(index32.hash).toEqual(2566704832);
    const index64 = fnvConsistentHash('gou4che4ftwuEQzP6SsUR89gbY2', 100, FNV1AHashMode.FNV1A_64);
    expect(index64.bucket).toEqual(69);
    expect(index64.hash + '').toEqual('11786985376615240320');
  });

  it('Test jump consistent hash function with MurmurHash3', () => {
    const index32 = murmurConsistentHash('gou4che4ftwuEQzP6SsUR89gbY2', 100);
    expect(index32.bucket).toEqual(46);
    expect(index32.hash).toEqual(1842701211);
  });
});
