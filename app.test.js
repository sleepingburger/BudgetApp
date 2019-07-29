const sum = require('./app');

test('adds 2 and 3 to equal 5', addNumber);


function addNumber() {
    expect(sum(2, 3)).toBe(7);
}