import expect from 'must'

import withThemes from '../../src/withThemes'

withThemes.__Rewire__('withDefaults', () => {})
withThemes.__Rewire__('decorateTheme', () => {})
withThemes.__Rewire__('propTypesFromThemeTypes', themeTypes => themeTypes)

describe('withThemes', () => {
  it('is a function', () => {
    const result = typeof withThemes
    const expected = 'function'

    expect(result).to.be.equal(expected)
  })

  describe('returned HOC factory', () => {
    const hocFactory = withThemes()

    it('is a function', () => {
      const result = typeof hocFactory
      const expected = 'function'

      expect(result).to.be.equal(expected)
    })

    describe('returned Component', () => {
      const Component = () => {}
      const component = hocFactory(Component)

      it('exposes the wrapped component', () => {
        const result = component.WrappedComponent

        expect(result).to.be.equal(Component)
      })

      it('exposes propTypes based on ThemeTypes', () => {
        const Component = () => {}
        const themeTypes = {}
        Component.themeTypes = themeTypes
        const result = hocFactory(Component).propTypes

        expect(result).to.be.equal(themeTypes)
      })
    })
  })
})
