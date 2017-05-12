import expect from 'must'

import ThemeTypes, { TYPES } from '../../src/ThemeTypes'

describe('ThemeTypes', () => {
  it('is an object', () => {
    const result = typeof ThemeTypes
    const expected = 'object'

    expect(result).to.be.equal(expected)
  })

  describe('className', () => {
    it('is an object with `$$typeof` from `TYPES` enum', () => {
      const result = ThemeTypes.className.$$typeof
      const expected = TYPES.className

      expect(result).to.be.equal(expected)
    })
  })

  describe('themeOf', () => {
    it('is a function', () => {
      const result = typeof ThemeTypes.themeOf
      const expected = 'function'

      expect(result).to.be.equal(expected)
    })

    it('returns an object with `$$typeof` from `TYPES` enum', () => {
      const result = ThemeTypes.themeOf().$$typeof
      const expected = TYPES.themeOf

      expect(result).to.be.equal(expected)
    })

    it('returns an object with property `type` equals to it\'s argument `type`', () => {
      const type = {}
      const result = ThemeTypes.themeOf(type).type

      expect(result).to.be.equal(type)
    })
  })
})
