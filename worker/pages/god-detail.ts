import { h } from '@webtaku/h';
import { bundle } from './bundle';
import { head } from './head';
import { top } from './top';
import { footer } from './footer';

function godDetail() {
  return '<!DOCTYPE html>' + h(
    'html.dark', { lang: 'en' },
    head('God Detail - Gaia Protocol'),
    h(
      'body.bg-gray-950.text-gray-300.sl-theme-dark',
      top,

      h(
        'main.relative py-10 sm:py-14',
        h(
          'div.max-w-7xl.mx-auto.px-4.sm:px-6.lg:px-8.space-y-6',
          h(
            'section#god-detail-root.space-y-6',

            // Toolbar skeleton
            h(
              'div.flex.items-center.justify-between.gap-3',
              h(
                'div.flex.items-center.gap-3.min-w-0',
                h('div.h-6.w-40.rounded-md.bg-white/10.animate-pulse') // title skeleton
              ),
              h(
                'div.flex.items-center.gap-2',
                h('div.h-8.w-24.rounded-md.bg-white/10.animate-pulse'), // back
                h('div.h-8.w-28.rounded-md.bg-white/10.animate-pulse')  // explorer
              )
            ),

            // Content skeleton
            h(
              'div.grid.grid-cols-1.lg:grid-cols-5.gap-6',
              // left: image
              h('div.lg:col-span-3',
                h('div.aspect-square.rounded-xl.border.border-white/10.bg-white/5.animate-pulse')
              ),
              // right: meta
              h('div.lg:col-span-2.space-y-4',
                h('div.h-6.w-56.rounded-md.bg-white/10.animate-pulse'),
                h('div.h-4.w-72.rounded-md.bg-white/10.animate-pulse'),
                h('div.h-4.w-64.rounded-md.bg-white/10.animate-pulse'),
                h('div.h-4.w-40.rounded-md.bg-white/10.animate-pulse'),

                h('div.h-10.w-full.rounded-lg.bg-white/10.animate-pulse'),
                h('div.h-10.w-full.rounded-lg.bg-white/10.animate-pulse')
              )
            )
          )
        )
      ),

      footer,
      // Make sure your bundler includes the client script below in this bundle
      bundle
    )
  );
}

export { godDetail };
