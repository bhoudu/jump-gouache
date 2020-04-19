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

Usage is straight forward:

    import { consistentHash } from 'jump-gouache';
    
    // getting the index of the bucket to route the item of value 45645664
    // there are 100 buckets    
    const bucketIndex = consistentHash(45645664, 100);

It is also possible to use a string as input, the hashing of the string into an integer is made with `fnv-plus`.
`FNV-1a` algorithm is very fast and designed for uniqueness.

    import { fnvConsistentHash } from 'jump-gouache';
        
    // getting the index of the bucket to route the item of value 45645664
    // there are 100 buckets    
    const bucketIndex32 = fnvConsistentHash("Hello world hashed in FNV1a 32 bit value!", 100);
    const bucketIndex64 = fnvConsistentHash("Hello world hashed in FNV1a 64 bit value!", 100);

The 32 bit mode is the default mode, it is way faster than the 64 bit one. It all depends if you want to use a wider range of hashed values from strings (and afford more compute time).

## Compatibility & dependencies

Jump-gouache is compatible node 10 & node 12+. It does not require using esnext as targeted runtime.

Dependencies that are used:
- [Long](https://www.npmjs.com/package/long) : necessary for using 64 bit integer values and bitwise operations on such integers
- [Bignumber.js](https://www.npmjs.com/package/bignumber.js) : necessary for using 64 bit float values
- [FNV-plus](https://www.npmjs.com/package/fnv-plus) : used to hash strings into integers (32 bit or 64 bit)
