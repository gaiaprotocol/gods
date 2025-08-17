import { createAddressAvatar, shortenAddress, tokenManager } from '@gaiaprotocol/client-common';
import { el } from '@webtaku/el';
import { fetchNftDetail } from '../api/nfts';
import { showErrorAlert } from '../components/alert';
import { getMyAddress } from './shared';

// ---- Types ------------------------------------------------------------------
type NftAttribute = { trait_type?: string; value?: string | number | null };
type NftDetail = {
  id: string | number;
  image?: string | null;
  name?: string | null;
  description?: string | null;
  attributes?: NftAttribute[];
  owner?: `0x${string}` | null;
  explorerUrl?: string | null;
  tokenUrl?: string | null;
  type?: string | null; // e.g., "God"
};

// ---- Helpers ----------------------------------------------------------------
function toImageUrl(img?: string | null) {
  if (!img) return '';
  try { return new URL(img).href; }
  catch { return `https://god-images.gaia.cc/${img}`; }
}

// /god/:id 형태
function parsePath(): { id: string } | null {
  const parts = window.location.pathname.split('/').filter(Boolean); // ['god', ':id']
  if (parts[0] !== 'god' || !parts[1]) return null;
  return { id: decodeURIComponent(parts[1]) };
}

// ---- Auth gate --------------------------------------------------------------
function renderAuthRequired(root: HTMLElement) {
  root.innerHTML = '';
  const box = el('div', {
    style: `
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      gap:12px; padding:48px 16px; text-align:center; border:1px dashed rgba(255,255,255,0.12);
      border-radius:16px; background:rgba(255,255,255,0.02);
    `
  });
  const title = el('h2', 'Sign-in required', { style: { fontSize: '18px', fontWeight: '600', margin: '0' } });
  const desc = el('p', 'Connect your wallet and complete the signature to view this God.', {
    style: { color: '#9CA3AF', margin: '0' }
  });
  const hint = el('p', 'Use the Connect button at the top-right, then complete the signature.', {
    style: { color: '#9CA3AF', margin: '0' }
  });
  box.append(title, desc, hint);
  root.append(box);
}

// ---- UI sections ------------------------------------------------------------
function headerBar(detail: NftDetail) {
  const wrap = el('div', {
    style: 'display:flex; align-items:center; justify-content:space-between; gap:12px;'
  });

  // Left: "My Gods" (동일 스타일) + 서브
  const left = el('div', { style: 'display:flex; align-items:flex-start; gap:10px; min-width:0;' });
  const title = el('h1', 'My Gods', { style: { fontSize: '20px', fontWeight: '700', margin: '0' } });
  const sub = el(
    'div',
    el('span', `${detail.type ?? 'God'} #${detail.id}`, { style: 'opacity:.9' }),
    { style: 'font-size:12px; color:#9CA3AF; margin-top:2px;' }
  );
  const col = el('div'); col.append(title, sub);
  left.append(col);

  // Right: actions
  const right = el('div', { style: 'display:flex; gap:8px; align-items:center;' });
  const backBtn = el('sl-button', 'Back', {
    variant: 'default',
    onclick: () => {
      if (document.referrer && document.referrer.includes('/my-gods')) history.back();
      else window.location.assign('/my-gods');
    }
  });
  const explorerBtn = el('sl-button', 'View on Explorer', {
    variant: 'primary',
    onclick: () => {
      const url = `https://etherscan.io/nft/0x134590acb661da2b318bcde6b39ef5cf8208e372/${detail.id}`;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
    },
  });
  right.append(backBtn, explorerBtn);

  wrap.append(left, right);
  return wrap;
}

function imagePanel(detail: NftDetail) {
  const card = el('div', {
    style: `
      border:1px solid rgba(255,255,255,0.1);
      background:rgba(255,255,255,0.04);
      border-radius:16px; padding:10px;
    `
  });
  const img = el('img', '', {
    src: toImageUrl(detail.image),
    alt: detail.name ?? `${detail.type ?? 'God'} #${detail.id}`,
    style: 'width:100%; border-radius:12px; background:#111; aspect-ratio:1/1; object-fit:cover;'
  });
  card.append(img);
  return card;
}

