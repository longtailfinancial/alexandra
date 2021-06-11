const sum = require('../src/include/sum');

test('adds 1 + 2 to equal 3', () => {
  
  expect(sum(1,2)).toBe(3);
});
