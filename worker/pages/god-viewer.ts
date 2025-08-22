import { h } from '@webtaku/h';
import { head } from './head';

function godViewer() {
  return '<!DOCTYPE html>' + h(
    'html.dark', { lang: 'en' },
    head('God Viewer - Gaia Protocol', '/viewer.css'),
    h(
      'body#god-viewer.sl-theme-dark',
      h('script', { src: '/viewer.js' }),
    )
  );
}

export { godViewer };
