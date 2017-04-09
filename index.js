const is = require('typeof-is')
const nest = require('depnest')
const IntlMessageFormat = require('intl-messageformat')

exports.gives = nest('intl.sync', [
  'locale',
  'locales',
  'formats',
  'format',
  'formatNumber',
  'formatDate',
  'formatRelativeTime'
])

exports.needs = nest('intl.sync', {
  locale: 'first',
  locales: 'reduce',
  formats: 'reduce'
})

exports.create = function (api) {
  const {
    locale: getLocale,
    locales: getLocales,
    formats: getFormats
  } = api.intl.sync

  var formatters = {}

  return nest('intl.sync', {
    locale,
    locales,
    formats,
    format,
    formatNumber,
    formatDate,
    formatRelativeTime
  })

  function locale () {
    return 'en'
  }

  function locales () {
    return require('./locales')
  }

  function formats () {
    return require('./formats')
  }

  function format (messageKey, value) {
    const currentLocale = getLocale()
    const currentLocales = getLocales()
    const currentFormats = getFormats()
    if (is.undefined(formatters[messageKey])) {
      if (is.undefined(currentLocales[currentLocale])) {
        throw new Error(`patch-intl: ${currentLocale} locale not found in locales`)
      }
      if (is.undefined(currentLocales[currentLocale][messageKey])) {
        throw new Error(`patch-intl: ${messageKey} message not found in ${currentLocale} messages`)
      }
      const message = currentLocales[currentLocale][messageKey]
      formatters[messageKey] = new IntlMessageFormat(message, currentLocale, currentFormats)
    }
    return formatters[messageKey].format(value)
  }

  function formatNumber () {} // TODO
  function formatDate () {} // TODO
  function formatRelativeTime () {} // TODO
}
