import _ from 'lodash'
import PropTypes from 'prop-types'

import { TYPES } from './ThemeTypes'

/**
 * Concatenate string values on objects when doing object merge operations
 *
 * @param {Object} dest - destination object
 * @param {Object} src - source object
 * @returns {Object} object wuth string values merged
 * @private
 */
export function mergeWithStrings (dest, src) {
  if (!dest) {
    return src
  }
  if (_.isString(dest)) {
    return `${dest} ${src}`
  }
  return _.mergeWith({}, dest, src, mergeWithStrings)
}

/**
 * Decorates theme with theme operators
 *
 * @param {Object} theme - theme to decorate
 * @returns {Object} theme with operators set
 * @private
 */
export function decorateTheme (theme) {
  return {
    ...theme,
    add: fragment => decorateTheme(_.mergeWith({}, theme, fragment, mergeWithStrings)),
    set: fragment => decorateTheme(_.merge({}, theme, fragment))
  }
}

/**
 * Set default values on missing theme components
 *
 * @param {Object} theme - theme to set defaults
 * @param {Object} themeTypes - theme types definition
 * @returns {Object} theme with defaults set
 * @private
 */
export function withDefaults (theme, themeTypes) {
  return _.mapValues(themeTypes, (value, key) => {
    if (value.$$typeof === TYPES.className) {
      return theme[key] || ''
    }
    if (value.$$typeof === TYPES.themeOf) {
      return theme[key] || value.type.themes.default
    }
  })
}

/**
 * Builds PropTypes shape based on ThemeTypes
 *
 * @param {Object} themeTypes - theme types definition
 * @returns {Object} propTypes shape for themeing
 * @private
 */
export function propTypesFromThemeTypes (themeTypes) {
  const shape = _.mapValues(themeTypes, type => {
    if (type.$$typeof === TYPES.className) {
      return PropTypes.string
    }
    if (type.$$typeof === TYPES.themeOf) {
      return type.type.propTypes.theme
    }
  })
  return {
    theme: PropTypes.shape(shape)
  }
}
