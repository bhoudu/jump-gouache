import { murmurConsistentHash } from "./murmur3";

describe("murmur3", () => {
	it("Test jump consistent hash function with MurmurHash3", () => {
		const index32 = murmurConsistentHash("gou4che4ftwuEQzP6SsUR89gbY2", 100);
		expect(index32.bucket).toEqual(46);
		expect(index32.hash).toEqual(1842701211);
	});
});
