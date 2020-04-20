[![npm version](https://badge.fury.io/js/jump-gouache.svg)](https://badge.fury.io/js/jump-gouache) [![Build Status](https://travis-ci.com/bhoudu/jump-gouache.svg?branch=master)](https://travis-ci.com/bhoudu/jump-gouache)

# Jump-Gouache

This is a port of Guava consistent hash function in TypeScript alias the jump guava hash algorithm, in short `jump-gouache`.

Jump-Gouache was created as there was no fully compatible library of this algorithm available for nodejs runtime.

This aims at computing the same bucket index from a 32 bit or 64 bit integer and buckets as in Guava, thus using the same Linear Congruential Generator as in Guava with the same constants.

This library produces the same outputs as many other libraries that implement the jump consistent hash algorithm. For instance :
- [Guava](https://github.com/google/guava) in Java (of course)
- [Go-jump-consistent-hash](https://github.com/lithammer/go-jump-consistent-hash) in Golang
- [jump-consistent-hash](https://pypi.org/project/jump-consistent-hash/) in Python
- [jump-consistent-hash](https://docs.rs/jump-consistent-hash) in Rust

This library is made with compatibility in mind, all used algorithms are standard so it should work nicely in environments where there are lots of different tech stacks.

## Usage

Just import the function and start hashing. The basic consistentHash function accepts `number` and `bigint` values.

    import { consistentHash } from 'jump-gouache';
     
    const bucketIndexNumber = consistentHash(45645664, 100);
    const bucketIndexBigInt = consistentHash(BigInt('0xdeadbeef'), 100);

It is also possible to use a string as input, the hashing of the string into an integer is made with `fnv-plus`.
`FNV-1a` algorithm is very fast and designed for uniqueness.

    import { fnvConsistentHash, FNV1AHashMode } from 'jump-gouache';
        
    const hash32Result = fnvConsistentHash(
        'Text that will be hashed with FNV-1a into a 32 bit integer', 
         100);
    const bucket32 = hash32Result.bucket;
    const hash32 = hash32Result.hash;
    
    const hash64Result = fnvConsistentHash(
        'Text that will be hashed with FNV-1a into a 64 bit integer', 
        100, 
        FNV1AHashMode.FNV1A_64);
    const bucket64 = hash64Result.bucket;
    const hash64 = hash64Result.hash;

The 32 bit mode is the default mode, it is way faster than the 64 bit one. It all depends if you want to use a wider range of hashed values from strings.
Wider range means more unique hashed integer values and better distribution from jump consistent hash at the expense of more computation due to more 64 bit operations.

Another choice is to use MurmurHash3 thanks to `murmurhash3js`:

    import { murmurConsistentHash } from 'jump-gouache';
    
    const hash32Result = murmurConsistentHash(
        'Text that will be hashed with MurmurHash3 into a 32 bit integer', 
        100);
    const bucket32 = hash32Result.bucket;
    const hash32 = hash32Result.hash;

## Compatibility & dependencies

Jump-gouache is compatible node 10 & node 12+. It does not require using esnext as targeted runtime.

Dependencies that are used:
- [Long](https://www.npmjs.com/package/long) : necessary for using 64 bit integer values and bitwise operations on such integers
- [Bignumber.js](https://www.npmjs.com/package/bignumber.js) : necessary for using 64 bit float values
- [FNV-plus](https://www.npmjs.com/package/fnv-plus) : used to hash strings into integers (32 bit or 64 bit)
- [Murmurhash3js](https://www.npmjs.com/package/murmurhash3js) : used to hash strings into integers (32 bit only)
