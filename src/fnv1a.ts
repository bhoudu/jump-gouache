import fnv from 'fnv-plus';
import { jump } from "./jump";

export type FNV1AHashMode = 'FNV1A_64' | 'FNV1A_32';

export interface StringHashResult<T> {
  hash: T;
  bucket: number;
  bucketCount: number;
}

/**
 * Jump consistent hash function based on a string input.
 * As jump algorithm requires a 32 or 64 bit long integer, the string input is hashed thanks to FNV1a.
 * It is easier to hash an object into a string in most cases, so this function helps.
 *
 * @param input as a string
 * @param bucketCount as a positive integer to indicate how many buckets are valid to route inputs to
 * @param mode of FNV-1a to use (hash the input into a 32 or 64 bit value) before using jump algorithm. Default is 64.
 * @return computed hash and bucket
 */
export function fnvConsistentHash(
  input: string,
  bucketCount: number,
  mode: FNV1AHashMode = 'FNV1A_64',
): StringHashResult<number | bigint> {
  switch (mode) {
    case 'FNV1A_32': {
      const input32: number = fnv.fast1a32(input);
      return {
        hash: input32,
        bucket: jump(input32, bucketCount),
        bucketCount,
      };
    }
    case 'FNV1A_64':
    default: {
      const input64: string = fnv.fast1a64(input);
      const hash = BigInt('0x' + input64);
      return {
        bucket: jump(hash, bucketCount),
        hash,
        bucketCount,
      };
    }
  }
}
