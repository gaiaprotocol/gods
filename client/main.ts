import {
  createAddressAvatar,
  createRainbowKit,
  openWalletConnectModal,
  shortenAddress,
  tokenManager,
  wagmiConfig
} from '@gaiaprotocol/client-common';
import { disconnect, getAccount, watchAccount } from '@wagmi/core';
import { el } from '@webtaku/el';

import { requestLogin } from './auth/login';
import { signMessage } from './auth/siwe';
import { validateToken } from './auth/validate';
import { showErrorAlert } from './components/alert';

import { fetchHeldNfts, HeldNft } from './api/nfts';

// -----------------------------------------------------------------------------
// Boot RainbowKit UI
// -----------------------------------------------------------------------------
document.body.appendChild(createRainbowKit());

// Top-right connect button container
const connectButtonContainer = document.getElementById('connect-button-container')!;

// -----------------------------------------------------------------------------
// Auth state
// -----------------------------------------------------------------------------
let authInitialized = false;                      // finished validateToken check?
let requireSignature = true;                      // if true, force signature modal on connect
let lastKnownAddress: `0x${string}` | null = null; // for UI label/avatars

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function ensureWalletConnected(): `0x${string}` {
  const account = getAccount(wagmiConfig);
  if (!account.isConnected || !account.address) {
    throw new Error('No wallet connected');
  }
  return account.address;
}

async function signAndLogin(): Promise<void> {
  const address = ensureWalletConnected();
  const signature = await signMessage(address);
  const token = await requestLogin(address, signature);
  tokenManager.set(token, address);

  // Got a token → no more signature prompt
  requireSignature = false;
  lastKnownAddress = address;

  // Update UI (dropdown)
  renderConnect();

  // Notify the app (soft navigation without reload)
  window.dispatchEvent(new CustomEvent('auth:signed-in', { detail: { address } }));
}

// -----------------------------------------------------------------------------
// Signature modal
// -----------------------------------------------------------------------------
let dialog: any | null = null; // <sl-dialog>
let dialogOpen = false;

