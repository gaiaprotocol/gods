import { createAddressAvatar, shortenAddress, tokenManager } from '@gaiaprotocol/client-common';
import { el } from '@webtaku/el';

import { fetchHeldNfts, HeldNft } from '../api/nfts';
import { showErrorAlert } from '../components/alert';
import { getMyAddress } from './shared';

// 이미지 경로 보정 (페이지 전용)
function toImageUrl(img?: string | null) {
  if (!img) return '';
  try { return new URL(img).href; }
  catch { return `https://god-images.gaia.cc/${img}`; }
}

// 비로그인 UI
function ensureAuthUI(container: HTMLElement) {
  container.innerHTML = '';
  const box = el('div', {
    style: `
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      gap:12px; padding:48px 16px; text-align:center; border:1px dashed rgba(255,255,255,0.12);
      border-radius:16px; background:rgba(255,255,255,0.02);
    `
  });
  const title = el('h2', 'Sign-in required', { style: 'font-size:18px; font-weight:600; margin:0;' });
  const desc = el('p', 'Connect your wallet and complete the signature to view your Gods.', { style: 'color:#9CA3AF; margin:0;' });
  const hint = el('p', 'Use the Connect button at the top-right, then complete the signature.', { style: 'color:#9CA3AF; margin:0;' });
  box.append(title, desc, hint);
  container.append(box);
}

// 헤더
function createHeader(address: `0x${string}` | null, count: number) {
  const header = el('div', {
    style: `
      display:flex; align-items:center; justify-content:space-between;
      margin-bottom:16px; gap:12px;
    `
  });

  const left = el('div', { style: 'display:flex; align-items:center; gap:12px;' });
  const title = el('h1', 'My Gods', { style: { fontSize: '20px', fontWeight: '700', margin: '0' } });
  left.append(title);

  if (address) {
    const addrWrap = el('div', { style: 'display:flex; align-items:center; gap:8px; opacity:.9;' });
    const avatar = createAddressAvatar(address);
    Object.assign(avatar.style, { width: '22px', height: '22px', borderRadius: '9999px' });
    addrWrap.append(avatar, el('span', shortenAddress(address)));
    left.append(addrWrap);
  }

  const right = el('div', { style: 'display:flex; align-items:center; gap:8px;' });
  const countBadge = el('sl-badge', String(count), { pill: true, variant: 'neutral' });
  const refreshBtn = el('sl-button', 'Refresh', { size: 'small' });
  right.append(countBadge, refreshBtn);

  header.append(left, right);
  return { header, refreshBtn };
}

// 그리드
function createGrid() {
  const grid = el('div', {
    style: `
      display:grid;
      grid-template-columns: repeat(1, minmax(0, 1fr));
      gap:12px;
    `
  }) as HTMLDivElement;

  const mq = window.matchMedia('(min-width:640px)');
  const mq2 = window.matchMedia('(min-width:1024px)');
  const applyCols = () => {
    if (mq2.matches) grid.style.gridTemplateColumns = 'repeat(4, minmax(0, 1fr))';
    else if (mq.matches) grid.style.gridTemplateColumns = 'repeat(2, minmax(0, 1fr))';
    else grid.style.gridTemplateColumns = 'repeat(1, minmax(0, 1fr))';
  };
  applyCols();
  mq.addEventListener?.('change', applyCols);
  mq2.addEventListener?.('change', applyCols);

  return grid;
}

function renderEmpty(grid: HTMLElement, message = "You don't own any Gods yet.") {
  grid.append(
    el('div', message, {
      style: `
        grid-column:1/-1; text-align:center; color:var(--sl-color-neutral-500);
        padding:24px; border:1px dashed rgba(255,255,255,0.12); border-radius:12px;
      `
    })
  );
}

function renderCard(n: HeldNft, onOpen: (n: HeldNft) => void) {
  const card = el('div', {
    style: `
      background:rgba(255,255,255,0.03);
      border:1px solid rgba(255,255,255,0.08);
      border-radius:14px; overflow:hidden; cursor:pointer;
      transition: transform .06s ease, box-shadow .2s ease, border-color .2s ease;
    `,
    onmouseenter: (e: any) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'),
    onmouseleave: (e: any) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'),
    onclick: () => onOpen(n)
  });

  const img = el('img', '', {
    src: toImageUrl(n.image),
    alt: `${n.type ?? 'NFT'} #${n.id}`,
    style: 'width:100%; height:180px; object-fit:cover; background:#111; display:block;'
  });

  const body = el('div', {
    style: 'padding:10px 12px; display:flex; align-items:center; justify-content:space-between; gap:10px;'
  });

  const name = el(
    'div',
    el('div', `${n.type ?? 'NFT'} #${n.id}`, { style: 'font-weight:600;' }),
    el('div', n.collection, { style: 'font-size:12px; color:#9CA3AF;' })
  );

  const more = el('sl-badge', 'View', { pill: true, variant: 'primary' });

  body.append(name, more);
  card.append(img, body);
  return card;
}

// 메인 로더
async function loadAndRender(root: HTMLElement) {
  const address = getMyAddress();

  root.innerHTML = '';
  const headerArea = el('div');
  const grid = createGrid();
  const section = el('section', headerArea, grid, { style: 'display:flex; flex-direction:column; gap:12px;' });
  root.append(section);

  // 접근 제어
  if (!tokenManager.has() || !address) {
    ensureAuthUI(root);
    return;
  }

  // 헤더
  const { header, refreshBtn } = createHeader(address, 0);
  headerArea.replaceWith(header);

  // 로딩
  grid.innerHTML = '';
  grid.append(
    el('div', 'Loading Gods…', {
      style: `grid-column:1/-1; text-align:center; color:#9CA3AF; padding:16px;`
    })
  );

  try {
    const items = await fetchHeldNfts(address, {});
    (header.querySelector('sl-badge') as HTMLElement).innerText = String(items.length);

    grid.innerHTML = '';
    if (!items.length) {
      renderEmpty(grid);
      return;
    }

    const onOpen = (n: HeldNft) => {
      const url = `/god/${encodeURIComponent(String(n.id))}`;
      window.location.assign(url);
    };

    for (const n of items) grid.append(renderCard(n, onOpen));

    // 새로고침
    refreshBtn.addEventListener('click', () => loadAndRender(root));
  } catch (err) {
    console.error(err);
    grid.innerHTML = '';
    grid.append(
      el('div', 'Failed to load your Gods. Please try again.', {
        style: `
          grid-column:1/-1; text-align:center; color:var(--sl-color-danger-600);
          padding:24px; border:1px dashed rgba(255,0,0,0.25); border-radius:12px;
        `
      })
    );
    showErrorAlert('Error', err instanceof Error ? err.message : String(err));
  }
}

// 마운트 (라우팅에 따라 해당 페이지에서만 실행)
(function mount() {
  const root = document.getElementById('my-gods-root');
  if (!root) return;

  loadAndRender(root);

  tokenManager.on('signedIn', () => loadAndRender(root));
  tokenManager.on('signedOut', () => loadAndRender(root));
})();
