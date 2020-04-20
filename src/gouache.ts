import BigNumber from 'bignumber.js';
// @ts-ignore
import Long from 'long';
import fnv from 'fnv-plus';
import murmurHash3 from 'murmurhash3js';

const lcgConstant = Long.fromString('2862933555777941757');
const lcgDivisorConstant = new BigNumber('2147483648');

/**
 * Linear Congruential Generator to use for random floating number generation (PRNG).
 * This is a port from guava java library, outputs are the same as in Guava.
 * Note that to be compatible, it is required internally to support bit-wise operations
 * on true 64-bit integers the library `long` enables this and is widely compatible.
 * To support 64-bit float values, the library `bignumber.js` is used as it is battle hardened.
 *
 * See http://en.wikipedia.org/wiki/Linear_congruential_generator
 *
 * @param seed to be used to spawn the PRNG
 * @return a random float value between 0 and 1
 */
export function* lcg(seed: number | bigint): Generator<BigNumber> {
  let state = Long.fromString(seed + '');
  while (true) {
    state = lcgConstant.mul(state).add(1);
    const computedLong = state.shiftRightUnsigned(33).add(1);
    yield new BigNumber(computedLong.low).dividedBy(lcgDivisorConstant);
  }
}

/**
 * Jump consistent hash function ported from guava java library.
 *
 * See https://arxiv.org/ftp/arxiv/papers/1406/1406.2294.pdf
 * See https://github.com/google/guava/blob/master/guava/src/com/google/common/hash/Hashing.java
 * See https://github.com/google/guava/blob/master/guava-tests/test/com/google/common/hash/HashingTest.java
 * See http://en.wikipedia.org/wiki/Consistent_hashing
 *
 * @param input as number or bigint value
 * @param bucketCount as a positive integer to indicate how many buckets are valid to route inputs to
 * @return computed bucket index matched for given input
 */
export function consistentHash(input: number | bigint, bucketCount: number): number {
  if (bucketCount < 1) {
    throw new Error(`Buckets must be positive: ${bucketCount}`);
  }
  const generator = lcg(input);
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

export enum FNV1AHashMode {
  FNV1A_32, FNV1A_64
}

export interface StringHashResult<T> {
  hash: T;
  bucket: number;
}

/**
 * Jump consistent hash function based on a string input.
 * As jump algorithm requires a 32 or 64 bit long integer, the string input is hashed thanks to FNV1a.
 * It is easier to hash an object into a string in most cases, so this function helps.
 *
 * @param input as a string
 * @param bucketCount as a positive integer to indicate how many buckets are valid to route inputs to
 * @param mode of FNV-1a to use (hash the input into a 32 bit or 64 bit value) before using jump algorithm
 * @return computed hash and bucket
 */
export function fnvConsistentHash(
  input: string,
  bucketCount: number,
  mode: FNV1AHashMode = FNV1AHashMode.FNV1A_32,
): StringHashResult<number | bigint> {
  switch (mode) {
    case FNV1AHashMode.FNV1A_64: {
      const input64: string = fnv.fast1a64(input);
      const hash = BigInt('0x' + input64);
      return {
        bucket: consistentHash(hash, bucketCount),
        hash,
      };
    }
    case FNV1AHashMode.FNV1A_32:
    default: {
      const input32: number = fnv.fast1a32(input);
      return {
        bucket: consistentHash(input32, bucketCount),
        hash: input32,
      };
    }
  }
}

/**
 * Jump consistent hash function based on a string input.
 * As jump algorithm requires a 32 or 64 bit long integer, the string input is hashed thanks to MurmurHash3.
 * It is easier to hash an object into a string in most cases, so this function helps.
 *
 * @param input as a string
 * @param bucketCount as a positive integer to indicate how many buckets are valid to route inputs to
 * @return computed hash and bucket
 */
export function murmurConsistentHash(input: string, bucketCount: number): StringHashResult<number> {
  const input32: number = murmurHash3.x86.hash32(input);
  return {
    bucket: consistentHash(input32, bucketCount),
    hash: input32,
  };
}
