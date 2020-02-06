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
    expect(container.querySelectorAll('b')).toHaveLength(1);
  });

  it('renders multiple bold text', () => {
    const { container } = render(
      <InlineMarkdown markdown="*Hey!* Just *kidding*." />
    );
    expect(container.querySelectorAll('b')).toHaveLength(2);
  });

  it('renders bold text in link', () => {
    const { container } = render(
      <InlineMarkdown markdown="My name is [*Malcolm* Kee](https://malcolmkee.com)" />
    );
    expect(container.querySelector('a')).toMatchInlineSnapshot(`
      <a
        href="https://malcolmkee.com"
        rel="noopener noreferrer"
        target="_BLANK"
      >
        
        <b>
          Malcolm
        </b>
         Kee
      </a>
    `);
  });

  it('renders italic text', () => {
    const { container } = render(
      <InlineMarkdown markdown="_Hey!_ Just kidding." />
    );
    expect(container.querySelectorAll('i')).toHaveLength(1);
  });

  it('renders multiple italic texts', () => {
    const { container } = render(
      <InlineMarkdown markdown="_Hey!_ Just _kidding_." />
    );
    expect(container.querySelectorAll('i')).toHaveLength(2);
  });

  it('renders bold and italic text in link', () => {
    const { container } = render(
      <InlineMarkdown markdown="My name is [*Malcolm* _Kee_](https://malcolmkee.com)" />
    );
    expect(container.querySelector('a')).toMatchInlineSnapshot(`
      <a
        href="https://malcolmkee.com"
        rel="noopener noreferrer"
        target="_BLANK"
      >
        
        <b>
          Malcolm
        </b>
         
        <i>
          Kee
        </i>
        
      </a>
    `);
  });
});
