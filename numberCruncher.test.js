'use sctrict';

function factorsOf(number) {
  if (Number.isNaN(Number(number))) {
    throw new RangeError('Argument Error: Value must be an integer');
  }

  if (number < 0) {
    throw new RangeError('Argument must be a positive number');
  }

  if (!Number.isInteger(number)) {
    throw new RangeError('Argument Error: Value must be an integer');
  }

  const factors = [];
  for (let i = 0, max = Math.sqrt(number); i <= max; i++) {
    if (number % i === 0) factors.push(i, number/i);
  }
  return factors.sort((a,b) => a-b);
}

test ('factors of 12', () => {
expect(factorsOf(12)).toEqual([1,2,3,4,6,12]);
});

test ('2 is prime', () => {
  expect(isPrime(2)).toBe(true);
});

test ('10 is not prime', () => {
  expect(isPrime(10)).not.toBe(true);
});

function isPrime(n) {
  try {
    return factorsOf(n).length === 2;
  } catch(error) {
    return false;
  }
}

it ('should throw an exception for non-numeric data', () => {
  expect(() => factorsOf('twelve')).toThrow();
})

it ('should throw an exception for negative numbers', () => {
  expect(() => factorsOf(-2)).toThrow();
})

it ('should throw an exception for non-integer numbers', () => {
  expect(() => factorsOf(-2.7)).toThrow();
})

test ('non-numeric data returns not prime', () => {
  expect(isPrime('two')).toBe(false);
})

test ('non-integer data returns not prime', () => {
  expect(isPrime(3.24)).toBe(false);
})

test ('negative data returns not prime', () => {
  expect(isPrime(-2)).toBe(false);
})
