const combine = require('depject')
const entry = require('depject/entry')
const patchIntl = require('./')

const sockets = combine(patchIntl)
const format = entry(sockets, {
  intl: { format: 'first' }
}).intl.format

console.log('patch-intl', format('Patchwork', {}))
