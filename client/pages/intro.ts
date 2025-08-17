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

import { requestLogin } from '../auth/login';
import { signMessage } from '../auth/siwe';
import { validateToken } from '../auth/validate';
import { showErrorAlert } from '../components/alert';

// -----------------------------------------------------------------------------
// RainbowKit 부트 (모든 페이지 공통)
// -----------------------------------------------------------------------------
document.body.appendChild(createRainbowKit());

// 상단 우측 Connect 버튼 컨테이너
const connectButtonContainer = document.getElementById('connect-button-container')!;

// -----------------------------------------------------------------------------
// 인증 상태 (전역)
// -----------------------------------------------------------------------------
let authInitialized = false;      // validateToken 완료 여부
let requireSignature = true;      // 연결 시 서명 강제 여부
let lastKnownAddress: `0x${string}` | null = null; // UI 표시용 캐시

// -----------------------------------------------------------------------------
// 내부 헬퍼
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

  requireSignature = false;
  lastKnownAddress = address;

  // 상단 메뉴 갱신
  renderConnect();

  // 앱에 로그인 알림
  window.dispatchEvent(new CustomEvent('auth:signed-in', { detail: { address } }));
}

// -----------------------------------------------------------------------------
// 서명 모달
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

  // 사용자 주도 닫힘만 disconnect 처리
  let programmaticHide = false;
  dialog.addEventListener('sl-request-close', async (ev: any) => {
    if (programmaticHide) return;
    ev.preventDefault();
    try {
      await disconnect(wagmiConfig);
    } finally {
      programmaticHide = true;
      dialog!.hide();
      programmaticHide = false;
      dialogOpen = false;
      window.dispatchEvent(new CustomEvent('auth:signed-out'));
    }
  });

  cancelBtn.addEventListener('click', () => dialog!.hide());

  signBtn.addEventListener('click', async () => {
    (signBtn as any).loading = true;
    try {
      await signAndLogin();
      programmaticHide = true;
      dialog!.hide();
      dialogOpen = false;
      programmaticHide = false;
    } catch (err) {
      console.error(err);
      showErrorAlert('Error', err instanceof Error ? err.message : String(err));
      dialog!.hide(); // 실패 시 cancel과 동일 경로
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
// 상단 Connect/Account 드롭다운
// -----------------------------------------------------------------------------
function renderConnect() {
  connectButtonContainer.innerHTML = '';

  // 1) 토큰 보유 시 → 계정 드롭다운
  if (tokenManager.has()) {
    const address =
      getAccount(wagmiConfig).address ??
      (tokenManager.getAddress() as `0x${string}` | null) ??
      lastKnownAddress;
    const label = address ? shortenAddress(address) : 'Account';

    const btn = el('sl-button', label, { slot: 'trigger', pill: true });
    if (address) {
      const avatar = createAddressAvatar(address);
      avatar.setAttribute('slot', 'prefix');
      Object.assign(avatar.style, { width: '22px', height: '22px', borderRadius: '9999px' });
      btn.prepend(avatar);
    }

    const menu = el(
      'sl-menu',
      el('sl-menu-item', 'My Gods', { 'data-action': 'my-gods' }),
      el('sl-menu-item', 'Logout', { 'data-action': 'logout' })
    );

    const dropdown = el('sl-dropdown', btn, menu, { placement: 'bottom-end', distance: 6 });

    menu.addEventListener('sl-select', async (e: any) => {
      const action = e.detail?.item?.getAttribute('data-action');
      try {
        if (action === 'my-gods') {
          window.dispatchEvent(new CustomEvent('nav:my-gods'));
          window.location.assign('/my-gods');
        } else if (action === 'logout') {
          tokenManager.clear();
          await disconnect(wagmiConfig);

          requireSignature = true;
          lastKnownAddress = null;

          window.dispatchEvent(new CustomEvent('auth:signed-out'));
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

  // 2) 토큰 없을 때 → Connect/Disconnect 토글
  const isConnected = getAccount(wagmiConfig).isConnected;
  const btn = el(
    'sl-button',
    isConnected ? 'Disconnect' : 'Connect',
    {
      variant: isConnected ? 'default' : 'primary',
      onclick: () => {
        if (getAccount(wagmiConfig).isConnected) {
          disconnect(wagmiConfig).finally(() => {
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

// 최초 렌더
renderConnect();

// 월렛 상태 변화
watchAccount(wagmiConfig, {
  onChange(account) {
    lastKnownAddress = account.address ?? lastKnownAddress;
    renderConnect();

    // 조건 충족 시 서명 모달 출력
    if (account.isConnected && account.address && authInitialized && requireSignature) {
      openSignDialog();
    }

    // 연결 종료 시 모달 닫고 signed-out 알림
    if (!account.isConnected) {
      if (dialog?.open) {
        dialog.hide();
        dialogOpen = false;
      }
      window.dispatchEvent(new CustomEvent('auth:signed-out'));
    }
  }
});

// 초기 토큰 유효성 검사
(async function initAuth() {
  try {
    const ok = await validateToken();
    if (ok && tokenManager.has()) {
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
