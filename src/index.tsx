import * as React from 'react';

export type Renderer = (props: { children: React.ReactNode }) => JSX.Element;

export type LinkRenderer = (props: {
  children: React.ReactNode;
  href: string;
}) => JSX.Element;

export type MarkdownRenderers = {
  strong: Renderer;
  em: Renderer;
  a: LinkRenderer;
};

export type InlineMarkdownProps = {
  markdown: string;
  renderers?: Partial<MarkdownRenderers>;
};

const defaultRenderers: MarkdownRenderers = {
  strong: props => React.createElement('strong', props),
  em: props => React.createElement('em', props),
  a: props => <a {...props} target="_BLANK" rel="noopener noreferrer" />,
};

export const InlineMarkdown = ({
  markdown,
  renderers = {},
}: InlineMarkdownProps) => {
  if (!markdown) {
    return null;
  }

  const mergedRenderer = {
    ...defaultRenderers,
    ...renderers,
  };

  return (
    <>
      {parseMarkdown(markdown).map((ast, i) => (
        <Element ast={ast} renderers={mergedRenderer} key={i} />
      ))}
    </>
  );
};

const Element = ({
  ast,
  renderers,
}: {
  ast: InlineMarkAST | string;
  renderers: MarkdownRenderers;
}) => {
  if (typeof ast === 'string') {
    return <>{ast}</>;
  }

  switch (ast.type) {
    case 'strong':
    case 'em':
      return renderers[ast.type]({
        children: ast.children.map((child, i) => (
          <Element ast={child} renderers={renderers} key={i} />
        )),
      });

    case 'a':
      return renderers.a({
        href: ast.data.url,
        children: ast.children.map((child, i) => (
          <Element ast={child} renderers={renderers} key={i} />
        )),
      });

    default:
      return null;
  }
};

export type InlineMarkAST =
  | {
      type: 'strong' | 'em';
      children: InlineMarkAST[];
    }
  | {
      type: 'a';
      data: {
        url: string;
      };
      children: InlineMarkAST[];
    }
  | string;

const TokenMap = {
  '[': { regex: '\\[.+?\\]\\(.+?\\)', type: 'a', endRegex: /\]\(.+?\)/ },
  '*': { regex: '\\*.+?\\*', type: 'strong', endRegex: /\*/ },
  _: { regex: '_.+?_', type: 'em', endRegex: /_/ },
} as const;

const extractUrlRegex = /\]\((.+?)\)/;
const anyTokenRegex = new RegExp(
  TokenMap['*'].regex + '|' + TokenMap['_'].regex + '|' + TokenMap['['].regex
);

export const parseMarkdown = (markdown: string): Array<InlineMarkAST> => {
  const result: Array<InlineMarkAST> = [];
  let toBeProcessed = markdown;

  if (!markdown || !anyTokenRegex.test(markdown)) {
    return [markdown];
  }

  while (toBeProcessed && anyTokenRegex.test(toBeProcessed)) {
    const match = anyTokenRegex.exec(toBeProcessed);
    const matchIndex = match!.index;

    const pre = toBeProcessed.slice(0, matchIndex);
    result.push(pre);

    const matchedToken =
      TokenMap[toBeProcessed[matchIndex] as keyof typeof TokenMap];
    const matchAndAfter = toBeProcessed.slice(matchIndex + 1);
    const endMatch = matchedToken.endRegex.exec(matchAndAfter);
    const endIndex = endMatch!.index;

    const childrenText = matchAndAfter.slice(0, endIndex);
    if (matchedToken.type === 'a') {
      result.push({
        type: 'a',
        children: parseMarkdown(childrenText),
        data: {
          url: extractUrlRegex.exec(matchAndAfter)![1],
        },
      });
    } else {
      result.push({
        type: matchedToken.type,
        children: parseMarkdown(childrenText),
      });
    }

    toBeProcessed = matchAndAfter.slice(endIndex + endMatch![0].length);
  }

  if (toBeProcessed) {
    result.push(toBeProcessed);
  }

  return result;
};
