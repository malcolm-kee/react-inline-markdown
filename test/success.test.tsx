import * as React from 'react';
import { render } from '@testing-library/react';
import { InlineMarkdown } from '../src';

describe(`InlineMarkdown success scenario`, () => {
  it('renders without crashing', () => {
    const { getByText } = render(<InlineMarkdown markdown="Hello there" />);
    expect(getByText('Hello there')).not.toBeNull();
  });

  it('renders link', () => {
    const { container, getByText } = render(
      <InlineMarkdown markdown="Hello [google](https://google.com)" />
    );
    expect(container.querySelectorAll('a')).toHaveLength(1);
    expect(getByText('google').getAttribute('href')).toBe('https://google.com');
  });

  it('renders multiple links', () => {
    const { container, getByText } = render(
      <InlineMarkdown markdown="Hello [google](https://google.com)! This is my [website](https://malcolmkee.com)." />
    );
    expect(container.querySelectorAll('a')).toHaveLength(2);
    expect(getByText('google').getAttribute('href')).toBe('https://google.com');
    expect(getByText('website').getAttribute('href')).toBe(
      'https://malcolmkee.com'
    );
  });

  it('renders bold text', () => {
    const { container } = render(
      <InlineMarkdown markdown="*Hey!* Just kidding." />
    );
    expect(container.querySelectorAll('strong')).toHaveLength(1);
  });

  it('renders multiple bold text', () => {
    const { container } = render(
      <InlineMarkdown markdown="*Hey!* Just *kidding*." />
    );
    expect(container.querySelectorAll('strong')).toHaveLength(2);
  });

  it('renders italic text', () => {
    const { container } = render(
      <InlineMarkdown markdown="_Hey!_ Just kidding." />
    );
    expect(container.querySelectorAll('em')).toHaveLength(1);
  });

  it('renders multiple italic texts', () => {
    const { container } = render(
      <InlineMarkdown markdown="_Hey!_ Just _kidding_." />
    );
    expect(container.querySelectorAll('em')).toHaveLength(2);
  });
});
