import {
  createAddressAvatar,
  createRainbowKit,
  openWalletConnectModal,
  shortenAddress,
  tokenManager,
  wagmiConfig
} from '@gaiaprotocol/client-common';
import { ElementType, GenderType } from '@gaiaprotocol/god-mode-shared';
import { disconnect, getAccount, watchAccount } from '@wagmi/core';
import { el } from '@webtaku/el';
import { fetchNftDetail, NftDetail } from './api/nfts';
import { requestLogin } from './auth/login';
import { signMessage } from './auth/siwe';
import { validateToken } from './auth/validate';
import { showErrorAlert } from './components/alert';
import { createGodViewer } from './components/god-viewer';
import './main.css';
import './pages/god-detail';
import './pages/my-gods';

// 상단 우측 Connect 버튼 컨테이너
const connectButtonContainer = document.getElementById('connect-button-container');
if (connectButtonContainer) {

  document.body.appendChild(createRainbowKit());

  // -----------------------------------------------------------------------------
  // 옵션 / 전역 상태
  // -----------------------------------------------------------------------------
  /**
   * 연결 직후 자동으로 서명 모달을 띄울지 여부
   * true  : 연결되면 자동으로 모달을 띄워 로그인 유도
   * false : 상단의 [Sign & Continue] 버튼을 유저가 직접 클릭
   */
  const AUTO_PROMPT_ON_CONNECT = false;

  let authInitialized = false;                     // validateToken 완료 여부
  let requireSignature = true;                     // 연결 시 서명 요구 여부 (토큰 없으면 true)
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
  }

  // -----------------------------------------------------------------------------
  // 서명 모달 (Shoelace <sl-dialog> 사용)
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
      programmaticHide = true;
      dialog!.hide();
      programmaticHide = false;
      dialogOpen = false;
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
  // 상단 Connect/Account 드롭다운 렌더러
  // 상태 정의
  //  A) 토큰 있음(tokenManager.has() == true) → 계정 드롭다운
  //  B) 토큰 없음 + 지갑 연결됨 → [Sign & Continue] + [Disconnect]
  //  C) 지갑 미연결 → [Connect]
  // -----------------------------------------------------------------------------
  function renderConnect() {
    connectButtonContainer!.innerHTML = '';

    // A) 토큰 있음 → 계정 드롭다운
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

            renderConnect();
          }
        } catch (err) {
          console.error(err);
          showErrorAlert('Error', err instanceof Error ? err.message : String(err));
        }
      });

      connectButtonContainer!.appendChild(dropdown);
      return;
    }

    // B) 토큰 없음 + 지갑 연결됨 → [Sign & Continue] + [Disconnect]
    const account = getAccount(wagmiConfig);
    if (account.isConnected) {
      const wrapper = el('div', {
        style: { display: 'flex', gap: '8px', alignItems: 'center' }
      });

      const signBtn = el('sl-button', 'Sign & Continue', {
        variant: 'primary',
        onclick: () => {
          (async () => {
            try { await signAndLogin(); }
            catch (err) {
              console.error(err);
              showErrorAlert('Error', err instanceof Error ? err.message : String(err));
            }
          })();
        }
      });

      const disconnectBtn = el('sl-button', el('sl-icon', { name: 'box-arrow-right' }), {
        variant: 'default',
        onclick: () => {
          tokenManager.clear();
          disconnect(wagmiConfig);
        }
      });

      wrapper.append(signBtn, disconnectBtn);
      connectButtonContainer!.appendChild(wrapper);
      return;
    }

    // C) 지갑 미연결 → [Connect]
    const connectBtn = el('sl-button', 'Connect', {
      variant: 'primary',
      onclick: () => openWalletConnectModal()
    });
    connectButtonContainer!.appendChild(connectBtn);
  }

  // 최초 렌더
  renderConnect();

  // -----------------------------------------------------------------------------
  // 월렛 상태 변화 구독
  // -----------------------------------------------------------------------------
  watchAccount(wagmiConfig, {
    onChange(account) {
      // 주소 캐시
      lastKnownAddress = account.address ?? lastKnownAddress;

      // UI 갱신
      renderConnect();

      if (account.isConnected && account.address && authInitialized && requireSignature) {
        openSignDialog();
      }

      // 연결 직후 자동 서명 모달 (옵션)
      if (
        AUTO_PROMPT_ON_CONNECT &&
        account.isConnected &&
        account.address &&
        authInitialized &&
        requireSignature &&
        !tokenManager.has()
      ) {
        openSignDialog();
      }

      // 연결 끊김 → 모달 닫고 signed-out 알림
      if (!account.isConnected) {
        if (dialog?.open) {
          dialog.hide();
          dialogOpen = false;
        }
      }
    }
  });

  // -----------------------------------------------------------------------------
  // 초기 토큰 유효성 검사 → 상태 정합성 맞추기
  // -----------------------------------------------------------------------------
  (async function initAuth() {
    try {
      const ok = await validateToken();
      if (ok && tokenManager.has()) {
        // 서버/클라이언트 토큰 모두 유효
        requireSignature = false;
        lastKnownAddress = (tokenManager.getAddress() as `0x${string}` | null) ?? lastKnownAddress;
      } else {
        // 토큰 불일치/만료
        tokenManager.clear();
        requireSignature = true;
      }
    } catch {
      // 네트워크/서버 에러 등
      tokenManager.clear();
      requireSignature = true;
    } finally {
      authInitialized = true;
      renderConnect();
    }
  })();
}

