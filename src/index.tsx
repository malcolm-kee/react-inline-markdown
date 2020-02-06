import * as React from 'react';

export type Renderer = (props: { children: React.ReactNode }) => JSX.Element;

export type LinkRenderer = (props: {
  children: React.ReactNode;
  href: string;
}) => JSX.Element;

export type MarkdownRenderers = {
  b: Renderer;
  p: Renderer;
  i: Renderer;
  a: LinkRenderer;
};

export type InlineMarkdownProps = {
  markdown: string;
  renderers?: Partial<MarkdownRenderers>;
};

const defaultRenderers: MarkdownRenderers = {
  b: props => React.createElement('b', props),
  p: props => React.createElement('p', props),
  i: props => React.createElement('i', props),
  a: props => <a {...props} target="_BLANK" rel="noopener noreferrer" />,
};

export const InlineMarkdown = ({
  markdown,
  renderers = {},
}: InlineMarkdownProps) => {
  if (!markdown) {
    return null;
  }

  const mergedRenderer = Object.assign({}, defaultRenderers, renderers);

  const asts = parseMarkdown(markdown);

  return (
    <>
      {asts.map((ast, i) => (
        <Element ast={ast} renderers={mergedRenderer} key={i} />
      ))}
    </>
  );
};

const Element = ({
  ast,
  renderers,
}: {
  ast: InlineMarkAST;
  renderers: MarkdownRenderers;
}) => {
  if (typeof ast === 'string') {
    return <>{ast}</>;
  }

  switch (ast.type) {
    case 'b':
    case 'i':
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
      type: 'b' | 'i';
      children: Array<InlineMarkAST>;
    }
  | {
      type: 'a';
      data: {
        url: string;
      };
      children: Array<InlineMarkAST>;
    }
  | string;

const anyMatch = /(\[.+?\]\(.+?\))|(\*.+?\*)|(_.+?_)/;
const linkRegex = /(\[.+?\]\(.+?\))/;
const linkChildrenRegex = /\[(.+)\]/;
const linkUrlRegex = /\((.+)\)/;
const boldRegex = /(\*.+?\*)/;
const italicRegex = /(_.+?_)/;

export const parseMarkdown = (markdown: string): InlineMarkAST[] => {
  const result: InlineMarkAST[] = [];

  parseMarkdownRecurse(markdown, result);

  return result;
};

const parseMarkdownRecurse = (
  markdown: string,
  result: InlineMarkAST[]
): void => {
  if (!markdown || !anyMatch.test(markdown)) {
    result.push(markdown);
    return;
  }

  const splitByLink = markdown.split(linkRegex);
  if (splitByLink.length > 1) {
    for (let i = 0; i < splitByLink.length; i++) {
      const part = splitByLink[i];
      if (i % 2 === 0) {
        parseMarkdownRecurse(part, result);
      } else {
        result.push({
          type: 'a',
          data: {
            url: linkUrlRegex.exec(part)![1],
          },
          children: parseMarkdown(linkChildrenRegex.exec(part)![1]),
        });
      }
    }
    return;
  }

  const splitByBold = markdown.split(boldRegex);
  if (splitByBold.length > 1) {
    for (let i = 0; i < splitByBold.length; i++) {
      const part = splitByBold[i];
      if (i % 2 === 0) {
        parseMarkdownRecurse(part, result);
      } else {
        result.push({
          type: 'b',
          children: parseMarkdown(part.slice(1, -1)),
        });
      }
    }
    return;
  }

  const splitByItalic = markdown.split(italicRegex);
  if (splitByItalic.length > 1) {
    for (let i = 0; i < splitByItalic.length; i++) {
      const part = splitByItalic[i];
      if (i % 2 === 0) {
        parseMarkdownRecurse(part, result);
      } else {
        result.push({
          type: 'i',
          children: parseMarkdown(part.slice(1, -1)),
        });
      }
    }
    return;
  }

  result.push(markdown);
};
