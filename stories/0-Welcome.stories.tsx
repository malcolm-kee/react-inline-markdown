import React from 'react';
import { InlineMarkdown } from '@';

export default {
  title: 'React Inline Markdown',
};

export const toStorybook = () => (
  <InlineMarkdown
    markdown={`*Hello*! I am a [story](https://storybook.js.org/).`}
  />
);

toStorybook.story = {
  name: 'Simple Example',
};