const godViewer = document.getElementById('god-viewer');
if (godViewer) {
  // --- 로컬 파서: /god/:id 또는 data-god-id 지원 ---
  function parseIdFromPathOrAttr(rootEl: HTMLElement): string | null {
    // 우선 data-god-id 속성 우선
    const byAttr = rootEl.getAttribute('data-god-id');
    if (byAttr) return decodeURIComponent(byAttr);

    // 없으면 /god/:id 형태에서 파싱
    const parts = window.location.pathname.split('/').filter(Boolean); // ['god', ':id']
    if (parts[0] === 'god-viewer' && parts[1]) return decodeURIComponent(parts[1]);

    return null;
  }

  // --- 로딩 뷰 ---
  function renderLoading(elm: HTMLElement) {
    elm.innerHTML = '';
    const loading = el(
      'div',
      el('sl-spinner'),
      {
        style: `
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          gap:10px; padding:24px;
          background:rgba(255,255,255,0.04);
          aspect-ratio: 1;
        `
      }
    );
    elm.append(loading);
    return loading;
  }

  // --- 에러 뷰 ---
  function renderError(elm: HTMLElement, message: string) {
    elm.innerHTML = '';
    elm.append(
      el('div', message, {
        style: `
          padding:20px; border:1px dashed rgba(255,0,0,0.25);
          color: var(--sl-color-danger-600); border-radius:12px; text-align:center;
        `
      })
    );
  }

  // --- 뷰어 렌더 ---
  function renderViewer(elm: HTMLElement, detail: NftDetail) {
    elm.innerHTML = '';

    // 카드 스타일로 감싼 뷰어
    const card = el('div');

    const viewerEl = createGodViewer({
      type: detail.traits!.Type as ElementType,
      gender: detail.traits!.Gender as GenderType,
      parts: detail.parts as { [category: string]: string },
    });

    card.append(viewerEl);
    elm.append(card);

    // (선택) 다른 곳에서 fired 되는 실시간 변경 적용
    // god-detail의 onChanged와 연동: 'god:attributesChanged' 이벤트 수신
    window.addEventListener('god:attributesChanged', (ev: any) => {
      const next = ev?.detail?.data;
      if (!next) return;

      try {
        const api = (viewerEl as any).__api;
        if (api?.setProps) {
          api.setProps({
            type: next.traits?.Type,
            gender: next.traits?.Gender,
            parts: next.parts,
          });
        } else {
          // API 없으면 재생성
          card.innerHTML = '';
          card.append(
            createGodViewer({
              type: next.traits?.Type,
              gender: next.traits?.Gender,
              parts: next.parts,
            })
          );
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  // --- 메인 플로우 ---
  (async () => {
    const mount = godViewer as HTMLElement;
    renderLoading(mount);

    const id = parseIdFromPathOrAttr(mount);
    if (!id) {
      renderError(mount, 'Invalid URL or missing data-god-id. Expected /god/:id');
      return;
    }

    try {
      const detail = await fetchNftDetail(id);
      renderViewer(mount, detail);
    } catch (err) {
      console.error(err);
      renderError(mount, 'Failed to load this God. Please try again.');
      showErrorAlert('Error', err instanceof Error ? err.message : String(err));
    } finally {
      // 로딩 영역은 renderViewer/renderError에서 innerHTML 갱신으로 사라짐
    }
  })();
}
