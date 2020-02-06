import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { InlineMarkdown } from '../.';

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
