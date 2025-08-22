import { h } from '@webtaku/h';
import { bundle } from './bundle';
import { head } from './head';

function godViewer() {
  return '<!DOCTYPE html>' + h(
    'html.dark', { lang: 'en' },
    head('God Viewer - Gaia Protocol'),
    h(
      'body#god-viewer.sl-theme-dark',
      // Make sure your bundler includes the client script below in this bundle
      bundle
    )
  );
}

export { godViewer };
