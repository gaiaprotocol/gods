import { h } from '@webtaku/h';
import { bundle } from './bundle';
import { head } from './head';
import { top } from './top';
import { footer } from './footer';

function intro() {
  return '<!DOCTYPE html>' + h(
    'html.dark', { lang: 'en' },
    head('The Gods - Gaia Protocol'),
    h(
      'body.bg-gray-950.text-gray-300.sl-theme-dark',
      top,

      // Hero
      h('section.relative.flex.flex-col.items-center.justify-center.text-center.h-[70vh].space-y-6.px-4',
        h('h1.text-6xl.text-yellow-400.tracking-widest.font-trojan-pro', 'The Gods'),
        h('p.text-lg.max-w-xl.text-gray-400',
          'A membership NFT collection of Gaia Protocol consisting of 3,333 NFTs. Highly customizable avatars and powerful benefits await.'
        ),
        h('sl-button', {
          variant: 'primary',
          size: 'large',
          href: 'https://opensea.io/collection/gaia-protocol-gods',
          target: '_blank',
        }, 'View on OpenSea')
      ),

      // Benefits Section (탭 → 카드 그리드)
      h('main.relative.py-16',
        h('div.container.mx-auto.px-4.space-y-12',

          h('h2.text-4xl.font-bold.text-center.text-white.mb-8', 'Holder Benefits'),

          // 그리드 래아웃: 1열 → (sm) 2열 → (lg) 3열
          (() => {
            const benefits = [
              {
                label: 'Avatars',
                title: 'Customizable Avatars',
                desc: 'Express your identity with highly customizable NFT avatars.',
                image: '/images/covers/thegods.jpg',
              },
              {
                label: 'Gaia Name',
                title: 'Gaia Name',
                desc: 'Claim your unique Gaia Name used across the Gaia ecosystem.',
                image: '/images/covers/gaia-names.png',
              },
              {
                label: 'Personas',
                title: 'Boosted Earnings in Gaia Personas',
                desc: 'Enjoy 200% trading revenue from Gaia Personas. (Coming soon)',
                image: '/images/covers/gaia-personas.jpg',
              },
              {
                label: 'Points',
                title: 'Holding Points',
                desc: 'Earn 10,000 holding points per NFT to increase your trading rewards.',
                image: '/images/covers/holding-points.jpg',
              },
              {
                label: 'topic.trade',
                title: 'Enhanced topic.trade Returns',
                desc: 'Up to 200% boosted trading revenue based on holding points. (Coming soon)',
                image: '/images/covers/topictrade.jpg',
              },
              {
                label: 'Clans',
                title: 'Clan Operational Funding',
                desc: '200% boosted clan funds based on member holding points. (Coming soon)',
                image: '/images/covers/gaia-clans.jpg',
              },
            ];

            return h(
              'div.grid.grid-cols-1.sm:grid-cols-2.lg:grid-cols-3.gap-6',
              ...benefits.map((b) =>
                h('sl-card', {
                  class: 'overflow-hidden hover:shadow-xl transition-shadow duration-200',
                  style: { backgroundColor: '#1f2937' }
                },
                  h('img', {
                    slot: 'image',
                    src: b.image,
                    alt: b.title,
                    class: 'w-full object-cover h-48'
                  }),
                  h('div.flex.items-center.justify-between.mb-1',
                    h('strong.text-base.uppercase.tracking-wide.text-yellow-300', b.label),
                    h('span.text-xs.text-gray-400', 'Benefit')
                  ),
                  h('h3.text-lg.text-white.mt-1', b.title),
                  h('p.text-sm.text-gray-300.mt-2', b.desc)
                )
              )
            );
          })()
        )
      ),

      footer,
      bundle,
    )
  );
}

export { intro };
