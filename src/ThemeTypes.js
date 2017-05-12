export const TYPES = {
  className: 'className',
  themeOf: 'themeOf'
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

export default ThemeTypes
