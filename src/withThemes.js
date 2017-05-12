import _ from 'lodash'
import React from 'react'

import {
  withDefaults,
  decorateTheme,
  propTypesFromThemeTypes
} from './utils'

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

    if (!Component.themeTypes) {
      console.error(`Warning: Missing themeTypes on component ${Component.name}`)
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
