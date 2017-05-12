[![npm version](https://img.shields.io/npm/v/react-css-themes.svg?style=flat-square)](https://www.npmjs.com/package/react-css-themes)

# react-css-themes

Theme provider for React components using CSS modules.

**Key Features**
- Themable components expose API to allow external theming
- Easy to change themes of deeply nested themable components

## Table of contents

* [Installation](#installation)
* [Usage [API]](#usage-api)
  * [`withThemes`](#withthemesthemetypes-themes-defaulttheme)
  * [`ThemeTypes`](#themetypes)
  * [`Component.themes`](#componentthemes)
    * [`add`](#addfragment)
* [Examples](#examples)
  * [Basic theming](#basic-theming)
  * [Composing themable components](#composing-themable-components)
  * [Adding classNames to a deeply nested themeable child](#adding-classnames-to-a-deeply-nested-themeable-child)
* [About](#about)
* [License](#license)

## Installation

`npm i --save react-css-themes`

## Usage [API]

#### `withThemes(themeTypes, [themes], [defaultTheme])`

##### Arguments:

- `themeTypes` *(`Object`)* - Theme types definition
- `themes` *(`Object`)* - The available themes
- `defaultTheme` *(`Object`)* - The default theme

##### Returns:

Returns a decorator `function to make Component themeable.

##### Example:

```js
import React from 'react'
import withThemes, { ThemeTypes } from 'react-css-themes'

import light from './light.css'
import dark from './dark.css'

const ThemableComponent = ({ theme }) => (
  <div className={theme.container}>
    <div className={theme.heading}>Heading</div>
  </div>
)

ThemableComponent.themeTypes = {
  container: ThemeTypes.className,
  heading: ThemeTypes.className
}

export default withThemes({ light, dark }, light)(ThemableComponent)
```

#### `ThemeTypes`

`ThemeTypes` are used to define theme's property types. It's simillar to React `PropTypes`, there are 2 avaiable types:

- `ThemeTypes.className`: Defines a property as a className
- `ThemeTypes.themeOf(ThemableComponent)`: Define a property as a theme of another themeable compoenent

##### Example:

```js
import React from 'react';
import { ThemeTypes } from 'react-css-themes'

function MyComponent ({ theme }) {
  // ... do things with the props
}

MyComponent.themeTypes = {
  themeProp: ThemeTypes.className,
  childComponent: ThemeTypes.themeOf(ThemableComponent),
}
```

### `Component.themes`

The compoenent will expose a `themes` object property with the themes defined as keys. These themes are set by the compoenent but also expose an API to create derivated themes.

#### `add(fragment)`

##### Arguments:

- `fragment` *(`Object`)* - ClassNames to add to the theme

##### Returns:

A new theme derived from the original theme plus the fragment 

##### Example:

```js

let ThemableComponent = ({ theme }) => (
  <div className={theme.container} />
)

ThemableComponent = withThemes({
  light: {
    container: '.container'
  }
}, light)(ThemableComponent)

/* HTML output */

renderToStaticMarkup(<ThemableComponent />)
// <div class=".container"></div>

// Derived theme
const theme = ThemableComponent.themes.light.add({
  container: '.foobar'
})

renderToStaticMarkup(<ThemableComponent theme={theme} />)
// <div class=".container .foobar"></div>
```

## Examples

### Basic theming

```js
/* ThemableComponent.js */
import React from 'react'
import withThemes, { ThemeTypes } from 'react-css-themes'

import light from './light.css'
import dark from './dark.css'

const ThemableComponent = ({ theme }) => (
  <div className={theme.container}>
    <div className={theme.heading}>Heading</div>
  </div>
)

ThemableComponent.themeTypes = {
  container: ThemeTypes.className,
  heading: ThemeTypes.className
}

export default withThemes({ light, dark }, light)(ThemableComponent)
```

```css
/* light.css */
.container {
  background-color: white;
}
.heading {
  color: black;
}
```

```css
/* dark.css */
.container {
  background-color: black;
}
.heading {
  color: white;
}
```

```js
/* View.js */
import React from 'react'
import ThemableComponent from './ThemableComponent'

const View = () => (
  <div>
    <ThemableComponent theme={ThemableComponent.themes.light} />
    <ThemableComponent theme={ThemableComponent.themes.dark} />
    <ThemableComponent /> /* Default theme (light) will be used */
  </div>
)

export default View
```

### Composing themable components

```js
/* AnotherThemableComponent.js */
import React from 'react'
import withThemes, { ThemeTypes } from 'react-css-themes'

import themeA from './themeA.css'
import themeB from './themeB.css'

const THEMES = {
  themeA: {
    ...themeA,
    child1: ThemableComponent.themes.light,
    child2: ThemableComponent.themes.dark
  }, 
  themeB: {
    ...themeB,
    child1: ThemableComponent.themes.dark,
    child2: ThemableComponent.themes.light
  }
}

const AnotherThemableComponent = ({ theme }) => (
  <div className={theme.container}>
    <ThemableComponent theme={theme.child1} />
    <ThemableComponent theme={theme.child2} />
  </div>
)

AnotherThemableComponent.themeTypes = {
  container: ThemeTypes.className,
  child1: ThemeTypes.themeOf(ThemableComponent),
  child2: ThemeTypes.themeOf(ThemableComponent)
}

export default withThemes(THEMES, THEMES.themeA)(AnotherThemableComponent)
```

### Adding `classNames` to a deeply nested themeable child

```js
/* AnotherThemableComponent.js */
import React from 'react'
import withThemes, { ThemeTypes } from 'react-css-themes'

import themeA from './themeA.css'

const THEMES = {
  themeA: {
    ...themeA,
    child: ThemableComponent.themes.light.add({
      container: themeA.childContainer,
      heading: themeA.childHeading
    })
  }
}

const AnotherThemableComponent = ({ theme }) => (
  <div className={theme.container}>
    <ThemableComponent theme={theme.child} />
  </div>
)
```

## About

The project is authored by Diogo Cunha ([@diffcunha](https://github.com/diffcunha)) and Daniel Hayes ([@daniel-hayes](https://github.com/daniel-hayes)).

Comments, improvements or feedback are highly appreciated.

## License

This project is licensed under the terms of the ISC license.
