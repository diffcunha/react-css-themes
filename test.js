import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { html } from 'js-beautify'

import withThemes, { ThemeTypes } from './src'

var GrandChild = ({ theme }) => (
  <div>
    <div className={theme.heading}>GRAND</div>
  </div>
)

GrandChild = withThemes(GrandChild, {
  heading: ThemeTypes.className
}, {
  default: {
    heading: 'base_grand'
  }
})

// --

var Child = ({ theme }) => (
  <div>
    <div className={theme.heading}>BAR</div>
    <div className={theme.body}>FOOBAR</div>
    <GrandChild theme={theme.grand} />
  </div>
)

Child.foo = 'BAR'

Child = withThemes(Child, {
  heading: ThemeTypes.className,
  body: ThemeTypes.className,
  grand: ThemeTypes.themeOf(GrandChild)
}, {
  default: {
    heading: 'base_hed',
    body: 'base_body',
    grand: GrandChild.themes.default
  }
})

// --

var Test = ({ theme }) => (
  <div>
    <div className={theme.heading}>FOO</div>
    <Child theme={theme.child1} />
    <Child theme={theme.child2} />
  </div>
)

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

Test = withThemes(Test, {
  heading: ThemeTypes.className,
  child1: ThemeTypes.themeOf(Child),
  child2: ThemeTypes.themeOf(Child)
}, THEMES, THEMES.other)

// --

// const theme = Test.themes.default.add({
//   heading: 'added_heading',
//   child1: {
//     heading: 'added_heading_grand'
//   }
// })

const element = (
  <Test theme={Test.themes.bla} />
)

console.log(html(ReactDOMServer.renderToStaticMarkup(element), { indent_size: 2 }))
