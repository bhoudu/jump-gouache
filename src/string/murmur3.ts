import murmurHash3 from 'murmurhash3js';
import { StringHashResult } from "./StringHashResult";
import { jump } from "../jump";

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
    hash: input32,
    bucket: jump(input32, bucketCount),
    bucketCount,
  };
}
