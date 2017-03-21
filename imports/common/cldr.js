var plural = require('plurals-cldr');

export default (locale ,number) => {
  return plural(locale, number)
}
