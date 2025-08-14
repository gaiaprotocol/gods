import { h } from '@webtaku/h';
import { bundle } from './bundle';
import { head } from './head';
import { top } from './top';

function myGods() {
  return '<!DOCTYPE html>' + h(
    'html.dark', { lang: 'en' },
    head('The Gods - Gaia Protocol'),
    h(
      'body.bg-gray-950.text-gray-300.sl-theme-dark',
      top,

      'my-gods',

      bundle,
    )
  );
}

export { myGods };
