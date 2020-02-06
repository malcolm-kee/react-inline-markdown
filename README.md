# react-inline-markdown

[![version](https://img.shields.io/npm/v/react-inline-markdown.svg)](https://www.npmjs.com/package/react-inline-markdown) ![license](https://img.shields.io/npm/l/react-inline-markdown.svg)

Parsing inline markdown syntax for simple rich text support.

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
        markdown={`Hi! I _am_ [*Malcolm* Kee](https://malcolmkee.com)`}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
```

## Features

At the moment only 3 markdown syntaxes are supported:

- italic: `_italic`
- bold: `*bold*`
- link: `[link-text](link-url)`
