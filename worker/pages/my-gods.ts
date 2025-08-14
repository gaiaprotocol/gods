import { h } from '@webtaku/h';
import { bundle } from './bundle';
import { head } from './head';
import { top } from './top';
import { footer } from './footer';

function myGods() {
  return '<!DOCTYPE html>' + h(
    'html.dark', { lang: 'en' },
    head('My Gods - Gaia Protocol'),
    h(
      'body.bg-gray-950.text-gray-300.sl-theme-dark',
      // top header (unchanged)
      top,

      // MAIN
      h(
        'main.relative py-10 sm:py-14',
        h(
          'div.max-w-7xl.mx-auto.px-4.sm:px-6.lg:px-8.space-y-6',
          h(
            'section#my-gods-root.space-y-4',

            h(
              'div.flex.items-center.justify-between.gap-3',
              h(
                'div.flex.items-center.gap-3.min-w-0',
                h('h1', {
                  style: {
                    fontSize: '20px',
                    fontWeight: '700',
                    margin: '0'
                  }
                }, 'My Gods'),
              ),
            ),

            h(
              'div.grid.grid-cols-1.sm:grid-cols-2.lg:grid-cols-4.gap-4',
              ...Array.from({ length: 4 }).map(() =>
                h(
                  'div.rounded-xl.border.border-white/10.bg-white/5.h-[220px].animate-pulse'
                )
              )
            )
          )
        )
      ),

      footer,
      bundle
    )
  );
}

export { myGods };
