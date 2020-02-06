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
  ast: InlineMarkAST;
  renderers: MarkdownRenderers;
}) => {
  if (typeof ast === 'string') {
    return <>{ast}</>;
  }

  switch (ast.type) {
    case 'strong':
    case 'em':
      return renderers[ast.type]({
        children: ast.children,
      });

    case 'a':
      return renderers.a({
        href: ast.data.url,
        children: ast.children,
      });

    default:
      return null;
  }
};

export type InlineMarkAST =
  | {
      type: 'strong' | 'em';
      children: string;
    }
  | {
      type: 'a';
      data: {
        url: string;
      };
      children: string;
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
          children: linkChildrenRegex.exec(part)![1],
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
          type: 'strong',
          children: part.slice(1, -1),
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
          type: 'em',
          children: part.slice(1, -1),
        });
      }
    }
    return;
  }

  result.push(markdown);
};
