import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

const TYPES = {
  className: 'className',
  themeOf: 'themeOf'
}

/**
 * Merge string values on object when doing merge operations
 *
 * @param {Object} dest - destination object
 * @param {Object} src - source object
 * @returns {Object} object wuth string values merged
 * @private
 */
function mergeWithStrings (dest, src) {
  if (!dest) {
    return src
  }
  if (_.isString(dest)) {
    return `${dest} ${src}`
  }
  return _.mergeWith({}, dest, src, mergeWithStrings)
}

/**
 * Set default values on missing theme components
 *
 * @param {Object} theme - theme to set defaults
 * @param {Object} themeTypes - theme types definition
 * @returns {Object} theme with defaults set
 * @private
 */
function withDefaults (theme, themeTypes) {
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
 * Decorates theme with theme operators
 *
 * @param {Object} theme - theme to decorate
 * @returns {Object} theme with operators set
 * @private
 */
function decorateTheme (theme) {
  return {
    ...theme,
    add: fragment => decorateTheme(_.mergeWith({}, theme, fragment, mergeWithStrings)),
    set: fragment => decorateTheme(_.merge({}, theme, fragment))
  }
}

/**
 * Builds PropTypes shape based on ThemeTypes
 *
 * @param {Object} themeTypes - theme types definition
 * @returns {Object} propTypes shape for themeing
 * @private
 */
function propTypesFromThemeTypes (themeTypes) {
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

/**
 * Theme types
 */
export const ThemeTypes = {
  className: {
    $$typeof: TYPES.className
  },
  // TODO: check that type match ThemeHOC
  themeOf: type => ({
    $$typeof: TYPES.themeOf,
    type
  })
}

/**
 * HOC provider for compoenent theming
 *
 * @param {Object} Component - component to apply themeing
 * @param {Object} themeTypes - theme types definition
 * @param {Object} [themes] - available themes
 * @param {Object} [defaultTheme] - default themes
 * @returns {Object} React element
 */
export default function withThemes (themes = {}, defaultTheme = {}) {
  return Component => {
    function ThemeProvider ({ theme = ThemeProvider.themes.default, ...props }) {
      return <Component {...props} theme={theme} />
    }

    const themeTypes = Component.themeTypes || {}
    const themesWithDefault = {
      default: defaultTheme,
      ...themes
    }

    ThemeProvider.themes = _.mapValues(themesWithDefault, theme => decorateTheme(withDefaults(theme, themeTypes)))
    ThemeProvider.propTypes = propTypesFromThemeTypes(themeTypes)
    ThemeProvider.WrappedComponent = Component

    return ThemeProvider
  }
}
