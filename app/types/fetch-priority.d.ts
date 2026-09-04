// React 18.3 has no mapping for the `fetchPriority` prop. It warns on the
// camelCase spelling and tells you to use the lowercase attribute, which it
// then passes through untouched. @types/react only declares the camelCase
// form, so the spelling React asks for does not typecheck without this.
//
// Delete this file when the app moves to React 19, which maps `fetchPriority`.

import 'react';

declare module 'react' {
  interface ImgHTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    fetchpriority?: 'high' | 'low' | 'auto';
  }
}
