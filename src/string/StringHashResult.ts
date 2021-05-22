export interface StringHashResult<T> {
  hash: T;
  bucket: number;
  bucketCount: number;
}
