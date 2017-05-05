import React from 'react'
import ReactDOMServer from 'react-dom/server'
import PropTypes from 'prop-types'

import { html } from 'js-beautify'

import withThemes, { ThemeTypes } from './src'

var GrandChild = ({ theme }) => (
  <div>
    <div className={theme.heading}>GRAND</div>
  </div>
)

GrandChild.themeTypes = {
  heading: ThemeTypes.className
}

GrandChild = withThemes({
  default: {
    heading: 'base_grand'
  }
})(GrandChild)

// --

var Child = ({ theme }) => (
  <div>
    <div className={theme.heading}>BAR</div>
    <div className={theme.body}>FOOBAR</div>
    <GrandChild theme={theme.grand} />
  </div>
)

Child.foo = 'BAR'

Child.themeTypes = {
  heading: ThemeTypes.className,
  body: ThemeTypes.className,
  grand: ThemeTypes.themeOf(GrandChild)
}

Child = withThemes({
  default: {
    heading: 'base_hed',
    body: 'base_body',
    grand: GrandChild.themes.default
  }
})(Child)

// --

var Test = ({ prop1, theme }) => (
  <div>
    <div className={theme.heading}>FOO</div>
    <Child theme={theme.child1} />
    <Child theme={theme.child2} />
  </div>
)

Test.propTypes = {
  prop1: PropTypes.string
}

Test.themeTypes = {
  heading: ThemeTypes.className,
  child1: ThemeTypes.themeOf(Child),
  child2: ThemeTypes.themeOf(Child)
}

const THEMES = {
  bla: {
    heading: 'base_hed',
    child1: Child.themes.default.add({
      heading: 'child1'
    })
  },
  other: {
    heading: 'other_base_hed'
  }
}

Test = withThemes(THEMES, THEMES.other)(Test)

// --

// const theme = Test.themes.default.add({
//   heading: 'added_heading',
//   child1: {
//     heading: 'added_heading_grand'
//   }
// })

const element = (
  <Test prop1={1} theme={Test.themes.blaa} />
)

console.log(html(ReactDOMServer.renderToStaticMarkup(element), { indent_size: 2 }))
