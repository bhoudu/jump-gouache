import { fnvConsistentHash } from "./fnv1a";

describe('hashingUtil', () => {
  it('Test jump consistent hash function with FNV1a', () => {
    const index32 = fnvConsistentHash('gou4che4ftwuEQzP6SsUR89gbY2', 100, 'FNV1A_32');
    expect(index32.bucket).toEqual(39);
    expect(index32.hash).toEqual(2566704832);
    const index64 = fnvConsistentHash('gou4che4ftwuEQzP6SsUR89gbY2', 100, 'FNV1A_64');
    expect(index64.bucket).toEqual(69);
    expect(index64.hash + '').toEqual('11786985376615240320');
  });
});
