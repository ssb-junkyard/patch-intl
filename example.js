const combine = require('depject')
const entry = require('depject/entry')
const nest = require('depnest')

const patchIntl = require('./')

const sockets = combine(patchIntl)
const format = entry(
  sockets,
  nest('intl.sync.format', 'first')
).intl.sync.format

console.log('patch-intl', format('Patchwork', {}))
