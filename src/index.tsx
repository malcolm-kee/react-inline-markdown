import * as React from 'react';

export type Renderer = (props: { children: React.ReactNode }) => JSX.Element;

export type LinkRenderer = (props: {
  children: React.ReactNode;
  href: string;
}) => JSX.Element;

export type MarkdownRenderers = {
  b?: Renderer;
  p?: Renderer;
  i?: Renderer;
  a?: LinkRenderer;
};

export type MarkdownRightProps = {
  markdown: string;
  renderers?: MarkdownRenderers;
};

const defaultRenderers: Required<MarkdownRenderers> = {
  b: props => React.createElement('b', props),
  p: props => React.createElement('p', props),
  i: props => React.createElement('i', props),
  a: props => <a {...props} target="_BLANK" rel="noopener noreferrer" />,
};

export const MarkdownRight = ({
  markdown,
  renderers = {},
}: MarkdownRightProps) => {
  const mergedRenderer = Object.assign({}, defaultRenderers, renderers);

  return React.createElement(mergedRenderer.p, null, markdown);
};
