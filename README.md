# react-inline-markdown

[![version](https://img.shields.io/npm/v/react-inline-markdown.svg)](https://www.npmjs.com/package/react-inline-markdown) ![license](https://img.shields.io/npm/l/react-inline-markdown.svg)

Lightweight inline markdown syntax parser for simple rich text support.

## Installation

```bash
npm i react-inline-markdown
```

## Usage

[Try it in browser](https://codesandbox.io/s/react-inline-markdown-xyxxj)

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { InlineMarkdown } from 'react-inline-markdown';

const App = () => {
  return (
    <div>
      <InlineMarkdown
        markdown={`Hi! I _am_ *Malcolm* Kee.
        
        Checkout [my website](https://malcolmkee.com)`}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
```

## Features

At the moment only 4 markdown syntaxes are supported:

- paragraph: (two line breaks)
- link: `[link-text](link-url)`
- italic: `_italic_`
- bold: `*bold*`

Besides, you can combine them together, i.e. `_*test*_` will work.

## API

### `<InlineMarkdown />`

Accepted Props:

- _Required_: `markdown` (string)

  The markdown string to be parsed, e.g. `I *am* _react-inline-markdown_`.

- Optional: `renderers`: an object of four properties (`strong`, `em`, `a`, `p`)

  Functions that returns React Elements. Used to customize how markdown will be rendered.

### `parseMarkdown`: (markdown: string) => InlineMarkAST[]

Internal function to generate the AST for the markdown.
