import * as React from 'react';
import { render } from '@testing-library/react';
import { MarkdownRight } from '../src';

describe(`MarkdownRight success scenario`, () => {
  it('renders without crashing', () => {
    const { getByText } = render(<MarkdownRight markdown="Hello there" />);
    expect(getByText('Hello there')).not.toBeNull();
  });
});
