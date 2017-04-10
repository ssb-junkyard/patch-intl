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

  function locales (sofar = {}) {
    return sofar
  }

  function formats (sofar = {}) {
    return sofar
  }

  function format (messageKey, value) {
    const currentLocale = getLocale()
    const currentLocales = getLocales()
    const currentFormats = getFormats()
    if (is.undefined(formatters[currentLocale])) formatters[currentLocale] = {}
    if (is.undefined(formatters[currentLocale][messageKey])) {
      const subLocales = getSubLocales(currentLocale)
      if (!subLocales.some(nextLocale => !is.undefined(currentLocales[nextLocale]))) {
        throw new Error(`patch-intl: ${currentLocale} locale not found in locales`)
      }
      var message
      for (var i = 0; i < subLocales.length; i++) {
        const nextLocale = subLocales[i]
        if (is.undefined(currentLocales[nextLocale])) continue
        else if (is.undefined(currentLocales[nextLocale][messageKey])) continue
        else {
          message = currentLocales[nextLocale][messageKey]
          break
        }
      }
      if (is.undefined(message)) {
        throw new Error(`patch-intl: ${messageKey} message not found in ${currentLocale} messages`)
      }
      formatters[currentLocale][messageKey] = new IntlMessageFormat(message, currentLocale, currentFormats)
    }
    return formatters[currentLocale][messageKey].format(value)
  }

  function formatNumber () {} // TODO
  function formatDate () {} // TODO
  function formatRelativeTime () {} // TODO
}

// iterate through locale and parent locales
// for example: en-US -> [en-US, en]
function getSubLocales (locale) {
  var subLocales = [locale]
  while (locale.indexOf('-') !== -1) {
    const localeTags = locale.split('-')
    const parentLocaleTags = localeTags.slice(0, localeTags.length - 1)
    const parentLocale = parentLocaleTags.join('-')
    subLocales.push(parentLocale)
    locale = parentLocale
  }
  return subLocales
}
