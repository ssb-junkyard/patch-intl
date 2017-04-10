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
    if (is.undefined(formatters[currentLocale])) formatters[currentLocale] = {}
    if (is.undefined(formatters[currentLocale][messageKey])) {
      if (is.undefined(currentLocales[currentLocale])) {
        throw new Error(`patch-intl: ${currentLocale} locale not found in locales`)
      }
      if (is.undefined(currentLocales[currentLocale][messageKey])) {
        throw new Error(`patch-intl: ${messageKey} message not found in ${currentLocale} messages`)
      }
      var message
      eachLocale(currentLocale, nextLocale => {
        message = currentLocales[nextLocale][messageKey]
        if (message) return false // stop iterating on sub locales
      })
      formatters[currentLocale][messageKey] = new IntlMessageFormat(message, currentLocale, currentFormats)
    }
    return formatters[currentLocale][messageKey].format(value)
  }

  function formatNumber () {} // TODO
  function formatDate () {} // TODO
  function formatRelativeTime () {} // TODO
}

// iterate through locale and parent locales
// for example: en-US -> en
function eachLocale (locale, fn) {
  if (fn(locale) === false) return
  if (locale.indexOf('-') === -1) return
  const localeTags = locale.split('-')
  const parentLocaleTags = localeTags.slice(0, localeTags - 1)
  const parentLocale = parentLocaleTags.join('-')
  forEachSubLocale(parentLocale, fn)
}