function buildDialog() {
  if (dialog) return dialog;

  const title = el('div', 'Signature Required', {
    style: { fontWeight: '600', fontSize: '16px', marginBottom: '8px' }
  });

  const message = el('p', 'To access Gods, please sign a message with your connected wallet.');

  const cancelBtn = el('sl-button', 'Cancel', { variant: 'default' });
  const signBtn = el('sl-button', 'Sign & Continue', { variant: 'primary' });

  const footer = el(
    'div',
    cancelBtn,
    signBtn,
    { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' } }
  );

  dialog = el('sl-dialog', el('div', title, message, footer), { label: 'Authentication Required' });

  // Only user-driven closes (ESC/overlay/close/Cancel) should disconnect.
  let programmaticHide = false;
  dialog.addEventListener('sl-request-close', async (ev: any) => {
    if (programmaticHide) return; // ignore our own hide() calls
    ev.preventDefault();
    try {
      await disconnect(wagmiConfig);
    } finally {
      programmaticHide = true;
      dialog!.hide();
      programmaticHide = false;
      dialogOpen = false;
      // Treat as sign-out UX-wise
      window.dispatchEvent(new CustomEvent('auth:signed-out'));
    }
  });

  cancelBtn.addEventListener('click', () => dialog!.hide());

  signBtn.addEventListener('click', async () => {
    (signBtn as any).loading = true;
    try {
      await signAndLogin();
      // Success: close without disconnecting
      programmaticHide = true;
      dialog!.hide();
      dialogOpen = false;
      programmaticHide = false;
    } catch (err) {
      console.error(err);
      showErrorAlert('Error', err instanceof Error ? err.message : String(err));
      // On failure, behave like cancel (close → disconnect via request-close)
      dialog!.hide();
    } finally {
      (signBtn as any).loading = false;
    }
  });

  document.body.appendChild(dialog);
  return dialog;
}

function openSignDialog() {
  if (dialogOpen) return;
  const d = buildDialog();
  dialogOpen = true;
  d.show();
}

// -----------------------------------------------------------------------------
// Top-right connection / account menu
// -----------------------------------------------------------------------------
function renderConnect() {
  connectButtonContainer.innerHTML = '';

  // 1) If we have a token → show account dropdown
  if (tokenManager.has()) {
    const address =
      getAccount(wagmiConfig).address ??
      (tokenManager.getAddress() as `0x${string}` | null) ??
      lastKnownAddress;
    const label = address ? shortenAddress(address) : 'Account';

    // Trigger button with avatar
    const btn = el('sl-button', label, { slot: 'trigger', pill: true });
    if (address) {
      const avatar = createAddressAvatar(address);
      avatar.setAttribute('slot', 'prefix');
      Object.assign(avatar.style, { width: '22px', height: '22px', borderRadius: '9999px' });
      btn.prepend(avatar);
    }

    // Menu
    const menu = el(
      'sl-menu',
      el('sl-menu-item', 'My Gods', { 'data-action': 'my-gods' }),
      el('sl-menu-item', 'Logout', { 'data-action': 'logout' })
    );

    // Dropdown
    const dropdown = el('sl-dropdown', btn, menu, { placement: 'bottom-end', distance: 6 });

    menu.addEventListener('sl-select', async (e: any) => {
      const action = e.detail?.item?.getAttribute('data-action');
      try {
        if (action === 'my-gods') {
          window.dispatchEvent(new CustomEvent('nav:my-gods'));
          window.location.assign('/my-gods'); // adapt if using a SPA router
        } else if (action === 'logout') {
          tokenManager.clear();
          await disconnect(wagmiConfig);

          // Reset local auth state
          requireSignature = true;
          lastKnownAddress = null;

          // Soft refresh everywhere that cares (including My Gods)
          window.dispatchEvent(new CustomEvent('auth:signed-out'));

          // Re-render the connect area
          renderConnect();
        }
      } catch (err) {
        console.error(err);
        showErrorAlert('Error', err instanceof Error ? err.message : String(err));
      }
    });

    connectButtonContainer.appendChild(dropdown);
    return;
  }

  // 2) If we don't have a token → show Connect/Disconnect
  const isConnected = getAccount(wagmiConfig).isConnected;
  const btn = el(
    'sl-button',
    isConnected ? 'Disconnect' : 'Connect',
    {
      variant: isConnected ? 'default' : 'primary',
      onclick: () => {
        if (getAccount(wagmiConfig).isConnected) {
          disconnect(wagmiConfig).finally(() => {
            // Reflect signed-out UX-wise
            window.dispatchEvent(new CustomEvent('auth:signed-out'));
          });
        } else {
          openWalletConnectModal();
        }
      }
    }
  );
  connectButtonContainer.appendChild(btn);
}

// Initial render of the connect area
renderConnect();

// React to wallet status changes
watchAccount(wagmiConfig, {
  onChange(account) {
    // cache address for avatar/label
    lastKnownAddress = account.address ?? lastKnownAddress;
    renderConnect();

    // Open modal when: connected + address present + auth check done + signature required
    if (account.isConnected && account.address && authInitialized && requireSignature) {
      openSignDialog();
    }

    // Close modal if disconnected; treat as sign-out for the UI layer
    if (!account.isConnected) {
      if (dialog?.open) {
        dialog.hide();
        dialogOpen = false;
      }
      window.dispatchEvent(new CustomEvent('auth:signed-out'));
    }
  }
});

// First-run token validation controls whether we must prompt for a signature
(async function initAuth() {
  try {
    const ok = await validateToken();
    if (ok && tokenManager.has()) {
      // Valid token → skip signature requirement
      requireSignature = false;
      lastKnownAddress = (tokenManager.getAddress() as `0x${string}` | null) ?? lastKnownAddress;
    } else {
      tokenManager.clear();
      requireSignature = true;
    }
  } catch {
    tokenManager.clear();
    requireSignature = true;
  } finally {
    authInitialized = true;
    renderConnect();
  }
})();

// -----------------------------------------------------------------------------
// My Gods page rendering
// -----------------------------------------------------------------------------

// Normalize relative/absolute image paths
function toImageUrl(img?: string | null) {
  if (!img) return '';
  try {
    return new URL(img).href;
  } catch {
    return `https://god-images.gaia.cc/${img}`;
  }
}

function getMyAddress(): `0x${string}` | null {
  // Prefer the token-bound address; fall back to wagmi
  const addr =
    (tokenManager.getAddress() as `0x${string}` | null) ??
    (getAccount(wagmiConfig).address as `0x${string}` | null) ??
    null;
  return addr;
}

function ensureAuthUI(container: HTMLElement) {
  container.innerHTML = '';

  const box = el('div', {
    style: `
      display:flex; flex-direction:column; align-items:center; justify-content:center;
      gap:12px; padding:48px 16px; text-align:center; border:1px dashed rgba(255,255,255,0.12);
      border-radius:16px; background:rgba(255,255,255,0.02);
    `
  });

  const title = el('h2', 'Sign-in required', {
    style: 'font-size:18px; font-weight:600; margin:0;'
  });
  const desc = el(
    'p',
    'Connect your wallet and complete the signature to view your Gods.',
    { style: 'color:#9CA3AF; margin:0;' }
  );
  const hint = el(
    'p',
    'Use the Connect button at the top-right, then complete the signature.',
    { style: 'color:#9CA3AF; margin:0;' }
  );

  box.append(title, desc, hint);
  container.append(box);
}

function createHeader(address: `0x${string}` | null, count: number) {
  const header = el('div', {
    style: `
      display:flex; align-items:center; justify-content:space-between;
      margin-bottom:16px; gap:12px;
    `
  });

  const left = el('div', { style: 'display:flex; align-items:center; gap:12px;' });
  const title = el('h1', 'My Gods', { style: 'font-size:20px; font-weight:700; margin:0;' });
  left.append(title);

  if (address) {
    const addrWrap = el('div', {
      style: 'display:flex; align-items:center; gap:8px; opacity:.9;'
    });
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

function createGrid() {
  const grid = el('div', {
    style: `
      display:grid;
      grid-template-columns: repeat(1, minmax(0, 1fr));
      gap:12px;
    `
  }) as HTMLDivElement;

  // Basic responsiveness
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

async function loadAndRender(root: HTMLElement) {
  const address = getMyAddress();

  root.innerHTML = '';
  const headerArea = el('div');
  const grid = createGrid();
  const section = el('section', headerArea, grid, { style: 'display:flex; flex-direction:column; gap:12px;' });
  root.append(section);

  // Access control: must have a valid token AND an address
  if (!tokenManager.has() || !address) {
    ensureAuthUI(root);
    return;
  }

  // Header
  const { header, refreshBtn } = createHeader(address, 0);
  headerArea.replaceWith(header);

  // Loading state
  grid.innerHTML = '';
  grid.append(
    el('div', 'Loading Gods…', {
      style: `grid-column:1/-1; text-align:center; color:#9CA3AF; padding:16px;`
    })
  );

  // Fetch & render
  try {
    const items = await fetchHeldNfts(address, {});
    (header.querySelector('sl-badge') as HTMLElement).innerText = String(items.length);

    grid.innerHTML = '';
    if (!items.length) {
      renderEmpty(grid);
      return;
    }

    const onOpen = (n: HeldNft) => {
      const url = `/god/${encodeURIComponent(n.collection)}/${encodeURIComponent(String(n.id))}`;
      window.location.assign(url);
    };

    for (const n of items) grid.append(renderCard(n, onOpen));

    // Manual refresh
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

// Mount the page
(function mount() {
  const root = document.getElementById('my-gods-root');
  if (!root) return;

  // Initial render
  loadAndRender(root);

  // Refresh after successful sign-in (token minted)
  window.addEventListener('auth:signed-in', () => loadAndRender(root));

  // Refresh after any sign-out/logout/disconnect
  window.addEventListener('auth:signed-out', () => loadAndRender(root));
})();
