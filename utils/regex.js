var VerEx = require('verbal-expressions');

module.exports.url = VerEx()
  .startOfLine()
  .then('http')
  .maybe('s')
  .then('://')
  .maybe('www.')
  .anythingBut(' ')
  .endOfLine();
