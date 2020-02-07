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

    case '<>':
      return (
        <>
          {ast.children.map((child, i) => (
            <Element ast={child} renderers={renderers} key={i} />
          ))}
        </>
      );

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
  | {
      type: '<>';
      children: Array<InlineMarkAST | string>;
    };

const anyMatch = /(\[.+?\]\(.+?\))|(\*.+?\*)|(_.+?_)/;
const linkRegex = /(\[.+?\]\(.+?\))/;
const linkChildrenRegex = /\[(.+)\]/;
const linkUrlRegex = /\((.+)\)/;
const boldRegex = /(\*.+?\*)/;
const italicRegex = /(_.+?_)/;

export const parseMarkdown = (markdown: string): InlineMarkAST[] => {
  const result: InlineMarkAST[] = [];

  parseMarkdownRecurseRegex(markdown, result);

  return result;
};

const TokenMap = {
  '[': { regex: '\\[.+?\\]\\(.+?\\)', type: 'a', end: ')' },
  '*': { regex: '\\*.+?\\*', type: 'strong', end: '*' },
  _: { regex: '_.+?_', type: 'em', end: '_' },
} as const;

const anyTokenRegex = new RegExp(
  TokenMap['*'].regex + '|' + TokenMap['_'].regex + '|' + TokenMap['['].regex
);

const parseMarkdownRecurse = (markdown: string): InlineMarkAST => {
  let children: InlineMarkAST[] = [];
  let toBeProcessed = markdown;

  if (!markdown || !anyTokenRegex.test(markdown)) {
    return {
      type: '<>',
      children: [markdown],
    };
  }

  while (toBeProcessed && anyTokenRegex.test(toBeProcessed)) {
    const match = anyTokenRegex.exec(toBeProcessed);
    const matchIndex = match!.index;
    const before = toBeProcessed.slice(0, matchIndex);
    children.push({
      type: '<>',
      children: [before],
    });
    const matchedToken =
      TokenMap[toBeProcessed[matchIndex] as keyof typeof TokenMap];
    const endIndex = toBeProcessed.indexOf(matchedToken.end, matchIndex + 1);
    const childrenText = toBeProcessed;

    toBeProcessed = toBeProcessed.slice(endIndex + 1);
  }

  if (toBeProcessed) {
    children.push({
      type: '<>',
      children: [toBeProcessed],
    });
  }

  return {
    type: '<>',
    children,
  };
};

const parseMarkdownRecurseRegex = (
  markdown: string,
  result: InlineMarkAST[]
): void => {
  if (!markdown || !anyMatch.test(markdown)) {
    result.push({
      type: '<>',
      children: [markdown],
    });
    return;
  }

  const splitByLink = markdown.split(linkRegex);
  if (splitByLink.length > 1) {
    for (let i = 0; i < splitByLink.length; i++) {
      const part = splitByLink[i];
      if (i % 2 === 0) {
        parseMarkdownRecurseRegex(part, result);
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
        parseMarkdownRecurseRegex(part, result);
      } else {
        result.push({
          type: 'strong',
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
        parseMarkdownRecurseRegex(part, result);
      } else {
        result.push({
          type: 'em',
          children: parseMarkdown(part.slice(1, -1)),
        });
      }
    }
    return;
  }

  result.push({ type: '<>', children: [markdown] });
};