function metaPanel(detail: NftDetail) {
  const wrap = el('div', { style: 'display:flex; flex-direction:column; gap:12px;' });

  const name = el('h2', detail.name ?? `${detail.type ?? 'God'} #${detail.id}`, {
    style: { fontSize: '18px', fontWeight: '600', margin: '0' }
  });

  const ownerRow = (() => {
    const owner = detail.owner as `0x${string}` | null | undefined;
    if (!owner) return null;
    const row = el('div', { style: 'display:flex; align-items:center; gap:8px; color:#9CA3AF;' });
    const avatar = createAddressAvatar(owner);
    Object.assign(avatar.style, { width: '18px', height: '18px', borderRadius: '9999px' });
    row.append(el('span', 'Owner:'), avatar, el('span', shortenAddress(owner)));
    return row;
  })();

  const desc = detail.description
    ? el('p', detail.description, { style: { color: '#d1d5db', margin: '6px 0 0 0' } })
    : null;

  const attrs = (detail.attributes ?? []).filter(a => a?.trait_type);
  const attrGrid = attrs.length
    ? el(
      'div',
      el('h3', 'Attributes', { style: { fontSize: '14px', fontWeight: '600', margin: '0 0 4px 0' } }),
      el(
        'div',
        { style: 'display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px;' },
        ...attrs.map(a =>
          el(
            'div',
            el('div', String(a.trait_type), { style: { fontSize: '11px', color: '#9CA3AF' } }),
            el('div', String(a.value ?? '-'), { style: { fontWeight: '600' } }),
            {
              style: `
                  border:1px solid rgba(255,255,255,0.1);
                  background:rgba(255,255,255,0.03);
                  border-radius:12px; padding:10px;
                `
            }
          )
        )
      ),
      { style: 'display:flex; flex-direction:column; gap:8px;' }
    )
    : null;

  const you = getMyAddress();
  const own = you && detail.owner && you.toLowerCase() === detail.owner.toLowerCase();
  const share = el('sl-button', 'Share', {
    variant: 'default',
    onclick: async () => {
      try { await navigator.clipboard.writeText(window.location.href); alert('Link copied'); }
      catch { alert('Link copied'); }
    }
  });
  const actions = el('div', share, { style: 'display:flex; gap:8px; margin-top:2px;' });

  wrap.append(name);
  if (ownerRow) wrap.append(ownerRow);
  if (desc) wrap.append(desc);
  if (attrGrid) wrap.append(attrGrid);
  wrap.append(actions);
  return wrap;
}

// ---- Page loader ------------------------------------------------------------
async function loadAndRender(root: HTMLElement) {
  const parsed = parsePath();
  root.innerHTML = '';

  if (!parsed) {
    root.append(
      el('div', 'Invalid URL. Expected /god/:id', {
        style: `
          padding:24px; border:1px dashed rgba(255,0,0,0.25);
          color: var(--sl-color-danger-600); border-radius:12px; text-align:center;
        `
      })
    );
    return;
  }

  if (!tokenManager.has() || !getMyAddress()) {
    renderAuthRequired(root);
    return;
  }

  const headerArea = el('div');
  const grid = el('div', { style: 'display:grid; grid-template-columns:1fr; gap:16px;' }) as HTMLDivElement;

  const mq = window.matchMedia('(min-width:1024px)');
  const apply = () => { grid.style.gridTemplateColumns = mq.matches ? '3fr 2fr' : '1fr'; };
  apply(); mq.addEventListener?.('change', apply);

  root.append(el('div', headerArea, grid, { style: 'display:flex; flex-direction:column; gap:16px;' }));

  // skeleton
  const loadingLeft = el('div', el('div', { class: 'aspect-square rounded-xl border border-white/10 bg-white/5 animate-pulse' }));
  const loadingRight = el('div',
    el('div', { class: 'h-6 w-56 rounded-md bg-white/10 animate-pulse' }),
    el('div', { class: 'h-4 w-72 rounded-md bg-white/10 animate-pulse' }),
    el('div', { class: 'h-4 w-64 rounded-md bg-white/10 animate-pulse' }),
    el('div', { class: 'h-4 w-40 rounded-md bg-white/10 animate-pulse' }),
    el('div', { class: 'h-10 w-full rounded-lg bg-white/10 animate-pulse', style: { marginTop: '8px' } }),
    el('div', { class: 'h-10 w-full rounded-lg bg-white/10 animate-pulse' }),
    { style: 'display:flex; flex-direction:column; gap:8px;' }
  );
  grid.append(loadingLeft, loadingRight);

  try {
    const detail = await fetchNftDetail(parsed.id);

    const header = headerBar(detail);
    headerArea.replaceWith(header);

    grid.innerHTML = '';
    grid.append(imagePanel(detail), metaPanel(detail));
  } catch (err) {
    console.error(err);
    grid.innerHTML = '';
    root.append(
      el('div', 'Failed to load this God. Please try again.', {
        style: `
          padding:24px; border:1px dashed rgba(255,0,0,0.25);
          color: var(--sl-color-danger-600); border-radius:12px; text-align:center;
        `
      })
    );
    showErrorAlert('Error', err instanceof Error ? err.message : String(err));
  }
}

// ---- Mount ------------------------------------------------------------------
(function mount() {
  const root = document.getElementById('god-detail-root');
  if (!root) return;

  loadAndRender(root);

  window.addEventListener('auth:signed-in', () => loadAndRender(root));
  window.addEventListener('auth:signed-out', () => loadAndRender(root));
})();
