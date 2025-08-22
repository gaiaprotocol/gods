import { ElementType, GenderType } from '@gaiaprotocol/god-mode-shared';
import { el } from '@webtaku/el';
import { fetchNftDetail, NftDetail } from './api/nfts';
import { showErrorAlert } from './components/alert';
import { createGodViewer } from './components/god-viewer';
import './viewer.css';

const godViewer = document.getElementById('god-viewer');

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
