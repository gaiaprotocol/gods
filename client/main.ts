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
import { validateToken } from './auth/validate'; // ⬅️ 추가
import { showErrorAlert } from './components/alert';

document.body.appendChild(createRainbowKit());

const connectButtonContainer = document.querySelector('.connect-button-container')!;

// ---------- auth state ----------
let authInitialized = false;       // validateToken 체크가 끝났는지
let requireSignature = true;       // true면 연결 시 서명 모달 강제
let lastKnownAddress: `0x${string}` | null = null; // UI 표시에 사용

// ---------- helpers ----------
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

  // 토큰 확보 → 서명 요구 해제 & 주소 저장
  requireSignature = false;
  lastKnownAddress = address;

  // UI 갱신(드롭다운 메뉴로)
  renderConnect();

  // 필요하면 라우팅/이벤트 발생(하드 리로드 없이)
  window.dispatchEvent(new CustomEvent('auth:signed-in', { detail: { address } }));
}

// ---------- modal ----------
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

  // 사용자 주도 닫힘(ESC/오버레이/닫기/Cancel)만 로그아웃; 성공 경로는 제외
  let programmaticHide = false;
  dialog.addEventListener('sl-request-close', async (ev: any) => {
    if (programmaticHide) return;    // 우리 코드가 호출한 hide()면 무시
    ev.preventDefault();             // 기본 닫힘 막고
    try {
      await disconnect(wagmiConfig); // 즉시 지갑 연결 해제
    } finally {
      programmaticHide = true;
      dialog!.hide();                // 이제 닫기
      programmaticHide = false;
      dialogOpen = false;
    }
  });

  cancelBtn.addEventListener('click', () => dialog!.hide());

  signBtn.addEventListener('click', async () => {
    (signBtn).loading = true;
    try {
      await signAndLogin();
      // 성공: disconnect 하지 않고 닫기만
      programmaticHide = true;
      dialog!.hide();
      dialogOpen = false;
      programmaticHide = false;
    } catch (err) {
      console.error(err);
      showErrorAlert('Error', err instanceof Error ? err.message : String(err));
      // 실패는 취소처럼 처리(닫으면 위의 request-close로 disconnect)
      dialog!.hide();
    } finally {
      (signBtn).loading = false;
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

// ---------- top-right area ----------
function renderConnect() {
  connectButtonContainer.innerHTML = '';

  // 1) 토큰이 있으면 → 인증 메뉴 표시
  if (tokenManager.has()) {
    const address = getAccount(wagmiConfig).address ?? (tokenManager.getAddress() as `0x${string}` | null) ?? lastKnownAddress;
    const label = address ? shortenAddress(address) : 'Account';

    // trigger button (optionally with avatar)
    const btn = el('sl-button', label, { slot: 'trigger', pill: true });
    if (address) {
      const avatar = createAddressAvatar(address);
      avatar.setAttribute('slot', 'prefix');
      Object.assign(avatar.style, { width: '22px', height: '22px', borderRadius: '9999px' });
      btn.prepend(avatar);
    }

    // menu
    const menu = el(
      'sl-menu',
      el('sl-menu-item', 'My Gods', { 'data-action': 'my-gods' }),
      el('sl-menu-item', 'Logout', { 'data-action': 'logout' })
    );

    // dropdown
    const dropdown = el(
      'sl-dropdown',
      btn,
      menu,
      { placement: 'bottom-end', distance: 6 }
    );

    menu.addEventListener('sl-select', async (e: any) => {
      const action = e.detail?.item?.getAttribute('data-action');
      try {
        if (action === 'my-gods') {
          window.dispatchEvent(new CustomEvent('nav:my-gods'));
          window.location.assign('/my-gods'); // SPA 라우터가 있으면 router.navigate('/my-gods')
        } else if (action === 'logout') {
          tokenManager.clear();
          await disconnect(wagmiConfig);
          // 상태 초기화
          requireSignature = true;
          lastKnownAddress = null;
        }
      } catch (err) {
        console.error(err);
        showErrorAlert('Error', err instanceof Error ? err.message : String(err));
      }
    });

    connectButtonContainer.appendChild(dropdown);
    return;
  }

  // 2) 토큰이 없으면 → Connect/Disconnect 스위치
  const isConnected = getAccount(wagmiConfig).isConnected;
  const btn = el(
    'sl-button',
    isConnected ? 'Disconnect' : 'Connect',
    {
      variant: isConnected ? 'default' : 'primary',
      onclick: () => {
        if (getAccount(wagmiConfig).isConnected) {
          disconnect(wagmiConfig);
        } else {
          openWalletConnectModal();
        }
      }
    }
  );
  connectButtonContainer.appendChild(btn);
}

// ---------- bootstrap ----------
renderConnect();

// 지갑 상태 변화
watchAccount(wagmiConfig, {
  onChange(account) {
    // 주소 캐시
    lastKnownAddress = account.address ?? lastKnownAddress;
    renderConnect();

    // 모달 오픈 조건: 연결됨 && validateToken 검사 끝 && 서명 필요 상태
    if (account.isConnected && account.address && authInitialized && requireSignature) {
      openSignDialog();
    }

    // 연결이 끊기면 모달 닫기
    if (!account.isConnected && dialog?.open) {
      dialog.hide();
      dialogOpen = false;
    }
  }
});

// 최초 기동 시 토큰 유효성 검사 → 결과에 따라 서명 요구 여부 설정
(async function initAuth() {
  try {
    const ok = await validateToken();
    if (ok && tokenManager.has()) {
      // 토큰 유효 → 서명 모달을 띄우지 않음
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
    renderConnect(); // 상태 반영
  }
})();
