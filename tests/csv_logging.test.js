const csvl = require('../src/include/csv_logging');

// https://jestjs.io/docs/expect#expectstringmatchingstring--regexp
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions


test('Date-Time function test', () => {

  const expected = [

    expect.stringMatching(/^\d{1,2}_\d{1,2}_\d{4}/gm),
    expect.stringMatching(/\d{1,2}:\d{1,2}:\d{1,2}/gm)

  ];

  expect(csvl.get_date_time()).toEqual(expect.arrayContaining(expected));

});
