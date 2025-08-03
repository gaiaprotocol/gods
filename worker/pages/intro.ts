import { h } from '@webtaku/h';
import { bundle } from './bundle';
import { head } from './head';
import { top } from './top';

function intro() {
  return '<!DOCTYPE html>' + h(
    'html.dark', { lang: 'en' },
    head('The Gods - Gaia Protocol'),
    h(
      'body.bg-gray-950.text-gray-300.sl-theme-dark',
      top,

      // Hero
      h('section.relative.flex.flex-col.items-center.justify-center.text-center.h-[70vh].space-y-6.px-4',
        h('h1.text-6xl.font-serif.font-bold.text-yellow-400.tracking-widest', 'THE GODS'),
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

      // Benefits Section with Tabs
      h('main.relative.py-16',
        h('div.container.mx-auto.px-4.space-y-12',

          h('h2.text-4xl.font-bold.text-center.text-white.mb-4', 'Holder Benefits'),

          h('sl-tab-group.tab-benefits', { class: 'max-w-4xl.mx-auto' },
            ...[
              {
                label: 'Avatars',
                title: 'Customizable Avatars',
                desc: 'Express your identity with highly customizable NFT avatars.',
                image: 'https://common-resources.gaia.cc/covers/thegods.jpg',
              },
              {
                label: 'Gaia Name',
                title: 'Gaia Name',
                desc: 'Claim your unique Gaia Name used across the Gaia ecosystem.',
                image: 'https://common-resources.gaia.cc/covers/gaia-names.png',
              },
              {
                label: 'Personas',
                title: 'Boosted Earnings in Gaia Personas',
                desc: 'Enjoy 200% trading revenue from Gaia Personas. (Coming soon)',
                image: 'https://common-resources.gaia.cc/covers/gaia-personas.jpg',
              },
              {
                label: 'Points',
                title: 'Holding Points',
                desc: 'Earn 10,000 holding points per NFT to increase your trading rewards.',
                image: 'https://common-resources.gaia.cc/covers/holding-points.jpg',
              },
              {
                label: 'topic.trade',
                title: 'Enhanced topic.trade Returns',
                desc: 'Up to 200% boosted trading revenue based on holding points. (Coming soon)',
                image: 'https://common-resources.gaia.cc/covers/topictrade.jpg',
              },
              {
                label: 'Clans',
                title: 'Clan Operational Funding',
                desc: '200% boosted clan funds based on member holding points. (Coming soon)',
                image: 'https://common-resources.gaia.cc/covers/gaia-clans.jpg',
              },
            ].map((benefit, i) => [
              h('sl-tab', { slot: 'nav', panel: `panel-${i}` }, benefit.label),
              h('sl-tab-panel', { name: `panel-${i}` },
                h('sl-card', {
                  class: 'overflow-hidden',
                  style: { backgroundColor: '#1f2937' }
                },
                  h('img', {
                    slot: 'image',
                    src: benefit.image,
                    alt: benefit.title,
                    class: 'w-full object-cover h-64',
                  }),
                  h('strong.text-lg.text-yellow-300', benefit.title),
                  h('p.text-sm.text-gray-300.mt-2', benefit.desc)
                )
              )
            ]).flat()
          )
        )
      ),

      // Footer
      h('footer.bg-gray-950.border-t.border-gray-800.mt-16',
        h('div.container.mx-auto.px-4.py-6.text-center.text-gray-500.text-sm.space-y-2',
          h('p', `© ${new Date().getFullYear()} Gaia Protocol. All rights reserved.`),
          h('a.text-gray-400.hover:text-white.underline', {
            href: 'https://x.com/TheGods_NFT',
            target: '_blank'
          }, 'Follow on X')
        )
      ),

      bundle,
    )
  );
}

export { intro };
