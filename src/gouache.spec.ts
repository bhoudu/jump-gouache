import {jump} from "./gouache";

describe('gouache', () => {
  it('Test jump consistent hash function with FNV1a', () => {
    jump(1, 1);
  });
});
