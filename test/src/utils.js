import expect from 'must'

import {
  withDefaults,
  mergeWithStrings
} from '../../src/utils'

describe('mergeWithStrings', () => {
  it('returns `src` when `dest` is undefined', () => {
    const dest = undefined
    const src = {}
    const result = mergeWithStrings(dest, src)

    expect(result).to.be.equal(src)
  })

  it('returns `dest` and `src` concatenated if `dest` is a string', () => {
    const dest = 'dest'
    const src = 'src'
    const result = mergeWithStrings(dest, src)
    const expected = 'dest src'

    expect(result).to.be.eql(expected)
  })

  it('returns object with string values from `dest` if `src` is empty objects', () => {
    const dest = { key: 'dest' }
    const src = {}
    const result = mergeWithStrings(dest, src)
    const expected = { key: 'dest' }

    expect(result).to.be.eql(expected)
  })

  it('returns object with string values from `src` if `dest` is empty objects', () => {
    const dest = {}
    const src = { key: 'dest' }
    const result = mergeWithStrings(dest, src)
    const expected = { key: 'dest' }

    expect(result).to.be.eql(expected)
  })

  it('returns object with string values with same key from `dest` and `src` concatenated if `src` and `dest` are objects', () => {
    const dest = { key: 'dest', foo: 'foo' }
    const src = { key: 'src', bar: 'bar' }
    const result = mergeWithStrings(dest, src)
    const expected = { key: 'dest src', foo: 'foo', bar: 'bar' }

    expect(result).to.be.eql(expected)
  })
})

describe('withDefaults', () => {
  it('returns an object with all the keys as the `themeTypes` object argument', () => {
    const theme = {}
    const themeTypes = { key1: 'key1', key2: 'key2' }
    const result = withDefaults(theme, themeTypes)
    const expected = Object.keys(themeTypes)

    expect(result).to.have.keys(expected)
  })

  it('returns an object with empty string values for all the keys that aren\'t present in `theme` but exist in `themeTypes` with value `$$typeof` equals to className ', () => {
    const theme = {}
    const themeTypes = { key1: { $$typeof: 'className' } }
    const result = withDefaults(theme, themeTypes)
    const expected = { key1: '' }

    expect(result).to.be.eql(expected)
  })
})
