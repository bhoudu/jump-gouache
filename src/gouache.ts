import BigNumber from 'bignumber.js';
import Long from 'long';

const lcgConstant = Long.fromString('2862933555777941757');
const lcgDivisorConstant = new BigNumber('2147483648');

/**
 * Linear Congruential Generator to use for random floating number generation (PRNG).
 * This is a port from guava java library.
 * See http://en.wikipedia.org/wiki/Linear_congruential_generator
 *
 * @param seed to be used to spawn the PRNG
 * @return a random float value between 0 and 1
 */
export function* lcg(seed: BigNumber): Generator<BigNumber> {
  let state = Long.fromString(seed.toFixed());
  while (true) {
    state = lcgConstant.mul(state).add(1);
    const computedLong = state.shiftRightUnsigned(33).add(1);
    yield new BigNumber(computedLong.low).dividedBy(lcgDivisorConstant);
  }
}

/**
 * Jump consistent hash function ported from guava java library.
 * See https://arxiv.org/ftp/arxiv/papers/1406/1406.2294.pdf
 * See https://github.com/google/guava/blob/master/guava/src/com/google/common/hash/Hashing.java
 * See http://en.wikipedia.org/wiki/Consistent_hashing
 *
 * @param input in bigint or number format
 * @param bucketCount as an integer to indicate how many buckets are valid to route inputs to
 * @return computed bucket index to route the input to afterwards
 */
export function consistentHash(input: bigint | number, bucketCount: number): number {
  if (bucketCount < 1) {
    throw new Error(`Buckets must be positive: ${bucketCount}`);
  }
  const bigNumberInput = new BigNumber(input + '');
  const generator = lcg(bigNumberInput);
  let candidate = new BigNumber(0);
  let next = new BigNumber(-1);
  while (true) {
    const value = generator.next().value;
    next = candidate.plus(1).dividedBy(value).integerValue(BigNumber.ROUND_DOWN);
    if (next.isPositive() && next.isLessThan(bucketCount)) {
      candidate = next;
    } else {
      return candidate.toNumber();
    }
  }
}
