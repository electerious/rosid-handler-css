# rosid-handler-css

[![Test](https://github.com/electerious/rosid-handler-css/actions/workflows/test.yml/badge.svg)](https://github.com/electerious/rosid-handler-css/actions/workflows/test.yml)

A function that loads a CSS file, transforms nested CSS, adds vendor prefixes, and minifies the output.

## Install

```
npm install rosid-handler-css
```

## Usage

### API

```js
const handler = require('rosid-handler-css')

handler('main.css').then((data) => {})
handler('main.css', { optimize: true }).then((data) => {})
```

### Rosid

Add the following object to your `rosidfile.json`, `rosidfile.js` or [routes array](https://github.com/electerious/Rosid/blob/master/docs/Routes.md). `rosid-handler-css` will transform matching CSS files in your source folder.

```json
{
  "name": "CSS",
  "path": "[^_]*.css",
  "handler": "rosid-handler-css"
}
```

```css
/* main.css */
.class {
  display: flex;
  color: white;
}
```

The handler transforms nested CSS, adds vendor prefixes, and minifies CSS. Set `optimize` to `true` to disable source maps.

## Parameters

- `filePath` `{string}` Absolute path to file.
- `options` `{?object}` Options.
  - `optimize` `{?boolean}` - Disable source maps. Defaults to `false`.

## Returns

- `{Promise<string>}` The transformed file content.
