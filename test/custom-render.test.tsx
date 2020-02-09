import * as React from 'react';
import { render } from '@testing-library/react';
import { InlineMarkdown } from '../src';

describe(`Inline Markdown custom renderer`, () => {
  it('support override render', () => {
    const { getByText } = render(
      <InlineMarkdown
        markdown="Hello [here](http://google.com) I am."
        renderers={{
          a: props => (
            <span>
              {props.children} link: {props.href}
            </span>
          ),
        }}
      />
    );

    expect(getByText('here link: http://google.com')).not.toBeNull();
  });
});
