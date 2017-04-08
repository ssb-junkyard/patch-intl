const test = require('tape')

const patchIntl = require('../')

test('patch-intl', function (t) {
  t.ok(patchIntl, 'module is require-able')
  t.end()
})
